import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

const payloadSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['super_admin', 'admin', 'moderator']).default('admin'),
});

const ensureAdminUser = async () => {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { ok: false as const, status: 401, message: 'Unauthorized' };
    }

    const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id, role')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

    if (adminError || !adminUser) {
        return { ok: false as const, status: 403, message: 'Admin access required' };
    }

    return { ok: true as const, user, role: adminUser.role as string };
};

const findAuthUserByEmail = async (email: string) => {
    const adminSupabase = createAdminClient();
    let page = 1;
    const perPage = 200;

    while (page <= 25) {
        const { data, error } = await adminSupabase.auth.admin.listUsers({ page, perPage });
        if (error) throw error;

        const users = data?.users || [];
        const found = users.find((candidate) => (candidate.email || '').toLowerCase() === email.toLowerCase());
        if (found) return found;

        if (users.length < perPage) break;
        page += 1;
    }

    return null;
};

export async function POST(request: Request) {
    try {
        const adminCheck = await ensureAdminUser();
        if (!adminCheck.ok) {
            return NextResponse.json({ success: false, error: adminCheck.message }, { status: adminCheck.status });
        }

        const body = await request.json();
        const payload = payloadSchema.parse(body);
        const normalizedEmail = payload.email.trim().toLowerCase();

        const adminSupabase = createAdminClient();
        const existingUser = await findAuthUserByEmail(normalizedEmail);

        let targetUserId: string;
        if (existingUser) {
            const { data: updatedUser, error: updateError } = await adminSupabase.auth.admin.updateUserById(existingUser.id, {
                email: normalizedEmail,
                password: payload.password,
                email_confirm: true,
            });

            if (updateError || !updatedUser.user) {
                throw new Error(updateError?.message || 'Failed to update existing auth user.');
            }

            targetUserId = updatedUser.user.id;
        } else {
            const { data: createdUser, error: createError } = await adminSupabase.auth.admin.createUser({
                email: normalizedEmail,
                password: payload.password,
                email_confirm: true,
            });

            if (createError || !createdUser.user) {
                throw new Error(createError?.message || 'Failed to create auth user.');
            }

            targetUserId = createdUser.user.id;
        }

        const { error: upsertError } = await adminSupabase
            .from('admin_users')
            .upsert(
                {
                    user_id: targetUserId,
                    email: normalizedEmail,
                    role: payload.role,
                    is_active: true,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: 'user_id' }
            );

        if (upsertError) {
            throw new Error(upsertError.message);
        }

        return NextResponse.json({
            success: true,
            message: existingUser
                ? 'Existing user updated and granted admin access.'
                : 'New admin user created successfully.',
            admin: {
                userId: targetUserId,
                email: normalizedEmail,
                role: payload.role,
            },
        });
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ success: false, error: 'Invalid payload', details: error.issues }, { status: 400 });
        }

        const message = error instanceof Error ? error.message : 'Failed to create admin user';
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}


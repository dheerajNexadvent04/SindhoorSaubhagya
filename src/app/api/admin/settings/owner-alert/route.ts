import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { getOwnerAlertSettings, setOwnerAlertEnabled } from '@/lib/adminSettings';

const payloadSchema = z.object({
    enabled: z.boolean(),
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
        .maybeSingle();

    if (adminError || !adminUser) {
        return { ok: false as const, status: 403, message: 'Admin access required' };
    }

    return { ok: true as const, user };
};

export async function GET() {
    try {
        const adminCheck = await ensureAdminUser();
        if (!adminCheck.ok) {
            return NextResponse.json({ success: false, error: adminCheck.message }, { status: adminCheck.status });
        }

        const settings = await getOwnerAlertSettings();
        return NextResponse.json({ success: true, settings });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to read owner alert settings';
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const adminCheck = await ensureAdminUser();
        if (!adminCheck.ok) {
            return NextResponse.json({ success: false, error: adminCheck.message }, { status: adminCheck.status });
        }

        const body = await request.json();
        const payload = payloadSchema.parse(body);
        const settings = await setOwnerAlertEnabled(payload.enabled, adminCheck.user.email ?? adminCheck.user.id);

        return NextResponse.json({
            success: true,
            message: `Owner profile alert has been ${payload.enabled ? 'enabled' : 'disabled'}.`,
            settings,
        });
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ success: false, error: 'Invalid payload', details: error.issues }, { status: 400 });
        }

        const message = error instanceof Error ? error.message : 'Failed to update owner alert settings';
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

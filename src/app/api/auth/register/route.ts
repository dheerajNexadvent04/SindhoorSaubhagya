import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validation Schema
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string().regex(/^\+91[0-9]{10}$/, "Invalid India phone number format (+91XXXXXXXXXX)"),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    gender: z.enum(['male', 'female', 'other']),
    dateOfBirth: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)), // Accept ISO or YYYY-MM-DD
    religionId: z.string().uuid().optional(),
    casteId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input
        const validatedData = registerSchema.parse(body);

        const supabase = await createClient();

        // 1. Sign up user with Supabase Auth
        // We pass metadata so the trigger can pick it up if configured,
        // otherwise we manually update the profile below.
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: validatedData.email,
            password: validatedData.password,
            phone: validatedData.phone,
            options: {
                data: {
                    first_name: validatedData.firstName,
                    last_name: validatedData.lastName,
                    gender: validatedData.gender,
                    date_of_birth: validatedData.dateOfBirth,
                }
            }
        });

        if (authError) {
            console.error("Auth Error:", authError);
            return NextResponse.json(
                { success: false, error: authError.message },
                { status: 400 }
            );
        }

        if (!authData.user) {
            return NextResponse.json(
                { success: false, error: "User creation failed" },
                { status: 500 }
            );
        }

        // 2. Initial Profile Setup
        // If the database trigger 'on_auth_user_created' is active, the profile is already created.
        // We can perform an update to ensure all fields are set correctly, especially those 
        // that might not be in the trigger logic (like religion/caste).

        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                first_name: validatedData.firstName,
                last_name: validatedData.lastName,
                gender: validatedData.gender,
                date_of_birth: validatedData.dateOfBirth,
                religion_id: validatedData.religionId,
                caste_id: validatedData.casteId,
                status: 'pending' // Enforce pending status until verified/approved
            })
            .eq('id', authData.user.id);

        if (profileError) {
            console.error("Profile Error:", profileError);
            // Note: User is created in Auth but profile update failed. 
            // In a real production app, you might want to rollback (delete user) 
            // or schedule a retry. For now, we return the error.
            return NextResponse.json(
                { success: false, error: "User created but profile setup failed: " + profileError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Registration successful. Please check your email for verification.',
            userId: authData.user.id
        });

    } catch (error: any) {
        console.error("Server Error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Validation Error", details: (error as any).errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

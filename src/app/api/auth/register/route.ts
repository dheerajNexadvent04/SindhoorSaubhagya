import { createClient } from '@/utils/supabase/server';
import { sendNewProfileOwnerAlert } from '@/lib/profileAlertEmail';
import { isOwnerAlertEnabled } from '@/lib/adminSettings';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.preprocess(
        (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
        z.string().regex(/^(\+?[0-9]{10,15})$/, "Invalid phone format. Use digits (10-15) with optional +country code.").optional()
    ),
    firstName: z.string().min(2),
    lastName: z.preprocess(
        (value) => (typeof value === 'string' ? value.trim() : value),
        z.string().optional().default('')
    ),
    gender: z.enum(['male', 'female', 'other']).optional(),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    profileFor: z.string().optional(),
    managedBy: z.string().optional(),
    height: z.coerce.number().optional(),
    weight: z.coerce.number().optional(),
    bodyType: z.string().optional(),
    bloodGroup: z.string().optional(),
    complexion: z.string().optional(),
    maritalStatus: z.string().optional(),
    lookingFor: z.string().optional(),
    motherTongue: z.string().optional(),
    religion: z.string().optional(),
    caste: z.string().optional(),
    subCaste: z.string().optional(),
    manglik: z.string().optional(),
    degree: z.string().optional(),
    employedIn: z.string().optional(),
    occupation: z.string().optional(),
    income: z.coerce.number().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    familyType: z.string().optional(),
    fatherOcc: z.string().optional(),
    motherOcc: z.string().optional(),
    brothersTotal: z.coerce.number().optional(),
    brothersMarried: z.coerce.number().optional(),
    sistersTotal: z.coerce.number().optional(),
    sistersMarried: z.coerce.number().optional(),
    nativeCity: z.string().optional(),
    familyLocation: z.string().optional(),
    aboutFamily: z.string().optional(),
    aboutMe: z.string().optional(),
});

const normalizePhone = (phone?: string) => {
    if (!phone) return undefined;
    const trimmed = phone.trim();
    if (!trimmed) return undefined;

    const digits = trimmed.replace(/\D/g, '');
    if (!digits) return undefined;

    if (trimmed.startsWith('+')) return `+${digits}`;
    if (digits.length === 10) return `+91${digits}`;
    return `+${digits}`;
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = registerSchema.parse(body);
        const supabase = await createClient();
        const origin = new URL(request.url).origin;
        const normalizedPhone = normalizePhone(validatedData.phone);

        const signUpPayload = {
            email: validatedData.email,
            password: validatedData.password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
                data: {
                    first_name: validatedData.firstName,
                    last_name: validatedData.lastName,
                    gender: validatedData.gender,
                    date_of_birth: validatedData.dob,
                    phone: normalizedPhone,
                    profile_for: validatedData.profileFor,
                    managed_by: validatedData.managedBy,
                    looking_for: validatedData.lookingFor,
                    height: validatedData.height,
                    weight: validatedData.weight,
                    body_type: validatedData.bodyType,
                    blood_group: validatedData.bloodGroup,
                    complexion: validatedData.complexion,
                    marital_status: validatedData.maritalStatus,
                    mother_tongue: validatedData.motherTongue,
                    religion_name: validatedData.religion,
                    caste_name: validatedData.caste,
                    sub_caste_name: validatedData.subCaste,
                    manglik: validatedData.manglik,
                    degree: validatedData.degree,
                    employed_in: validatedData.employedIn,
                    occupation: validatedData.occupation,
                    annual_income: validatedData.income,
                    country: validatedData.country,
                    state: validatedData.state,
                    city: validatedData.city,
                    family_type: validatedData.familyType,
                    father_occupation: validatedData.fatherOcc,
                    mother_occupation: validatedData.motherOcc,
                    brothers_total: validatedData.brothersTotal,
                    brothers_married: validatedData.brothersMarried,
                    sisters_total: validatedData.sistersTotal,
                    sisters_married: validatedData.sistersMarried,
                    native_city: validatedData.nativeCity,
                    family_location: validatedData.familyLocation,
                    about_family: validatedData.aboutFamily,
                    about_me: validatedData.aboutMe,
                }
            }
        };

        if (normalizedPhone) {
            (signUpPayload as { phone?: string }).phone = normalizedPhone;
        }

        const { data: authData, error: authError } = await supabase.auth.signUp(signUpPayload);

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

        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                first_name: validatedData.firstName,
                last_name: validatedData.lastName,
                gender: validatedData.gender,
                date_of_birth: validatedData.dob,
                phone: normalizedPhone,
                profile_for: validatedData.profileFor,
                managed_by: validatedData.managedBy,
                looking_for: validatedData.lookingFor,
                height: validatedData.height,
                weight: validatedData.weight,
                body_type: validatedData.bodyType,
                blood_group: validatedData.bloodGroup,
                complexion: validatedData.complexion,
                marital_status: validatedData.maritalStatus,
                mother_tongue: validatedData.motherTongue,
                religion_name: validatedData.religion,
                caste_name: validatedData.caste,
                sub_caste_name: validatedData.subCaste,
                manglik: validatedData.manglik,
                degree: validatedData.degree,
                employed_in: validatedData.employedIn,
                occupation: validatedData.occupation,
                annual_income: validatedData.income,
                country: validatedData.country,
                state: validatedData.state,
                city: validatedData.city,
                family_type: validatedData.familyType,
                father_occupation: validatedData.fatherOcc,
                mother_occupation: validatedData.motherOcc,
                brothers_total: validatedData.brothersTotal,
                brothers_married: validatedData.brothersMarried,
                sisters_total: validatedData.sistersTotal,
                sisters_married: validatedData.sistersMarried,
                native_city: validatedData.nativeCity,
                family_location: validatedData.familyLocation,
                about_family: validatedData.aboutFamily,
                about_me: validatedData.aboutMe,
                email: validatedData.email,
                status: 'pending' // Enforce pending status until verified/approved
            })
            .eq('id', authData.user.id);

        if (profileError) {
            console.error("Profile Error:", profileError);
            return NextResponse.json(
                { success: false, error: "User created but profile setup failed: " + profileError.message },
                { status: 500 }
            );
        }

        try {
            const ownerAlertEnabled = await isOwnerAlertEnabled();
            if (ownerAlertEnabled) {
                await sendNewProfileOwnerAlert({
                    userId: authData.user.id,
                    email: validatedData.email,
                    firstName: validatedData.firstName,
                    lastName: validatedData.lastName,
                    phone: normalizedPhone,
                    profileFor: validatedData.profileFor,
                    gender: validatedData.gender,
                    religion: validatedData.religion,
                    caste: validatedData.caste,
                    city: validatedData.city,
                    state: validatedData.state,
                });
            } else {
                console.log('Owner alert email skipped: admin toggle is disabled.');
            }
        } catch (mailOrSettingError) {
            console.error("Owner alert email failed:", mailOrSettingError);
        }

        return NextResponse.json({
            success: true,
            message: 'Registration successful. Please check your email for verification.',
            userId: authData.user.id
        });

    } catch (error: unknown) {
        console.error("Server Error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Validation Error", details: error.issues },
                { status: 400 }
            );
        }

        const message = error instanceof Error ? error.message : "Internal Server Error";

        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}

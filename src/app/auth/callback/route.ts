import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { EmailOtpType } from '@supabase/supabase-js';

import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const tokenHash = requestUrl.searchParams.get('token_hash');
    const type = requestUrl.searchParams.get('type') as EmailOtpType | null;
    const nextParam = requestUrl.searchParams.get('next') || '/';
    const safeNext = nextParam.startsWith('/') ? nextParam : '/';
    const supabase = await createClient();
    let authError = '';

    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
            authError = error.message;
        }
    } else if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type,
        });
        if (error) {
            authError = error.message;
        }
    }

    const redirectUrl = new URL(`${requestUrl.origin}${safeNext}`);
    if (authError) {
        redirectUrl.searchParams.set('error', authError);
    }

    return NextResponse.redirect(redirectUrl);
}

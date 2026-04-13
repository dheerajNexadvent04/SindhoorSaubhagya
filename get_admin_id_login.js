const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

async function getAdminID() {
    if (!email || !password) {
        console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local before running this script.');
        process.exit(1);
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error('Login failed:', error.message);
        return;
    }

    console.log('Admin ID:', data.user.id);
}

getAdminID();

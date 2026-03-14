require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
    console.log("Checking profiles table columns...");

    // Attempt to select a non-existent column to get the list of columns from the error message
    const { error } = await supabase.from('profiles').select('dummy_column_to_get_error').limit(1);

    if (error) {
        console.log("Error message (should contain columns):", error.message);
    } else {
        console.log("No error returned? That's strange.");
    }
}

check();

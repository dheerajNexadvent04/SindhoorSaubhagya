require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkData() {
    console.log("--- CHECKING FOR ANY PROFILES ---");
    
    // 1. Try to see any profile (if any are approved or public)
    const { data, error, count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .limit(1);
    
    if (error) {
        console.log("Error checking profiles:", error.message);
    } else {
        console.log("Total visible profiles (as Anon):", count);
        console.log("Sample Data:", data);
    }

    // 2. Try to see if 'user_id' column exists
    const { error: colError } = await supabase.from('profiles').select('user_id').limit(1);
    console.log("'user_id' column exists?", !colError);
    if (colError) console.log("Col Error:", colError.message);

    // 3. Try to see if 'id' column exists (it must, but is it the right one?)
    const { error: idColError } = await supabase.from('profiles').select('id').limit(1);
    console.log("'id' column exists?", !idColError);
}

checkData();

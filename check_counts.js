require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkCounts() {
    console.log("--- DEBUGGING DATABASE ACCESS ---");
    
    const { count, error } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
    
    if (error) {
        console.log("Profiles Error:", error.message, error.details, error.hint);
    } else {
        console.log("Profiles Count:", count);
    }

    const { count: aCount, error: aError } = await supabase
        .from('admin_users')
        .select('id', { count: 'exact', head: true });
    
    if (aError) {
        console.log("Admin Users Error:", aError.message, aError.details, aError.hint);
    } else {
        console.log("Admin Users Count:", aCount);
    }
}

checkCounts();

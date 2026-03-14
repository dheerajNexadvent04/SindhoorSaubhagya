require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkColumns() {
    console.log("--- CHECKING PROFILES COLUMNS ---");
    // We can't query information_schema directly with anon key usually,
    // but we can try to insert a dummy row or just check what's returned in a select.
    
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (error) {
        console.log("Error:", error.message);
    } else if (data && data.length > 0) {
        console.log("Columns found in record:", Object.keys(data[0]));
    } else {
        console.log("No records found to inspect columns. Trying a different method...");
        // Fallback: try to select specific columns and see which one fails
        const cols = ['photo_url', 'photos', 'horoscope_url'];
        for (const col of cols) {
            const { error: colError } = await supabase.from('profiles').select(col).limit(1);
            if (colError) {
                console.log(`❌ Column '${col}' ERR: ${colError.message}`);
            } else {
                console.log(`✅ Column '${col}' EXISTS`);
            }
        }
    }
}

checkColumns();

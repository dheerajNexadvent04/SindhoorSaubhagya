require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkColumns() {
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    if (data && data.length > 0) {
        console.log("COLUMNS START");
        Object.keys(data[0]).forEach(k => console.log(k));
        console.log("COLUMNS END");
    } else {
        console.log("No data found");
    }
}
checkColumns();

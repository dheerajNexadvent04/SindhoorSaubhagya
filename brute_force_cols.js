require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function bruteForceColumns() {
    console.log("--- BRUTE FORCE COLUMN CHECK ---");
    
    async function checkCol(table, col) {
        const { error } = await supabase.from(table).select(col).limit(1);
        return !error;
    }

    const tables = {
        profiles: ['id', 'user_id', 'first_name', 'gender', 'religion_id', 'religion_name', 'about_family'],
        admin_users: ['id', 'user_id', 'role', 'is_active']
    };

    for (const [table, cols] of Object.entries(tables)) {
        console.log(`\nTable: ${table}`);
        for (const col of cols) {
            const exists = await checkCol(table, col);
            console.log(`  - ${col}: ${exists ? '✅' : '❌'}`);
        }
    }
}

bruteForceColumns();

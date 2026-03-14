require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkAllProfiles() {
    console.log("--- CHECKING ALL PROFILES ---");
    const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, photo_url, photos, status')
        .order('created_at', { ascending: false });

    if (error) {
        console.log("Error:", error.message);
    } else {
        console.log(`Found ${data.length} profiles.`);
        data.forEach(p => {
            if (p.photo_url) {
                console.log(`✅ User: ${p.first_name} has photo: ${p.photo_url}`);
            } else {
                console.log(`❌ User: ${p.first_name} has NO photo`);
            }
        });
    }
}

checkAllProfiles();

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function inspectAll() {
    console.log("--- SEARCHING FOR DHEERAJ RANA ---");
    const { data, error } = await supabase
        .from('profiles')
        .select('*');

    if (error) {
        console.log("Error:", error.message);
    } else {
        console.log(`Checking ${data.length} profiles...`);
        data.forEach(p => {
            console.log(`\nID: ${p.id}`);
            console.log(`Name: ${p.first_name} ${p.last_name}`);
            console.log(`DOB: ${p.date_of_birth}`);
            console.log(`Gender: ${p.gender}`);
            console.log(`Profile For: ${p.profile_for}`);
            console.log(`Photo URL: ${p.photo_url}`);
            console.log(`Photos: ${JSON.stringify(p.photos)}`);
        });
    }
}

inspectAll();

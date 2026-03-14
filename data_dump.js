require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function dump() {
    console.log("Dumping profiles table metadata...");
    const { data: profiles, error: pError } = await supabase.from('profiles').select('*');

    if (pError) {
        console.error("Error fetching profiles:", pError.message);
    } else {
        console.log("Profiles found:", profiles.length);
        profiles.forEach(p => {
            console.log("---");
            console.log("ID:", p.id);
            console.log("Name:", p.first_name, p.last_name);
            console.log("Status:", p.status);
            console.log("Profile For:", p.profile_for);
            console.log("Photo URL:", p.photo_url);
            console.log("Photos:", p.photos);
        });
    }
}

dump();

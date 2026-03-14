require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkPhotos() {
    console.log("--- CHECKING PROFILE PHOTOS ---");
    const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, photo_url, photos')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.log("Error:", error.message);
    } else {
        data.forEach(p => {
            console.log(`User: ${p.first_name} (${p.id})`);
            console.log(`  photo_url: ${p.photo_url}`);
            console.log(`  photos: ${JSON.stringify(p.photos)}`);
        });
    }
}

checkPhotos();

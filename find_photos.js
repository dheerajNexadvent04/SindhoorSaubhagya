require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function findPhotos() {
    console.log("--- SEARCHING FOR PROFILES WITH PHOTOS ---");
    
    // We try to find any profile where photos is not empty
    const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, photo_url, photos, status')
        .not('photo_url', 'is', null);

    if (error) {
        console.log("Error 1:", error.message);
    } else {
        console.log(`Found ${data.length} profiles with photo_url.`);
        data.forEach(p => console.log(`  - ${p.first_name} ${p.last_name}: ${p.photo_url}`));
    }

    const { data: data2, error: error2 } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, photo_url, photos, status')
        .not('photos', 'is', null);

    if (error2) {
        console.log("Error 2:", error2.message);
    } else {
        console.log(`Found ${data2.length} profiles with photos array.`);
        data2.forEach(p => console.log(`  - ${p.first_name} ${p.last_name}: ${JSON.stringify(p.photos)}`));
    }
}

findPhotos();

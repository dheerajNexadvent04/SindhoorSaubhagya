require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function deepInspect() {
    console.log("--- DEEP INSPECTION ---");

    // 1. Check Profiles
    const { data: profiles, error: pError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, photo_url, photos, status, created_at')
        .order('created_at', { ascending: false });

    if (pError) {
        console.log("Profiles Error:", pError.message);
    } else {
        console.log(`Found ${profiles.length} profiles.`);
        profiles.forEach(p => {
            console.log(`- ${p.first_name} ${p.last_name} (${p.id})`);
            console.log(`  Photo URL: ${p.photo_url}`);
            console.log(`  Photos Array: ${JSON.stringify(p.photos)}`);
            console.log(`  Status: ${p.status}`);
        });
    }

    // 2. Check if bucket is truly public via API
    const { data: buckets, error: bError } = await supabase.storage.listBuckets();
    if (bError) {
        console.log("Buckets Error:", bError.message);
    } else {
        const bucket = buckets.find(b => b.id === 'profile-photos');
        console.log("\nBucket 'profile-photos' info:");
        console.log(`  - Public: ${bucket?.public}`);
        console.log(`  - ID: ${bucket?.id}`);
    }
}

deepInspect();

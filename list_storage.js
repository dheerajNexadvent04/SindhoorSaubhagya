require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function listFiles() {
    console.log("--- LISTING FILES IN BUCKET ---");
    
    // List from root
    const { data: rootFiles, error: rootError } = await supabase.storage
        .from('profile-photos')
        .list('', { limit: 100 });

    if (rootError) {
        console.log("Root Error:", rootError.message);
    } else {
        console.log(`Found ${rootFiles.length} files in root.`);
        rootFiles.forEach(f => console.log(`  - ${f.name}`));
    }

    // List from 'uploads/'
    const { data: uploadFiles, error: uploadError } = await supabase.storage
        .from('profile-photos')
        .list('uploads', { limit: 100 });

    if (uploadError) {
        console.log("Uploads Folder Error:", uploadError.message);
    } else {
        console.log(`Found ${uploadFiles.length} files in 'uploads/'.`);
        uploadFiles.forEach(f => console.log(`  - ${f.name}`));
    }
}

listFiles();

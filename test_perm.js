require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testUpdate() {
    console.log("--- TESTING PROFILE UPDATE (UNAUTHENTICATED) ---");
    const testId = '6da95f62-6c6f-43f0-b73d-4102e063d179'; // developer test
    
    const { error } = await supabase
        .from('profiles')
        .update({ photo_url: 'https://test.com/photo.jpg' })
        .eq('id', testId);

    if (error) {
        console.log("Expected Failure:", error.message);
    } else {
        console.log("✅ Success! (Wait, this should have failed if RLS is on and I'm not logged in)");
    }
}

testUpdate();

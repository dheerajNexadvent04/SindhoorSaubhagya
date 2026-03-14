const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xqxbwknstbzakepvljhc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxeGJ3a25zdGJ6YWtlcHZsamhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTA5NTYsImV4cCI6MjA4NjM4Njk1Nn0.mPFlxcZVSB2_yu40iDMP9VVCXbJZL_5UupW_rLB8OXE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDB() {
    console.log('--- Checking Profiles ---');
    const { count: profileCount, error: profileError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    console.log('Total Profiles COUNT:', profileCount, profileError || 'No Errors');

    const { data: profiles, error: pErr } = await supabase
        .from('profiles')
        .select('id, first_name, status');
    console.log('Profiles returned by default query:', profiles?.length, pErr || 'No Errors');

    console.log('\n--- Checking Admin Users ---');
    const { data: adminUsers, error: adminError } = await supabase
        .from('admin_users')
        .select('*');

    console.log('Admin Users:', JSON.stringify(adminUsers, null, 2), adminError || 'No Errors');
}

checkDB();

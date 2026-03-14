const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres.xqxbwknstbzakepvljhc:Sindoor%40123@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
});

async function run() {
    await client.connect();

    // 1. Check Auth Users
    const authUsers = await client.query('SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 10;');
    console.log('--- AUTH USERS ---');
    console.table(authUsers.rows);

    // 2. Check Profiles
    const profiles = await client.query('SELECT id, first_name, status FROM public.profiles;');
    console.log('--- PUBLIC PROFILES ---');
    console.table(profiles.rows);

    // 3. Check Admin Users
    const admins = await client.query('SELECT * FROM public.admin_users;');
    console.log('--- ADMIN USERS ---');
    console.table(admins.rows);

    await client.end();
}

run().catch(console.error);

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xqxbwknstbzakepvljhc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxeGJ3a25zdGJ6YWtlcHZsamhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTA5NTYsImV4cCI6MjA4NjM4Njk1Nn0.mPFlxcZVSB2_yu40iDMP9VVCXbJZL_5UupW_rLB8OXE';

const supabase = createClient(supabaseUrl, supabaseKey);

const dummyProfiles = [
    {
        email: 'riya.sharma@example.com',
        password: 'Password123!',
        first_name: 'Riya',
        last_name: 'Sharma',
        gender: 'female',
        date_of_birth: '1998-05-15',
        height: 165,
        weight: 55,
        marital_status: 'never_married',
        religion_name: 'Hindu',
        caste_name: 'Brahmin',
        manglik: 'No',
        profile_for: 'Myself',
        managed_by: 'Self',
        degree: 'B.Tech',
        employed_in: 'Private Sector',
        occupation: 'Software Engineer',
        annual_income: 1200000,
        city: 'Delhi',
        state: 'Delhi',
        country: 'India',
        family_type: 'Nuclear',
        about_me: 'I am a software engineer working in a reputed MNC. I love traveling and reading.',
    },
    {
        email: 'anjali.gupta@example.com',
        password: 'Password123!',
        first_name: 'Anjali',
        last_name: 'Gupta',
        gender: 'female',
        date_of_birth: '1996-10-22',
        height: 160,
        weight: 58,
        marital_status: 'never_married',
        religion_name: 'Hindu',
        caste_name: 'Baniya',
        manglik: 'Yes',
        profile_for: 'Daughter',
        managed_by: 'Parent',
        degree: 'MBA',
        employed_in: 'Private Sector',
        occupation: 'HR Manager',
        annual_income: 1500000,
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        family_type: 'Joint',
        about_me: 'Looking for a well-educated partner for my daughter who balances modern values with tradition.',
    },
    {
        email: 'sneha.patel@example.com',
        password: 'Password123!',
        first_name: 'Sneha',
        last_name: 'Patel',
        gender: 'female',
        date_of_birth: '1995-12-05',
        height: 162,
        weight: 60,
        marital_status: 'divorced',
        religion_name: 'Hindu',
        caste_name: 'Patel',
        manglik: 'No',
        profile_for: 'Myself',
        managed_by: 'Self',
        degree: 'BDS',
        employed_in: 'Self Employed',
        occupation: 'Dentist',
        annual_income: 2000000,
        city: 'Ahmedabad',
        state: 'Gujarat',
        country: 'India',
        family_type: 'Nuclear',
        about_me: 'I am a practicing dentist with my own clinic. Looking for someone understanding and supportive.',
    },
    {
        email: 'priyanka.singh@example.com',
        password: 'Password123!',
        first_name: 'Priyanka',
        last_name: 'Singh',
        gender: 'female',
        date_of_birth: '1999-03-18',
        height: 168,
        weight: 56,
        marital_status: 'never_married',
        religion_name: 'Hindu',
        caste_name: 'Rajput',
        manglik: 'No',
        profile_for: 'Sister',
        managed_by: 'Sibling',
        degree: 'MA Ecomomics',
        employed_in: 'Government',
        occupation: 'Civil Servant',
        annual_income: 900000,
        city: 'Jaipur',
        state: 'Rajasthan',
        country: 'India',
        family_type: 'Nuclear',
        about_me: 'Priyanka is a focused and ambitious girl. Seeking a partner with similar values.',
    },
    {
        email: 'rohit.verma@example.com',
        password: 'Password123!',
        first_name: 'Rohit',
        last_name: 'Verma',
        gender: 'male',
        date_of_birth: '1994-08-30',
        height: 178,
        weight: 75,
        marital_status: 'never_married',
        religion_name: 'Hindu',
        caste_name: 'Kayastha',
        manglik: 'No',
        profile_for: 'Myself',
        managed_by: 'Self',
        degree: 'B.E.',
        employed_in: 'Private Sector',
        occupation: 'Data Scientist',
        annual_income: 2500000,
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        family_type: 'Nuclear',
        about_me: 'Passionate about data and AI. I enjoy hiking and photography on weekends.',
    },
    {
        email: 'amit.kumar@example.com',
        password: 'Password123!',
        first_name: 'Amit',
        last_name: 'Kumar',
        gender: 'male',
        date_of_birth: '1993-02-14',
        height: 175,
        weight: 80,
        marital_status: 'never_married',
        religion_name: 'Hindu',
        caste_name: 'Yadav',
        manglik: 'No',
        profile_for: 'Son',
        managed_by: 'Parent',
        degree: 'MD',
        employed_in: 'Private Sector',
        occupation: 'Doctor',
        annual_income: 3000000,
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        country: 'India',
        family_type: 'Joint',
        about_me: 'We are seeking a suitable match for our son who is a practicing physician at a reputed hospital.',
    },
    {
        email: 'karan.malhotra@example.com',
        password: 'Password123!',
        first_name: 'Karan',
        last_name: 'Malhotra',
        gender: 'male',
        date_of_birth: '1992-11-11',
        height: 180,
        weight: 78,
        marital_status: 'never_married',
        religion_name: 'Hindu',
        caste_name: 'Khatri',
        manglik: 'Yes',
        profile_for: 'Myself',
        managed_by: 'Self',
        degree: 'CA',
        employed_in: 'Self Employed',
        occupation: 'Chartered Accountant',
        annual_income: 4000000,
        city: 'Delhi',
        state: 'Delhi',
        country: 'India',
        family_type: 'Nuclear',
        about_me: 'Running my own CA firm. Looking for a modern, independent partner.',
    }
];

async function createProfiles() {
    console.log("Starting script to create 7 dummy profiles...");
    for (const profile of dummyProfiles) {
        console.log(`Registering ${profile.first_name}...`);

        // 1. Sign Up User (Creates auth record & basic profile via trigger)
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: profile.email,
            password: profile.password,
            options: {
                data: {
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    gender: profile.gender,
                    date_of_birth: profile.date_of_birth,
                }
            }
        });

        if (signUpError) {
            console.error(`Error signing up ${profile.first_name}:`, signUpError.message);
            continue;
        }

        const userId = authData.user.id;

        // Ensure user is signed in to use RLS for profile update
        await supabase.auth.signInWithPassword({
            email: profile.email,
            password: profile.password,
        });

        // 2. Update extended Profile Details
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                height: profile.height,
                weight: profile.weight,
                marital_status: profile.marital_status,
                religion_name: profile.religion_name,
                caste_name: profile.caste_name,
                manglik: profile.manglik,
                profile_for: profile.profile_for,
                managed_by: profile.managed_by,
                degree: profile.degree,
                employed_in: profile.employed_in,
                occupation: profile.occupation,
                annual_income: profile.annual_income,
                city: profile.city,
                state: profile.state,
                country: profile.country,
                family_type: profile.family_type,
                about_me: profile.about_me,
            })
            .eq('user_id', userId);

        if (updateError) {
            console.error(`Error updating profile for ${profile.first_name}:`, updateError.message);
        } else {
            console.log(`Successfully created and updated profile for ${profile.first_name} ${profile.last_name}`);
        }

        // Sign out to prevent session clashing on next user
        await supabase.auth.signOut();
    }
    console.log("Finished creating dummy profiles.");
}

createProfiles();

import React from 'react';
import MembershipHero from '@/components/MembershipHero/MembershipHero';
import MembershipStats from '@/components/MembershipStats/MembershipStats';
import MembershipHowItWorks from '@/components/MembershipHowItWorks/MembershipHowItWorks';
import Footer from '@/components/Footer/Footer';

const MembershipPage = () => {
    return (
        <main>
            <MembershipHero />
            <MembershipStats />
            <MembershipHowItWorks />
            <Footer />
        </main>
    );
};

export default MembershipPage;

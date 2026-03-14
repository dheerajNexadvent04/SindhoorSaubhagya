import React from 'react';
import MembershipHero from '@/components/MembershipHero/MembershipHero';
import MembershipStats from '@/components/MembershipStats/MembershipStats';
import MembershipHowItWorks from '@/components/MembershipHowItWorks/MembershipHowItWorks';
import Pricing from '@/components/Pricing/Pricing';
import Footer from '@/components/Footer/Footer';

const MembershipPage = () => {
    return (
        <main>
            <MembershipHero />
            <MembershipStats />
            <MembershipHowItWorks />
            <div style={{ paddingTop: '80px' }}>
                <Pricing />
            </div>
            <Footer />
        </main>
    );
};

export default MembershipPage;

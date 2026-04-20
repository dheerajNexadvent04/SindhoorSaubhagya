import React from 'react';
import styles from './MembershipStats.module.css';
import Image from 'next/image';

const StatsCard = ({ icon, value, text }: { icon: string, value: string, text: string }) => (
    <div className={styles.statsCard}>
        <div className={styles.iconWrapper}>
            <Image src={icon} alt={text} width={60} height={60} />
        </div>
        <h3 className={styles.statsValue}>{value}</h3>
        <p className={styles.statsText}>{text}</p>
    </div>
);

const MembershipStats = () => {
    return (
        <section className={styles.statsSection}>
            {/* Background design elements */}
            <div className={styles.bgLeft}>
                <Image src="/left-design-1.png" alt="" fill className={styles.bgImage} />
            </div>
            <div className={styles.bgRight}>
                <Image src="/right-design-2.png" alt="" fill className={styles.bgImage} />
            </div>

            <div className={styles.container}>
                <div className={styles.headingContainer}>
                    <h2 className={styles.heading}>WHY SINDOOR SAUBHAGAYA</h2>
                    <p className={styles.subHeading}>
                        Sindoor Saubhagaya offers a more considered approach to matchmaking, built on trust,
                        understanding, and meaningful introductions.
                    </p>
                    <p className={styles.subHeading}>
                        Designed for individuals and families who prefer a guided, private, and more refined
                        experience.
                    </p>
                </div>

                <div className={styles.cardsGrid}>
                    <StatsCard
                        icon="/icon1.png"
                        value="10+ Years"
                        text="Years of Experience"
                    />
                    <StatsCard
                        icon="/icon2.png"
                        value="500+"
                        text="Registered Members"
                    />
                    <StatsCard
                        icon="/icon3.png"
                        value="80+"
                        text="Relationship Managers"
                    />
                    <StatsCard
                        icon="/icon4.png"
                        value="100% Private"
                        text="Confidentiality"
                    />
                </div>
            </div>
        </section>
    );
};

export default MembershipStats;

import React from 'react';
import styles from './MembershipHowItWorks.module.css';

const MembershipHowItWorks = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.heading}>HOW IT WORKS</h2>

                <div className={styles.contentBlock}>
                    <h3 className={styles.stepTitle}>Understanding Your Preferences</h3>
                    <p className={styles.stepText}>
                        A dedicated Relationship Manager takes time to understand your expectations, background,
                        and what matters most to you.
                    </p>

                    <h3 className={styles.stepTitle}>Shortlisting Suitable Matches</h3>
                    <p className={styles.stepText}>
                        Profiles are carefully selected based on compatibility, values, and lifestyle.
                    </p>

                    <h3 className={styles.stepTitle}>Facilitated Introductions</h3>
                    <p className={styles.stepText}>
                        We help initiate conversations and coordinate meetings, making the process smooth and
                        respectful for both sides.
                    </p>
                </div>

                <div className={styles.divider} />

                <div className={styles.finalSection}>
                    <h2 className={styles.finalHeading}>FINAL SECTION</h2>
                    <h3 className={styles.finalSubHeading}>Looking for a more personalised experience?</h3>
                    <p className={styles.finalText}>Share your details, and we&apos;ll connect with you.</p>
                </div>
            </div>
        </section>
    );
};

export default MembershipHowItWorks;

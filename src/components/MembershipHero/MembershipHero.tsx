import React from 'react';
import styles from './MembershipHero.module.css';
import Image from 'next/image';

const MembershipHero = () => {
    return (
        <section className={styles.heroSection}>
            <div className={styles.container}>
                <div className={styles.contentCol}>
                    <div className={styles.badgeContainer}>
                        <Image
                            src="/personaized-badge.png"
                            alt="Personalized & Confidential Service"
                            width={320}
                            height={40}
                            className={styles.badgeImage}
                        />
                    </div>

                    <h1 className={styles.heading}>
                        The <strong>largest</strong> and most <strong>successful</strong><br />
                        matchmaking service <strong>for Elite</strong>
                    </h1>

                    <p className={styles.subHeading}>Share your details, we will get in touch</p>

                    <div className={styles.formContainer}>
                        <div className={`${styles.formGroup} ${styles.borderRight}`}>
                            <label className={styles.label}>Mother Tongue</label>
                            <select className={styles.select} defaultValue="">
                                <option value="" disabled>Select</option>
                                <option value="hindi">Hindi</option>
                                <option value="english">English</option>
                                <option value="punjabi">Punjabi</option>
                                <option value="marathi">Marathi</option>
                                <option value="bengali">Bengali</option>
                                <option value="gujarati">Gujarati</option>
                                <option value="urdu">Urdu</option>
                                <option value="telugu">Telugu</option>
                                <option value="kannada">Kannada</option>
                                <option value="tamil">Tamil</option>
                                <option value="malayalam">Malayalam</option>
                                <option value="odia">Odia</option>
                                <option value="assamese">Assamese</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className={`${styles.formGroup} ${styles.borderRight}`}>
                            <label className={styles.label}>Mobile Number</label>
                            <input
                                type="tel"
                                placeholder="Enter mobile no."
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                className={styles.input}
                            />
                        </div>

                        <button className={styles.submitButton}>
                            Submit
                        </button>
                    </div>
                </div>

                <div className={styles.imageCol}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/hero-bg.png"
                            alt="Celebrity Matchmaking"
                            fill
                            className={styles.personImage}
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MembershipHero;

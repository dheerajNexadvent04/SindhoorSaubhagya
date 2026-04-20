"use client";

import React, { useState } from 'react';
import styles from './MembershipHero.module.css';
import Image from 'next/image';
import CustomSelect from '@/components/common/CustomSelect';

const MembershipHero = () => {
    const [motherTongue, setMotherTongue] = useState('');

    const handleMotherTongueChange = (e: { target: { value: string } }) => {
        setMotherTongue(e.target.value);
    };

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

                    <h1 className={styles.heading}>A more personal way to find the right partner</h1>
                    <p className={styles.subHeading}>
                        For those who value compatibility, privacy, and a thoughtful approach to matchmaking.
                    </p>
                    <p className={styles.subHeadingAlt}>Share your details. Our team will get in touch.</p>

                    <div className={styles.formContainer}>
                        <div className={`${styles.formGroup} ${styles.borderRight}`}>
                            <label className={styles.label}>Mother Tongue</label>
                            <CustomSelect
                                name="motherTongue"
                                value={motherTongue}
                                onChange={handleMotherTongueChange}
                                placeholder="Select"
                                variant="compact"
                                options={[
                                    { value: 'hindi', label: 'Hindi' },
                                    { value: 'english', label: 'English' },
                                    { value: 'punjabi', label: 'Punjabi' },
                                    { value: 'marathi', label: 'Marathi' },
                                    { value: 'bengali', label: 'Bengali' },
                                    { value: 'gujarati', label: 'Gujarati' },
                                    { value: 'telugu', label: 'Telugu' },
                                    { value: 'kannada', label: 'Kannada' },
                                    { value: 'tamil', label: 'Tamil' },
                                    { value: 'malayalam', label: 'Malayalam' },
                                    { value: 'odia', label: 'Odia' },
                                    { value: 'assamese', label: 'Assamese' },
                                    { value: 'other', label: 'Other' },
                                ]}
                            />
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
                    <p className={styles.trustLine}>Private. Thoughtful. Focused.</p>
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

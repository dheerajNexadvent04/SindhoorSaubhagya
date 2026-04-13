"use client";

import React from 'react';
import Image from 'next/image';
import styles from './WhoAreWe.module.css';

const WhoAreWe = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* Left Side - Image */}
                <div className={styles.imageWrapper}>
                    <Image
                        src="/couple-formal.png"
                        alt="Who are we"
                        fill
                        className={styles.image}
                    />
                </div>

                {/* Right Side - Content */}
                <div className={styles.content}>
                    <h2 className={styles.heading}>
                        WHO <span className={styles.areText}>are</span> We?
                    </h2>
                    <p className={styles.description}>
                        We are a modern matrimonial platform designed to help individuals and families find genuine, compatible life partners. By blending traditional values with modern technology, we focus on verified profiles, privacy-first systems, and respectful matchmaking to create meaningful and lasting connections.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default WhoAreWe;

"use client";
import React from 'react';
import Image from 'next/image';
import styles from './Footer.module.css';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const GALLERY_IMAGES: Array<{ src: string; size: 'big' | 'small' }> = [
    { src: '/footer-crouser-image-bigcard1.png', size: 'big' },
    { src: '/footer-crouser-image-smallcard1.png', size: 'small' },
    { src: '/footer-crouser-image-bigcard2.png', size: 'big' },
    { src: '/footer-crouser-image-smallcard2.png', size: 'small' },
    { src: '/footer-crouser-image-bigcard-3.png', size: 'big' },
    { src: '/footer-crouser-image-smallcard-3.png', size: 'small' },
    { src: '/footer-crouser-image-bigcard4.png', size: 'big' },
];

type FooterProps = {
    topBarText?: string;
    topBarButtonText?: string;
    topBarButtonHref?: string;
};

const Footer = ({
    topBarText = "Serious introductions for people who are ready.",
    topBarButtonText = "Register Free",
    topBarButtonHref = "/register",
}: FooterProps) => {
    const businessAddress = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || '123 Matrimony Plaza, Connaught Place, New Delhi - 110001, India';

    return (
        <footer className={styles.footer}>
            <div className={styles.topBar}>
                <span className={styles.topBarText}>
                    {topBarText}
                </span>
                <Link href={topBarButtonHref} className={styles.registerBtn}>
                    {topBarButtonText}
                </Link>
            </div>

            <div className={styles.marqueeSection}>
                <div className={styles.marqueeContainer}>
                    {[...GALLERY_IMAGES, ...GALLERY_IMAGES, ...GALLERY_IMAGES].map((item, index) => (
                        <div
                            key={index}
                            className={`${styles.marqueeItem} ${item.size === 'big' ? styles.marqueeItemBig : styles.marqueeItemSmall}`}
                        >
                            <Image
                                src={item.src}
                                alt={`Wedding Gallery ${index}`}
                                fill
                                className={styles.marqueeImage}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.letsTalkContainer}>
                    <h2 className={styles.letsTalkText}>LET&apos;S TALK</h2>
                    <Link href="/contact" className={styles.rotatingLink} aria-label="Go to contact us">
                        <Image
                            src="/footer-scrolling-icon2.png"
                            alt="Scroll Icon"
                            width={120}
                            height={120}
                            className={styles.rotatingIcon}
                        />
                    </Link>
                </div>

                <div className={styles.bottomSection}>
                    <div className={styles.brandLogo}>
                        <Image
                            src="/logo 1.png"
                            alt="Sindoor Saubhagya"
                            width={220}
                            height={100}
                            className={styles.footerLogo}
                        />
                        <p className={styles.tagline}>Serious introductions for people who are ready.</p>

                        <div className={styles.address}>
                            <p>Address: {businessAddress}</p>
                        </div>
                    </div>

                    <div className={styles.linksSocialRow}>
                        <nav className={styles.navLinks}>
                            <Link href="/" className={styles.link}>Home</Link>
                            <Link href="/membership" className={styles.link}>Membership</Link>
                            <Link href="/about" className={styles.link}>About Us</Link>
                            <Link href="/profile" className={styles.link}>View Profile</Link>
                        </nav>

                        <div className={styles.socialIcons}>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className={styles.iconBtn}><Twitter size={18} /></a>
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.iconBtn}><Facebook size={18} /></a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.iconBtn}><Instagram size={18} /></a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={styles.iconBtn}><Linkedin size={18} /></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

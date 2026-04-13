"use client";
import React from 'react';
import Image from 'next/image';
import styles from './Footer.module.css';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const GALLERY_IMAGES = [
    '/couple-traditional.png',
    '/couple-formal.png',
    '/couple_1.png',
    '/bride-phone.png',
    '/couple-traditional.png',
    '/couple-formal.png',
    '/couple_1.png',
    '/bride-phone.png',
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
    const businessAddress = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || 'New Delhi, India';

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
                    {[...GALLERY_IMAGES, ...GALLERY_IMAGES, ...GALLERY_IMAGES].map((src, index) => (
                        <div key={index} className={styles.marqueeItem}>
                            <Image
                                src={src}
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
                            <a href="#" className={styles.iconBtn}><Twitter size={18} /></a>
                            <a href="#" className={styles.iconBtn}><Facebook size={18} /></a>
                            <a href="#" className={styles.iconBtn}><Instagram size={18} /></a>
                            <a href="#" className={styles.iconBtn}><Linkedin size={18} /></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

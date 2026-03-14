"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import styles from './Navbar.module.css';
import { useModal } from '@/context/ModalContext';

import { usePathname } from 'next/navigation';

const Navbar = () => {
    const { openLogin } = useModal();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Hide Navbar on Admin and Dashboard pages
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')) {
        return null;
    }

    return (
        <>
            <nav className={styles.navbarContainer}>
                {/* ... existing nav content ... */}
                <div className={styles.topBar}>
                    50% OFF ON MEMBERSHIP PLANS
                </div>

                <div className={styles.mainNav}>
                    <div className={styles.logoContainer}>
                        {/* Using the file name found in public folder */}
                        <Link href="/">
                            <Image
                                src="/logo 1.png"
                                alt="Sindoor Saubhagya"
                                width={150}
                                height={50}
                                className={styles.logo}
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className={styles.navLinks}>
                        <Link href="/" className={styles.navLink}>Home</Link>
                        <Link href="/membership" className={styles.navLink}>Membership</Link>
                        <Link href="/about" className={styles.navLink}>About Us</Link>
                        <Link href="/profile" className={styles.navLink}>View Profile</Link>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className={styles.authButtons}>
                        <button className={styles.btnLogin} onClick={openLogin}>Login</button>
                        <Link href="/register" className={styles.btnContact}>Register</Link>
                    </div>

                    {/* Mobile Menu Button - Using custom Frame.png */}
                    <button className={styles.mobileMenuBtn} onClick={toggleMobileMenu}>
                        {isMobileMenuOpen ? (
                            <X size={28} />
                        ) : (
                            <Image
                                src="/Frame.png"
                                alt="Menu"
                                width={28}
                                height={28}
                                style={{ objectFit: 'contain' }}
                            />
                        )}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className={styles.mobileMenuOverlay} onClick={toggleMobileMenu}></div>
                )}

                {/* Mobile Sidebar */}
                <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
                    <div className={styles.mobileCloseHeader}>
                        <Image
                            src="/logo 1.png"
                            alt="Sindoor"
                            width={120}
                            height={40}
                            style={{ objectFit: 'contain' }}
                        />
                        <button onClick={toggleMobileMenu} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer' }}>
                            <X size={28} />
                        </button>
                    </div>

                    <div className={styles.mobileLinks}>
                        <Link href="/" className={styles.mobileNavLink} onClick={toggleMobileMenu}>Home</Link>
                        <Link href="/membership" className={styles.mobileNavLink} onClick={toggleMobileMenu}>Membership</Link>
                        <Link href="/about" className={styles.mobileNavLink} onClick={toggleMobileMenu}>About Us</Link>
                        <Link href="/profile" className={styles.mobileNavLink} onClick={toggleMobileMenu}>View Profile</Link>
                    </div>

                    <div className={styles.mobileAuthButtons}>
                        <button className={styles.btnLogin} onClick={() => { openLogin(); toggleMobileMenu(); }}>Login</button>
                        <Link href="/register" className={styles.btnContact} onClick={toggleMobileMenu}>Register</Link>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;

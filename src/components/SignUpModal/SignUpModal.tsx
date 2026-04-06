"use client";

import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import styles from './SignUpModal.module.css';

interface SignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginClick?: () => void;
    initialData?: {
        email?: string;
        password?: string;
        profileFor?: string;
    };
}

const SignUpModal = ({ isOpen, onClose, onLoginClick, initialData }: SignUpModalProps) => {
    // ... existing state ...
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName] = useState('');
    const [dob, setDob] = useState('');
    const [religion, setReligion] = useState('');
    const [caste, setCaste] = useState('');
    const [gender] = useState('');
    const [profileFor, setProfileFor] = useState('');
    const [phone] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    React.useEffect(() => {
        if (isOpen && initialData) {
            if (initialData.email) setEmail(initialData.email);
            if (initialData.password) setPassword(initialData.password);
            if (initialData.profileFor) setProfileFor(initialData.profileFor);
            // If phone is captured in Hero but not used in SignUp, we might store it in metadata or extend SignUp
        }
    }, [isOpen, initialData]);

    const handleSignUp = async (e: React.FormEvent) => {
        // ... existing handleSignUp ...
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const parts = firstName.trim().split(/\s+/).filter(Boolean);
            const parsedFirstName = parts[0] || '';
            const parsedLastName = lastName.trim() || parts.slice(1).join(' ');

            if (!parsedFirstName) {
                throw new Error('Please enter your name.');
            }

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                    firstName: parsedFirstName,
                    lastName: parsedLastName,
                    dob,
                    religion,
                    caste,
                    gender,
                    profileFor,
                    phone,
                }),
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Signup failed');
            }

            alert('Profile created successfully! Please check your email to confirm your account.');
            onClose();

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={20} color="#333" />
                </button>

                <div className={styles.content}>
                    <h2 className={styles.headerTitle}>
                        Hi! Your are joining the Best Matchmaking Expreience
                    </h2>
                    <p className={styles.headerSubtitle}>
                        Please fill the form to continue
                    </p>

                    {onLoginClick && (
                        <p style={{ textAlign: 'center', marginBottom: '15px', fontSize: '0.9rem', color: '#666' }}>
                            Already have an account? <span onClick={onLoginClick} style={{ color: '#E31E24', cursor: 'pointer', fontWeight: 600 }}>Login</span>
                        </p>
                    )}

                    <form onSubmit={handleSignUp}>
                        {/* Email & Password (Required for Auth) */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email<span className={styles.required}>*</span></label>
                            <input
                                type="email"
                                placeholder="mail@domain.com"
                                className={styles.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Password<span className={styles.required}>*</span></label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    className={styles.input}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#666'
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Groom's Name */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Full Name<span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ex. Rahul Singh"
                                className={styles.input}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                                Please provide your first name along with surname
                            </p>
                        </div>

                        {/* Date of Birth */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Date of Birth<span className={styles.required}>*</span>
                            </label>
                            <input
                                type="date"
                                className={styles.input}
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                required
                            />
                        </div>

                        {/* Religion */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Religion<span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Hindu"
                                className={styles.input}
                                value={religion}
                                onChange={(e) => setReligion(e.target.value)}
                                required
                            />
                        </div>

                        {/* Caste */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Caste<span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Marwadi"
                                className={styles.input}
                                value={caste}
                                onChange={(e) => setCaste(e.target.value)}
                                required
                            />
                            <div className={styles.checkboxGroup}>
                                <input type="checkbox" id="casteNoBar" className={styles.checkbox} defaultChecked />
                                <label htmlFor="casteNoBar" className={styles.checkboxLabel}>
                                    Caste no bar(I am open to many peoples of all castes)
                                </label>
                            </div>
                        </div>

                        {error && <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '10px' }}>{error}</p>}

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? 'Creating Profile...' : 'Continue'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUpModal;

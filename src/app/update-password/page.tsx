"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './update-password.module.css';
import { supabase } from '@/lib/supabase';

export default function UpdatePassword() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [sessionReady, setSessionReady] = useState(false);

    useEffect(() => {
        const bootstrapRecoverySession = async () => {
            const urlError = new URLSearchParams(window.location.search).get('error');
            if (urlError) {
                setError(urlError);
                return;
            }

            const { data, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
                setError(sessionError.message);
                return;
            }

            if (!data.session?.user) {
                setError('Reset link is invalid or expired. Please request a new reset link.');
                return;
            }

            setSessionReady(true);
        };

        void bootstrapRecoverySession();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionReady) return;
        setLoading(true);
        setError(null);
        setMessage(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setMessage("Password updated successfully. Redirecting to home...");
            setTimeout(() => {
                router.push('/');
            }, 2000);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to update password";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Update Password</h1>
                <p className={styles.subtitle}>
                    Enter your new password below.
                </p>

                {message && <div className={styles.successMessage}>{message}</div>}
                {error && <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="password">New Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="At least 8 characters"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            className={styles.input}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
                {!sessionReady && !error && (
                    <p style={{ marginTop: '16px', color: '#6b7280' }}>Preparing secure reset session...</p>
                )}
            </div>
        </div>
    );
}


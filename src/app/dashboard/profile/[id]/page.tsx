"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './profile-detail.module.css';

type ProfileDetails = {
    id: string;
    first_name: string | null;
    last_name: string | null;
    date_of_birth: string | null;
    height: number | null;
    about_me: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    occupation: string | null;
    degree: string | null;
    marital_status: string | null;
    religion_name: string | null;
    caste_name: string | null;
    photo_url: string | null;
    photos: string[] | null;
};

const getAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return 'N/A';
    const dob = new Date(dateOfBirth);
    if (Number.isNaN(dob.getTime())) return 'N/A';
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age -= 1;
    return age;
};

export default function DashboardProfileDetailsPage() {
    const params = useParams<{ id: string }>();
    const profileId = params?.id;
    const [profile, setProfile] = React.useState<ProfileDetails | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [shortlisted, setShortlisted] = React.useState(false);
    const [busy, setBusy] = React.useState(false);

    React.useEffect(() => {
        const loadProfile = async () => {
            if (!profileId) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, first_name, last_name, date_of_birth, height, about_me, city, state, country, occupation, degree, marital_status, religion_name, caste_name, photo_url, photos')
                    .eq('id', profileId)
                    .single();

                if (error) throw error;
                setProfile(data as ProfileDetails);

                await fetch('/api/views', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ viewedProfileId: profileId }),
                });

                const shortlistRes = await fetch('/api/shortlist');
                if (shortlistRes.ok) {
                    const shortlistJson = await shortlistRes.json();
                    const alreadyShortlisted = (shortlistJson.data || []).some((item: { shortlisted_profile?: { id?: string } }) => item.shortlisted_profile?.id === profileId);
                    setShortlisted(alreadyShortlisted);
                }
            } catch (error) {
                console.error('Profile details load failed:', error);
            } finally {
                setLoading(false);
            }
        };

        void loadProfile();
    }, [profileId]);

    const handleShowInterest = async () => {
        if (!profileId || busy || shortlisted) return;
        setBusy(true);
        try {
            const response = await fetch('/api/shortlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileId }),
            });

            if (!response.ok) {
                const json = await response.json().catch(() => null);
                if (json?.error === 'Already shortlisted') {
                    setShortlisted(true);
                    return;
                }
                throw new Error(json?.error || 'Unable to update interest');
            }

            setShortlisted(true);
        } catch (error) {
            console.error(error);
        } finally {
            setBusy(false);
        }
    };

    if (loading) {
        return <div className={styles.infoState}>Loading profile...</div>;
    }

    if (!profile) {
        return <div className={styles.infoState}>Profile not found.</div>;
    }

    const profileName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Member';
    const profileAge = getAge(profile.date_of_birth);
    const location = [profile.city, profile.state, profile.country].filter(Boolean).join(', ') || 'Location not shared';

    return (
        <div className={styles.page}>
            <Link href="/profile" className={styles.backLink}>
                <ArrowLeft size={18} />
                Back to profiles
            </Link>

            <section className={styles.profileShell}>
                <div className={styles.photoFrame}>
                    <Image
                        src={profile.photo_url || profile.photos?.[0] || '/image 1.png'}
                        alt={profileName}
                        fill
                        className={styles.profileImage}
                        unoptimized
                    />
                </div>

                <div className={styles.content}>
                    <div className={styles.headerRow}>
                        <h1 className={styles.name}>{profileName.toUpperCase()}</h1>
                        <p className={styles.ageMeta}>
                            Age <span>{profileAge}</span>
                        </p>
                    </div>

                    <div className={styles.facts}>
                        <p><span>Age:</span> {profileAge} years</p>
                        <p><span>Religion / Community:</span> {profile.religion_name || 'Open'}</p>
                        <p><span>Caste:</span> {profile.caste_name || 'Open'}</p>
                        <p><span>Location:</span> {location}</p>
                        <p><span>Height:</span> {profile.height ? `${profile.height} cm` : 'Not shared'}</p>
                        <p><span>Marital Status:</span> {profile.marital_status || 'Not shared'}</p>
                        <p><span>Job:</span> {profile.occupation || 'Not shared'}</p>
                        <p><span>Education:</span> {profile.degree || 'Not shared'}</p>
                    </div>

                    <div className={styles.about}>
                        <h2>About me</h2>
                        <p>
                            {profile.about_me || 'This member has not shared an introduction yet.'}
                        </p>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={handleShowInterest}
                            disabled={busy || shortlisted}
                            className={`${styles.actionButton} ${styles.primaryAction}`}
                        >
                            <Heart size={16} fill={shortlisted ? 'currentColor' : 'none'} />
                            {busy ? 'Updating...' : shortlisted ? 'Interested' : 'Show Interest'}
                        </button>
                        <Link href="/profile" className={`${styles.actionButton} ${styles.secondaryAction}`}>
                            View More Profiles
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

"use client";

import React from 'react';
import Image from 'next/image';
import { BadgeCheck, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import styles from './matches.module.css';

type PreferencesForm = {
    preferred_gender: string;
    age_min: string;
    age_max: string;
    height_min: string;
    height_max: string;
    marital_status: string;
    religion_name: string;
    caste_name: string;
    mother_tongue: string;
    manglik: string;
    degree: string;
    employed_in: string;
    occupation_keyword: string;
    annual_income_min: string;
    country: string;
    state: string;
    city: string;
};

type UserProfile = {
    id: string;
    first_name: string | null;
    last_name: string | null;
    gender: string | null;
    status: string | null;
    partner_preferences: Partial<PreferencesForm> | string | null;
};

type SuggestedProfile = {
    id: string;
    first_name: string | null;
    last_name: string | null;
    gender: string | null;
    date_of_birth: string | null;
    height: number | null;
    marital_status: string | null;
    religion_name: string | null;
    caste_name: string | null;
    mother_tongue: string | null;
    manglik: string | null;
    degree: string | null;
    employed_in: string | null;
    occupation: string | null;
    annual_income: number | null;
    city: string | null;
    state: string | null;
    country: string | null;
    photo_url: string | null;
    photos: string[] | null;
    about_me: string | null;
};

type RankedProfile = SuggestedProfile & { score: number };

const maritalOptions = ['', 'Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'];
const religionOptions = ['', 'Hindu', 'Sikh', 'Christian', 'Jain', 'Buddhist', 'Other'];
const manglikOptions = ['', 'no', 'yes', 'anshik'];
const employedInOptions = ['', 'Private', 'Government', 'Business', 'Self-Employed'];
const motherTongueOptions = ['', 'Hindi', 'English', 'Punjabi', 'Gujarati', 'Marathi', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Urdu', 'Other'];
const incomeOptions = [
    { value: '', label: 'No minimum' },
    { value: '300000', label: '3 LPA+' },
    { value: '500000', label: '5 LPA+' },
    { value: '800000', label: '8 LPA+' },
    { value: '1200000', label: '12 LPA+' },
    { value: '1800000', label: '18 LPA+' },
];
const ageOptions = Array.from({ length: 23 }, (_, index) => `${index + 21}`);
const heightOptions = Array.from({ length: 41 }, (_, index) => `${145 + index}`);

const normalizeGenderValue = (value: string | null | undefined) => {
    const normalized = (value || '').trim().toLowerCase();
    if (!normalized) return '';
    if (normalized === 'female' || normalized === 'bride' || normalized === 'woman' || normalized === 'f') return 'female';
    if (normalized === 'male' || normalized === 'groom' || normalized === 'man' || normalized === 'm') return 'male';
    return normalized;
};

const getDefaultPreferences = (gender?: string | null): PreferencesForm => ({
    preferred_gender: gender === 'male' ? 'female' : gender === 'female' ? 'male' : '',
    age_min: '23',
    age_max: '30',
    height_min: '',
    height_max: '',
    marital_status: '',
    religion_name: '',
    caste_name: '',
    mother_tongue: '',
    manglik: '',
    degree: '',
    employed_in: '',
    occupation_keyword: '',
    annual_income_min: '',
    country: 'India',
    state: '',
    city: '',
});

const coercePreferences = (savedPreferences: Partial<PreferencesForm> | string | null | undefined): Partial<PreferencesForm> | null => {
    if (!savedPreferences) return null;
    if (typeof savedPreferences === 'string') {
        try {
            const parsed = JSON.parse(savedPreferences);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                return parsed as Partial<PreferencesForm>;
            }
            return null;
        } catch {
            return null;
        }
    }
    if (typeof savedPreferences === 'object' && !Array.isArray(savedPreferences)) {
        return savedPreferences;
    }
    return null;
};

const normalizePreferences = (savedPreferences: Partial<PreferencesForm> | string | null | undefined, gender?: string | null): PreferencesForm => ({
    ...getDefaultPreferences(gender),
    ...(coercePreferences(savedPreferences) || {}),
});

const hasConfiguredPreferences = (savedPreferences: Partial<PreferencesForm> | string | null | undefined) => {
    const coerced = coercePreferences(savedPreferences);
    return Boolean(coerced && Object.entries(coerced).some(([, value]) => typeof value === 'string' && value.trim() !== ''));
};

const getAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return null;
    const dob = new Date(dateOfBirth);
    if (Number.isNaN(dob.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age -= 1;
    return age;
};

const formatHeight = (heightInCm: number | null) => {
    if (!heightInCm) return 'Not shared';
    const totalInches = Math.round(heightInCm / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}'${inches}"`;
};

const scoreProfile = (candidate: SuggestedProfile, preferences: PreferencesForm) => {
    let score = 20;
    const candidateAge = getAge(candidate.date_of_birth);
    const ageMin = preferences.age_min ? parseInt(preferences.age_min, 10) : null;
    const ageMax = preferences.age_max ? parseInt(preferences.age_max, 10) : null;
    const heightMin = preferences.height_min ? parseInt(preferences.height_min, 10) : null;
    const heightMax = preferences.height_max ? parseInt(preferences.height_max, 10) : null;
    const incomeMin = preferences.annual_income_min ? parseInt(preferences.annual_income_min, 10) : null;
    const occupationKeyword = preferences.occupation_keyword.trim().toLowerCase();
    const preferredGender = normalizeGenderValue(preferences.preferred_gender);
    const candidateGender = normalizeGenderValue(candidate.gender);

    if (ageMin !== null && candidateAge !== null) score += candidateAge >= ageMin ? 10 : -8;
    if (ageMax !== null && candidateAge !== null) score += candidateAge <= ageMax ? 10 : -8;
    if (heightMin !== null && candidate.height !== null) score += candidate.height >= heightMin ? 6 : -4;
    if (heightMax !== null && candidate.height !== null) score += candidate.height <= heightMax ? 6 : -4;
    if (preferredGender && candidateGender === preferredGender) score += 16;
    if (preferredGender && candidateGender && candidateGender !== preferredGender) score -= 18;
    if (preferences.marital_status && candidate.marital_status === preferences.marital_status) score += 8;
    if (preferences.religion_name && candidate.religion_name === preferences.religion_name) score += 12;
    if (preferences.caste_name && candidate.caste_name?.toLowerCase() === preferences.caste_name.toLowerCase()) score += 10;
    if (preferences.mother_tongue && candidate.mother_tongue === preferences.mother_tongue) score += 8;
    if (preferences.manglik && candidate.manglik === preferences.manglik) score += 6;
    if (preferences.degree && candidate.degree?.toLowerCase().includes(preferences.degree.toLowerCase())) score += 8;
    if (preferences.employed_in && candidate.employed_in === preferences.employed_in) score += 6;
    if (occupationKeyword && candidate.occupation?.toLowerCase().includes(occupationKeyword)) score += 8;
    if (incomeMin !== null && candidate.annual_income !== null) score += candidate.annual_income >= incomeMin ? 8 : -5;
    if (preferences.country && candidate.country?.toLowerCase() === preferences.country.toLowerCase()) score += 5;
    if (preferences.state && candidate.state?.toLowerCase() === preferences.state.toLowerCase()) score += 7;
    if (preferences.city && candidate.city?.toLowerCase() === preferences.city.toLowerCase()) score += 9;
    if (candidate.photo_url || candidate.photos?.[0]) score += 4;
    if (candidate.about_me) score += 2;
    return score;
};

export default function MatchesPage() {
    const { user, loading: authLoading, refreshSession } = useAuth();
    const [profile, setProfile] = React.useState<UserProfile | null>(null);
    const [preferences, setPreferences] = React.useState<PreferencesForm>(getDefaultPreferences());
    const [matches, setMatches] = React.useState<RankedProfile[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [showPopup, setShowPopup] = React.useState(false);
    const [popupMessage, setPopupMessage] = React.useState('');
    const [selectedMatch, setSelectedMatch] = React.useState<RankedProfile | null>(null);
    const [interestBusy, setInterestBusy] = React.useState(false);
    const [interestedIds, setInterestedIds] = React.useState<Record<string, boolean>>({});
    const [fetchingMatches, setFetchingMatches] = React.useState(false);
    const [isEditingPreferences, setIsEditingPreferences] = React.useState(false);
    const formRef = React.useRef<HTMLDivElement>(null);
    const contextLoadInFlightRef = React.useRef(false);
    const manualEditModeRef = React.useRef(false);
    const preferencesConfigured = hasConfiguredPreferences(profile?.partner_preferences);

    const loadShortlistedProfiles = React.useCallback(async () => {
        try {
            const response = await fetch('/api/shortlist', { cache: 'no-store' });
            if (!response.ok) return;

            const payload = await response.json();
            const ids = ((payload?.data || []) as { shortlisted_profile?: { id?: string } }[])
                .map((entry) => entry.shortlisted_profile?.id)
                .filter((id): id is string => Boolean(id));

            const index: Record<string, boolean> = {};
            ids.forEach((id) => {
                index[id] = true;
            });
            setInterestedIds(index);
        } catch (error) {
            console.error('Failed to fetch shortlist status:', error);
        }
    }, []);

    const loadMatchesContext = React.useCallback(async (userId: string) => {
        if (contextLoadInFlightRef.current) return;
        contextLoadInFlightRef.current = true;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, first_name, last_name, gender, status, partner_preferences')
                .eq('id', userId)
                .single();

            if (error) throw error;

            const nextProfile = data as UserProfile;
            setProfile(nextProfile);
            setPreferences(normalizePreferences(nextProfile.partner_preferences, nextProfile.gender));
            setIsEditingPreferences((currentState) => {
                if (manualEditModeRef.current) return true;
                if (currentState && !hasConfiguredPreferences(nextProfile.partner_preferences)) return true;
                return !hasConfiguredPreferences(nextProfile.partner_preferences);
            });
        } catch (error) {
            console.error('Matches page load error:', error);
        } finally {
            setLoading(false);
            contextLoadInFlightRef.current = false;
        }
    }, []);

    const fetchSuggestedMatches = React.useCallback(async (currentProfile: UserProfile, currentPreferences: PreferencesForm) => {
        if (currentProfile.status !== 'approved' || !hasConfiguredPreferences(currentProfile.partner_preferences)) {
            setMatches([]);
            return;
        }

        setFetchingMatches(true);
        try {
            const query = supabase
                .from('profiles')
                .select('id, first_name, last_name, gender, date_of_birth, height, marital_status, religion_name, caste_name, mother_tongue, manglik, degree, employed_in, occupation, annual_income, city, state, country, photo_url, photos, about_me')
                .eq('status', 'approved')
                .neq('id', currentProfile.id)
                .limit(80);

            const { data, error } = await query;
            if (error) throw error;

            const candidates = ((data as SuggestedProfile[] | null) || []);
            const preferredGender = normalizeGenderValue(currentPreferences.preferred_gender);
            const preferredGenderCandidates = preferredGender
                ? candidates.filter((candidate) => normalizeGenderValue(candidate.gender) === preferredGender)
                : candidates;
            const rankedSource = preferredGenderCandidates.length > 0 ? preferredGenderCandidates : candidates;

            const ranked = (rankedSource.map((candidate) => ({
                ...candidate,
                score: Math.max(1, Math.min(99, scoreProfile(candidate, currentPreferences))),
            }))).sort((a, b) => b.score - a.score).slice(0, 12);

            setMatches(ranked);
        } catch (error) {
            console.error('Suggested matches fetch error:', error);
            setMatches([]);
        } finally {
            setFetchingMatches(false);
        }
    }, []);

    React.useEffect(() => {
        const bootstrap = async () => {
            if (authLoading) return;
            if (user?.id) {
                await loadMatchesContext(user.id);
                return;
            }
            await refreshSession();

            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.id) {
                await loadMatchesContext(session.user.id);
            } else {
                setLoading(false);
            }
        };

        void bootstrap();
    }, [user?.id, authLoading, refreshSession, loadMatchesContext]);

    React.useEffect(() => {
        if (profile) {
            void fetchSuggestedMatches(profile, preferences);
        }
    }, [profile, preferences, fetchSuggestedMatches]);

    React.useEffect(() => {
        if (profile?.status === 'approved') {
            void loadShortlistedProfiles();
        }
    }, [profile?.status, loadShortlistedProfiles]);

    React.useEffect(() => {
        if (!selectedMatch) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSelectedMatch(null);
            }
        };
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [selectedMatch]);

    React.useEffect(() => {
        const handleFocus = async () => {
            if (document.visibilityState === 'hidden') return;
            if (user?.id) {
                await loadMatchesContext(user.id);
            }
        };

        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleFocus);
        };
    }, [user?.id, loadMatchesContext]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setPreferences((currentPreferences) => ({ ...currentPreferences, [name]: value }));
    };

    const handleScrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleEnableEditing = () => {
        manualEditModeRef.current = true;
        setIsEditingPreferences(true);
    };

    const handleCancelEditing = () => {
        manualEditModeRef.current = false;
        setPreferences(normalizePreferences(profile?.partner_preferences, profile?.gender));
        setIsEditingPreferences(false);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!user?.id) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    partner_preferences: preferences,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (error) throw error;

            const updatedProfile = profile ? { ...profile, partner_preferences: preferences } : null;
            if (updatedProfile) {
                setProfile(updatedProfile);
            }
            manualEditModeRef.current = false;
            setIsEditingPreferences(false);

            if (profile?.status === 'approved') {
                setPopupMessage('Preferences saved. Your best and preferred matches are now ready above.');
                if (updatedProfile) {
                    await fetchSuggestedMatches(updatedProfile, preferences);
                }
            } else {
                setPopupMessage('Preferences saved. Please wait until your profile is approved by admin to unlock suggestions.');
            }
        } catch (error) {
            console.error('Failed to save partner preferences:', error);
            setPopupMessage('We could not save your suggestion data right now. Please try again.');
        } finally {
            setSaving(false);
            setShowPopup(true);
        }
    };

    const suggestionsLocked = !profile || !preferencesConfigured || profile.status !== 'approved';

    const handleOpenDetails = (match: RankedProfile) => {
        setSelectedMatch(match);
    };

    const handleCloseDetails = () => {
        setSelectedMatch(null);
    };

    const handleShowInterest = async (profileId: string) => {
        if (interestBusy || interestedIds[profileId]) return;
        setInterestBusy(true);

        try {
            const response = await fetch('/api/shortlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileId }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => null);
                if (payload?.error !== 'Already shortlisted') {
                    throw new Error(payload?.error || 'Failed to show interest');
                }
            }

            setInterestedIds((current) => ({ ...current, [profileId]: true }));
        } catch (error) {
            console.error(error);
        } finally {
            setInterestBusy(false);
        }
    };

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div>
                    <p className={styles.eyebrow}>Personalized Matchmaking</p>
                    <h1 className={styles.title}>Suggested Profiles</h1>
                    <p className={styles.subtitle}>
                        Add your ideal age, community, location, and career preferences to unlock better recommendations once your profile is approved.
                    </p>
                </div>
            </section>

            <section className={styles.panel}>
                <div className={styles.sectionHeader}>
                    <div>
                        <p className={styles.sectionEyebrow}>Above the form</p>
                        <h2 className={styles.sectionTitle}>Best Profiles For You</h2>
                    </div>
                    <div className={styles.sectionMeta}>
                        <Sparkles size={16} />
                        <span>{profile?.status === 'approved' ? 'Live suggestions' : 'Unlocks after approval'}</span>
                    </div>
                </div>

                <div className={styles.carouselShell}>
                    <div className={`${styles.carouselTrack} ${suggestionsLocked ? styles.lockedTrack : ''}`}>
                        {(suggestionsLocked || fetchingMatches) && Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className={styles.skeletonCard}>
                                <div className={styles.skeletonImage} />
                                <div className={styles.skeletonLine} />
                                <div className={`${styles.skeletonLine} ${styles.shortLine}`} />
                            </div>
                        ))}

                        {!suggestionsLocked && !fetchingMatches && matches.map((match, index) => (
                            <article
                                key={match.id}
                                className={styles.matchCard}
                                onClick={() => handleOpenDetails(match)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        handleOpenDetails(match);
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                            >
                                <div className={styles.matchImageWrap}>
                                    <Image
                                        src={match.photo_url || match.photos?.[0] || '/image 1.png'}
                                        alt={`${match.first_name || 'Member'} profile`}
                                        fill
                                        className={styles.matchImage}
                                        unoptimized
                                    />
                                    <div className={styles.matchBadge}>{index === 0 ? 'Best Fit' : `Top ${index + 1}`}</div>
                                </div>
                                <div className={styles.matchBody}>
                                    <div className={styles.matchHead}>
                                        <h3 className={styles.matchName}>{`${match.first_name || ''} ${match.last_name || ''}`.trim() || 'Member'}</h3>
                                        <p className={styles.matchMeta}>Age <span>{getAge(match.date_of_birth) || 'N/A'}</span></p>
                                    </div>
                                    <div className={styles.tagGrid}>
                                        <span className={styles.tag}>{match.marital_status || 'Unmarried'}</span>
                                        <span className={styles.tag}>{match.city || 'Location open'}</span>
                                        <span className={styles.tag}>{match.mother_tongue || 'Language open'}</span>
                                        <span className={styles.tag}>{match.religion_name || 'Community open'}</span>
                                        <span className={styles.tag}>{match.occupation || match.degree || 'Profession open'}</span>
                                        <span className={`${styles.tag} ${styles.verifiedTag}`}>Verified</span>
                                    </div>
                                </div>
                            </article>
                        ))}

                        {!suggestionsLocked && !fetchingMatches && matches.length === 0 && (
                            <div className={styles.emptyState}>
                                <h3>No strong matches yet</h3>
                                <p>Try broadening your preferences slightly and more relevant profiles will appear here.</p>
                            </div>
                        )}
                    </div>

                    {suggestionsLocked && (
                        <div className={styles.lockOverlay}>
                            <div className={styles.lockCard}>
                                <BadgeCheck size={22} />
                                <h3>{preferencesConfigured ? 'Waiting for profile approval' : 'Fill your suggestion data first'}</h3>
                                <p>
                                    {preferencesConfigured
                                        ? 'Your preferences are saved. Suggestions will unlock automatically after admin approves your profile.'
                                        : 'Complete the preference form below so we can personalize your recommended profiles.'}
                                </p>
                                {preferencesConfigured ? (
                                    <button type="button" className={`${styles.fillButton} ${styles.waitButton}`} disabled>
                                        Wait till profile approved
                                    </button>
                                ) : (
                                    <button type="button" className={styles.fillButton} onClick={handleScrollToForm}>
                                        Fill suggestion data
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className={styles.panel} ref={formRef}>
                <div className={styles.sectionHeader}>
                    <div>
                        <p className={styles.sectionEyebrow}>Preference form</p>
                        <h2 className={styles.sectionTitle}>Tell Us Your Ideal Match</h2>
                    </div>
                    <div className={styles.sectionMeta}>
                        <SlidersHorizontal size={16} />
                        <span>Used for best-match scoring</span>
                    </div>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={`${styles.formGrid} ${!isEditingPreferences ? styles.formGridLocked : ''}`}>
                        <div className={styles.group}><label>Looking For</label><select name="preferred_gender" value={preferences.preferred_gender} onChange={handleChange} disabled={!isEditingPreferences}><option value="">Select</option><option value="male">Groom</option><option value="female">Bride</option><option value="other">Other</option></select></div>
                        <div className={styles.group}><label>Age From</label><select name="age_min" value={preferences.age_min} onChange={handleChange} disabled={!isEditingPreferences}><option value="">Select</option>{ageOptions.map((age) => <option key={age} value={age}>{age}</option>)}</select></div>
                        <div className={styles.group}><label>Age To</label><select name="age_max" value={preferences.age_max} onChange={handleChange} disabled={!isEditingPreferences}><option value="">Select</option>{ageOptions.map((age) => <option key={age} value={age}>{age}</option>)}</select></div>
                        <div className={styles.group}><label>Height From (cm)</label><select name="height_min" value={preferences.height_min} onChange={handleChange} disabled={!isEditingPreferences}><option value="">Select</option>{heightOptions.map((height) => <option key={height} value={height}>{height}</option>)}</select></div>
                        <div className={styles.group}><label>Height To (cm)</label><select name="height_max" value={preferences.height_max} onChange={handleChange} disabled={!isEditingPreferences}><option value="">Select</option>{heightOptions.map((height) => <option key={height} value={height}>{height}</option>)}</select></div>
                        <div className={styles.group}><label>Marital Status</label><select name="marital_status" value={preferences.marital_status} onChange={handleChange} disabled={!isEditingPreferences}>{maritalOptions.map((option) => <option key={option || 'all'} value={option}>{option || 'Any'}</option>)}</select></div>
                        <div className={styles.group}><label>Religion</label><select name="religion_name" value={preferences.religion_name} onChange={handleChange} disabled={!isEditingPreferences}>{religionOptions.map((option) => <option key={option || 'all'} value={option}>{option || 'Any'}</option>)}</select></div>
                        <div className={styles.group}><label>Caste / Community</label><input name="caste_name" value={preferences.caste_name} onChange={handleChange} placeholder="Eg. Kshatriya, Agarwal" disabled={!isEditingPreferences} /></div>
                        <div className={styles.group}><label>Mother Tongue</label><select name="mother_tongue" value={preferences.mother_tongue} onChange={handleChange} disabled={!isEditingPreferences}>{motherTongueOptions.map((option) => <option key={option || 'all'} value={option}>{option || 'Any'}</option>)}</select></div>
                        <div className={styles.group}><label>Manglik Preference</label><select name="manglik" value={preferences.manglik} onChange={handleChange} disabled={!isEditingPreferences}>{manglikOptions.map((option) => <option key={option || 'all'} value={option}>{option || 'Any'}</option>)}</select></div>
                        <div className={styles.group}><label>Preferred Degree</label><input name="degree" value={preferences.degree} onChange={handleChange} placeholder="Eg. B.Tech, MBA, Doctor" disabled={!isEditingPreferences} /></div>
                        <div className={styles.group}><label>Employed In</label><select name="employed_in" value={preferences.employed_in} onChange={handleChange} disabled={!isEditingPreferences}>{employedInOptions.map((option) => <option key={option || 'all'} value={option}>{option || 'Any'}</option>)}</select></div>
                        <div className={styles.group}><label>Occupation Keyword</label><input name="occupation_keyword" value={preferences.occupation_keyword} onChange={handleChange} placeholder="Eg. Software, IAS, Business" disabled={!isEditingPreferences} /></div>
                        <div className={styles.group}><label>Minimum Income</label><select name="annual_income_min" value={preferences.annual_income_min} onChange={handleChange} disabled={!isEditingPreferences}>{incomeOptions.map((option) => <option key={option.label} value={option.value}>{option.label}</option>)}</select></div>
                        <div className={styles.group}><label>Country</label><input name="country" value={preferences.country} onChange={handleChange} placeholder="Country" disabled={!isEditingPreferences} /></div>
                        <div className={styles.group}><label>State</label><input name="state" value={preferences.state} onChange={handleChange} placeholder="State" disabled={!isEditingPreferences} /></div>
                        <div className={styles.group}><label>City</label><input name="city" value={preferences.city} onChange={handleChange} placeholder="City" disabled={!isEditingPreferences} /></div>
                    </div>

                    <div className={styles.formFooter}>
                        <div className={styles.helperText}>
                            <Search size={16} />
                            <span>{isEditingPreferences ? 'These details help us score and sort stronger partner suggestions for you.' : 'Your suggestion data is locked. Click edit to update it.'}</span>
                        </div>
                        {preferencesConfigured && !isEditingPreferences ? (
                            <button type="button" className={styles.submitButton} onClick={handleEnableEditing}>
                                Edit suggestion data
                            </button>
                        ) : (
                            <div className={styles.formActions}>
                                {preferencesConfigured && (
                                    <button type="button" className={styles.secondaryButton} onClick={handleCancelEditing} disabled={saving}>
                                        Cancel editing
                                    </button>
                                )}
                                <button type="submit" className={styles.submitButton} disabled={saving}>
                                    {saving ? 'Saving suggestion data...' : preferencesConfigured ? 'Save updated suggestion data' : 'Save suggestion data'}
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </section>

            {selectedMatch && (
                <div className={styles.detailOverlay} onClick={handleCloseDetails}>
                    <div className={styles.detailCard} onClick={(event) => event.stopPropagation()}>
                        <button type="button" className={styles.detailClose} onClick={handleCloseDetails} aria-label="Close details">
                            <X size={18} />
                        </button>

                        <div className={styles.detailPhotoWrap}>
                            <Image
                                src={selectedMatch.photo_url || selectedMatch.photos?.[0] || '/image 1.png'}
                                alt={`${selectedMatch.first_name || 'Member'} profile`}
                                fill
                                className={styles.detailPhoto}
                                unoptimized
                            />
                        </div>

                        <div className={styles.detailContent}>
                            <div className={styles.detailHeader}>
                                <h2>{`${selectedMatch.first_name || ''} ${selectedMatch.last_name || ''}`.trim() || 'Member'}</h2>
                                <p>Age <span>{getAge(selectedMatch.date_of_birth) || 'N/A'}</span></p>
                            </div>

                            <div className={styles.detailFactGrid}>
                                <p><span>Age:</span> {getAge(selectedMatch.date_of_birth) || 'N/A'} years</p>
                                <p><span>Religion / Community:</span> {selectedMatch.religion_name || 'Open'}</p>
                                <p><span>Caste:</span> {selectedMatch.caste_name || 'Open'}</p>
                                <p><span>Location:</span> {[selectedMatch.city, selectedMatch.state, selectedMatch.country].filter(Boolean).join(', ') || 'Not shared'}</p>
                                <p><span>Height:</span> {formatHeight(selectedMatch.height)}</p>
                                <p><span>Marital Status:</span> {selectedMatch.marital_status || 'Not shared'}</p>
                                <p><span>Job:</span> {selectedMatch.occupation || 'Not shared'}</p>
                                <p><span>Education:</span> {selectedMatch.degree || 'Not shared'}</p>
                            </div>

                            <div className={styles.detailAbout}>
                                <h3>About me</h3>
                                <p>{selectedMatch.about_me || 'This member has not shared their introduction yet.'}</p>
                            </div>

                            <div className={styles.detailActions}>
                                <button
                                    type="button"
                                    className={styles.detailPrimaryBtn}
                                    disabled={interestBusy || Boolean(interestedIds[selectedMatch.id])}
                                    onClick={() => void handleShowInterest(selectedMatch.id)}
                                >
                                    {interestBusy ? 'Updating...' : interestedIds[selectedMatch.id] ? 'Interested' : 'Show Interest'}
                                </button>
                                <button type="button" className={styles.detailSecondaryBtn} onClick={handleCloseDetails}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showPopup && (
                <div className={styles.popupOverlay} onClick={() => setShowPopup(false)}>
                    <div className={styles.popupCard} onClick={(event) => event.stopPropagation()}>
                        <BadgeCheck size={28} />
                        <h3>Suggestion data saved</h3>
                        <p>{popupMessage}</p>
                        <button type="button" className={styles.closePopupButton} onClick={() => setShowPopup(false)}>Okay</button>
                    </div>
                </div>
            )}

            {loading && !profile && (
                <div className={styles.loadingState}>
                    <div className={styles.loader} />
                    <span>Loading your suggestion setup...</span>
                </div>
            )}
        </div>
    );
}

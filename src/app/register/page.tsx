"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './register.module.css';
import { Eye, EyeOff, Upload, X } from 'lucide-react';
import CustomSelect from '@/components/common/CustomSelect';

const RegisterPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const [formData, setFormData] = useState({
        // Account
        email: '',
        password: '',
        phone: '',

        // Profile For
        profileFor: '',
        managedBy: '',

        // Basic
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        height: '',
        weight: '',
        bodyType: '',
        bloodGroup: '',
        complexion: '',
        maritalStatus: '',
        lookingFor: '', // Auto-set

        // Religion
        motherTongue: '',
        religion: '',
        caste: '',
        subCaste: '',
        manglik: 'no',
        horoscopeFile: null as File | null,

        // Career
        degree: '',
        employedIn: '',
        occupation: '',
        income: '',
        country: 'India',
        state: '',
        city: '',

        // Family
        familyType: '',
        fatherOcc: '',
        motherOcc: '',
        brothersTotal: '0',
        brothersMarried: '0',
        sistersTotal: '0',
        sistersMarried: '0',
        nativeCity: '',
        familyLocation: '',
        aboutFamily: '',

        // Bio & Photos
        aboutMe: '',
        photos: [] as File[]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
        const { name, value } = e.target;

        // Auto-fill Gender and Looking For based on Profile For
        if (name === 'profileFor') {
            let autoGender = '';
            let autoLookingFor = '';

            if (value === 'son' || value === 'brother') {
                autoGender = 'male';
                autoLookingFor = 'bride';
            } else if (value === 'daughter' || value === 'sister') {
                autoGender = 'female';
                autoLookingFor = 'groom';
            }

            setFormData(prev => ({
                ...prev,
                [name]: value,
                gender: autoGender,
                lookingFor: autoLookingFor
            }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, files } = e.target;
        if (files && files.length > 0) {
            const MAX_SIZE = 5 * 1024 * 1024; // 5MB

            if (id === 'horoscope') {
                if (files[0].size > MAX_SIZE) {
                    alert("File size exceeds 5MB limit.");
                    return;
                }
                setFormData(prev => ({ ...prev, horoscopeFile: files[0] }));
            } else if (id === 'photos') {
                const newPhotos = Array.from(files);
                const validPhotos = newPhotos.filter(file => {
                    if (file.size > MAX_SIZE) {
                        alert(`File ${file.name} exceeds 5MB limit and was skipped.`);
                        return false;
                    }
                    return true;
                });

                if (validPhotos.length > 0) {
                    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...validPhotos] }));
                }
            }
        }
    };

    const removePhoto = (index: number) => {
        setFormData(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index)
        }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Basic Validation
        if (!formData.email || !formData.password || !formData.firstName || !formData.phone) {
            setError('Please fill in all required fields.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (!isConfirmed) {
            setError('Please confirm that the information provided is accurate.');
            window.scrollTo(0, 0); // Scroll to top to see error
            return;
        }

        setLoading(true);

        try {
            // 1. Register User Action
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        gender: formData.gender,
                        date_of_birth: formData.dob,
                        height: formData.height,
                        weight: formData.weight,
                        body_type: formData.bodyType,
                        blood_group: formData.bloodGroup,
                        complexion: formData.complexion,
                        marital_status: formData.maritalStatus,
                        mother_tongue: formData.motherTongue,
                        religion_name: formData.religion,
                        caste_name: formData.caste,
                        sub_caste_name: formData.subCaste,
                        manglik: formData.manglik,
                        profile_for: formData.profileFor,
                        managed_by: formData.managedBy,
                        looking_for: formData.lookingFor,
                        degree: formData.degree,
                        employed_in: formData.employedIn,
                        occupation: formData.occupation,
                        annual_income: formData.income,
                        country: formData.country,
                        state: formData.state,
                        city: formData.city,
                        family_type: formData.familyType,
                        father_occupation: formData.fatherOcc,
                        mother_occupation: formData.motherOcc,
                        brothers_total: formData.brothersTotal,
                        brothers_married: formData.brothersMarried,
                        sisters_total: formData.sistersTotal,
                        sisters_married: formData.sistersMarried,
                        native_city: formData.nativeCity,
                        family_location: formData.familyLocation,
                        about_me: formData.aboutMe,
                        phone: formData.phone,
                        about_family: formData.aboutFamily,
                    },
                },
            });

            if (signUpError) throw signUpError;

            if (data.user && !data.session) {
                await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });
            }

            // 2. Upload Photos (Now Authenticated)
            const photoUrls: string[] = [];
            if (formData.photos.length > 0) {
                for (const file of formData.photos) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = Date.now() + '-' + Math.random().toString(36).substring(7) + '.' + fileExt;
                    const filePath = 'uploads/' + fileName;

                    const { error: uploadError } = await supabase.storage
                        .from('profile-photos')
                        .upload(filePath, file);

                    if (uploadError) {
                        console.error('CRITICAL: Photo upload failed:', uploadError.message);
                        alert(`Photo upload failed: ${uploadError.message}. We will continue registration, but you may need to upload photos later.`);
                        continue; // Skip failed uploads but continue registration
                    }

                    const { data: { publicUrl } } = supabase.storage
                        .from('profile-photos')
                        .getPublicUrl(filePath);

                    photoUrls.push(publicUrl);
                }
            }

            // 3. Upload Horoscope
            let horoscopeUrl = '';
            if (formData.horoscopeFile) {
                const fileExt = formData.horoscopeFile.name.split('.').pop();
                const fileName = 'horoscope-' + Date.now() + '.' + fileExt;
                const filePath = 'uploads/' + fileName;

                const { error: uploadError } = await supabase.storage
                    .from('profile-photos')
                    .upload(filePath, formData.horoscopeFile);

                if (!uploadError) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('profile-photos')
                        .getPublicUrl(filePath);
                    horoscopeUrl = publicUrl;
                }
            }
            // 4. Update Profile explicitly (Fallback/Sync)
            if (data.user) {
                if (!data.session) {
                    await supabase.auth.signInWithPassword({
                        email: formData.email,
                        password: formData.password,
                    });
                }

                // Construct full profile update object
                const updates = {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    gender: formData.gender,
                    date_of_birth: formData.dob || null,
                    height: formData.height ? parseFloat(formData.height) : null,
                    weight: formData.weight ? parseFloat(formData.weight) : null,
                    body_type: formData.bodyType,
                    blood_group: formData.bloodGroup,
                    complexion: formData.complexion,
                    marital_status: formData.maritalStatus,
                    mother_tongue: formData.motherTongue,
                    religion_name: formData.religion,
                    caste_name: formData.caste,
                    sub_caste_name: formData.subCaste,
                    manglik: formData.manglik,
                    profile_for: formData.profileFor,
                    managed_by: formData.managedBy,
                    degree: formData.degree,
                    employed_in: formData.employedIn,
                    occupation: formData.occupation,
                    annual_income: formData.income ? parseFloat(formData.income) : null,
                    country: formData.country,
                    state: formData.state,
                    city: formData.city,
                    family_type: formData.familyType,
                    father_occupation: formData.fatherOcc,
                    mother_occupation: formData.motherOcc,
                    brothers_total: formData.brothersTotal ? parseInt(formData.brothersTotal) : 0,
                    brothers_married: formData.brothersMarried ? parseInt(formData.brothersMarried) : 0,
                    sisters_total: formData.sistersTotal ? parseInt(formData.sistersTotal) : 0,
                    sisters_married: formData.sistersMarried ? parseInt(formData.sistersMarried) : 0,
                    native_city: formData.nativeCity,
                    family_location: formData.familyLocation,
                    about_me: formData.aboutMe,
                    about_family: formData.aboutFamily,
                    photos: photoUrls,
                    photo_url: photoUrls.length > 0 ? photoUrls[0] : null,
                    updated_at: new Date().toISOString(),
                };

                // Use update instead of upsert since the trigger already creates the row
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update(updates)
                    .eq('id', data.user.id);

                if (updateError) {
                    console.error("Manual profile update failed:", updateError.message);
                    // If update fails, it's likely RLS/Auth. 
                    // But trigger already saved the text fields!
                    // Just remind the user to check their email.
                    alert("Profile created! Please check your email to confirm your account and see your photos.");
                } else {
                    console.log("Profile updated successfully with photos.");
                }
            } else {
                console.log("Registration succeeded, but no session yet. Waiting for email confirmation?");
            }

            alert("Registration successful! Please login.");
            window.location.href = '/';

        } catch (err: any) {
            setError(err.message || "An error occurred during registration.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.formCard}>
                <h1 className={styles.pageTitle}>Create your Profile</h1>
                <p className={styles.pageSubtitle}>Join thousands of happy couples</p>

                {error && <div className={styles.errorMsg}>{error}</div>}

                <form onSubmit={handleRegister}>
                    {/* Section 1: Account & Basic Info */}
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>Account Details</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Profile For</label>
                                <CustomSelect
                                    name="profileFor"
                                    value={formData.profileFor}
                                    onChange={handleChange}
                                    required
                                    placeholder="Select Profile For"
                                    options={[
                                        { value: 'self', label: 'Self' },
                                        { value: 'son', label: 'Son' },
                                        { value: 'daughter', label: 'Daughter' },
                                        { value: 'sister', label: 'Sister' },
                                        { value: 'brother', label: 'Brother' },
                                        { value: 'friend', label: 'Relative/Friend' },
                                    ]}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Managed By</label>
                                <CustomSelect
                                    name="managedBy"
                                    value={formData.managedBy}
                                    onChange={handleChange}
                                    required
                                    placeholder="Select"
                                    options={[
                                        { value: 'self', label: 'Self' },
                                        { value: 'parent', label: 'Parent' },
                                        { value: 'sibling', label: 'Sibling' },
                                        { value: 'relative', label: 'Relative' },
                                    ]}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email</label>
                                <input type="email" name="email" className={styles.input} value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Phone</label>
                                <input type="tel" name="phone" className={styles.input} value={formData.phone} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className={styles.input}
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Personal Details */}
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>Personal Details</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>First Name</label>
                                <input type="text" name="firstName" className={styles.input} value={formData.firstName} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Last Name</label>
                                <input type="text" name="lastName" className={styles.input} value={formData.lastName} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Date of Birth</label>
                                <input type="date" name="dob" className={styles.input} value={formData.dob} onChange={handleChange} required max={new Date().toISOString().split('T')[0]} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Gender</label>
                                <CustomSelect
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                    placeholder="Select Gender"
                                    options={[
                                        { value: 'male', label: 'Male' },
                                        { value: 'female', label: 'Female' },
                                    ]}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Height (cm)</label>
                                <input type="number" name="height" className={styles.input} value={formData.height} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Weight (kg)</label>
                                <input type="number" name="weight" className={styles.input} value={formData.weight} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Marital Status</label>
                                <CustomSelect
                                    name="maritalStatus"
                                    value={formData.maritalStatus}
                                    onChange={handleChange}
                                    required
                                    placeholder="Select"
                                    options={[
                                        { value: 'Never Married', label: 'Never Married' },
                                        { value: 'Divorced', label: 'Divorced' },
                                        { value: 'Widowed', label: 'Widowed' },
                                        { value: 'Awaiting Divorce', label: 'Awaiting Divorce' },
                                    ]}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Body Type</label>
                                <CustomSelect
                                    name="bodyType"
                                    value={formData.bodyType}
                                    onChange={handleChange}
                                    required
                                    placeholder="Select"
                                    options={[
                                        { value: 'Slim', label: 'Slim' },
                                        { value: 'Athletic', label: 'Athletic' },
                                        { value: 'Average', label: 'Average' },
                                        { value: 'Heavy', label: 'Heavy' },
                                    ]}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Complexion</label>
                                <CustomSelect
                                    name="complexion"
                                    value={formData.complexion}
                                    onChange={handleChange}
                                    required
                                    placeholder="Select"
                                    options={[
                                        { value: 'Very Fair', label: 'Very Fair' },
                                        { value: 'Fair', label: 'Fair' },
                                        { value: 'Wheatish', label: 'Wheatish' },
                                        { value: 'Dark', label: 'Dark' },
                                    ]}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Blood Group</label>
                                <CustomSelect
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    required
                                    placeholder="Select"
                                    options={[
                                        { value: 'A+', label: 'A+' },
                                        { value: 'A-', label: 'A-' },
                                        { value: 'B+', label: 'B+' },
                                        { value: 'B-', label: 'B-' },
                                        { value: 'AB+', label: 'AB+' },
                                        { value: 'AB-', label: 'AB-' },
                                        { value: 'O+', label: 'O+' },
                                        { value: 'O-', label: 'O-' },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Religion & Community */}
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>Religion & Community</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Religion</label>
                                <CustomSelect
                                    name="religion"
                                    value={formData.religion}
                                    onChange={handleChange}
                                    required
                                    placeholder="Select Religion"
                                    options={[
                                        { value: 'Hindu', label: 'Hindu' },
                                        { value: 'Muslim', label: 'Muslim' },
                                        { value: 'Sikh', label: 'Sikh' },
                                        { value: 'Christian', label: 'Christian' },
                                        { value: 'Jain', label: 'Jain' },
                                    ]}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Mother Tongue</label>
                                <input type="text" name="motherTongue" className={styles.input} value={formData.motherTongue} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Caste</label>
                                <input type="text" name="caste" className={styles.input} value={formData.caste} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Sub Caste</label>
                                <input type="text" name="subCaste" className={styles.input} value={formData.subCaste} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Manglik</label>
                                <CustomSelect
                                    name="manglik"
                                    value={formData.manglik}
                                    onChange={handleChange}
                                    required
                                    placeholder="Manglik Status"
                                    options={[
                                        { value: 'no', label: 'Not Manglik' },
                                        { value: 'yes', label: 'Manglik' },
                                        { value: 'partial', label: 'Anshik Manglik' },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Education & Career */}
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>Education & Career</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Highest Degree</label>
                                <input type="text" name="degree" className={styles.input} value={formData.degree} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Employed In</label>
                                <CustomSelect
                                    name="employedIn"
                                    value={formData.employedIn}
                                    onChange={handleChange}
                                    required
                                    placeholder="Select"
                                    options={[
                                        { value: 'Private', label: 'Private' },
                                        { value: 'Government', label: 'Government' },
                                        { value: 'Business', label: 'Business' },
                                        { value: 'Self-Employed', label: 'Self Employed' },
                                    ]}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Occupation</label>
                                <input type="text" name="occupation" className={styles.input} value={formData.occupation} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Annual Income (₹)</label>
                                <input type="number" name="income" className={styles.input} value={formData.income} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Location */}
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>Location</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Country</label>
                                <input type="text" name="country" className={styles.input} value={formData.country} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>State</label>
                                <input type="text" name="state" className={styles.input} value={formData.state} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>City</label>
                                <input type="text" name="city" className={styles.input} value={formData.city} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    {/* Section 6: Family Details */}
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>Family Details</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Family Type</label>
                                <CustomSelect
                                    name="familyType"
                                    value={formData.familyType}
                                    onChange={handleChange}
                                    required
                                    placeholder="Select"
                                    options={[
                                        { value: 'Nuclear', label: 'Nuclear' },
                                        { value: 'Joint', label: 'Joint' },
                                    ]}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Father's Occupation</label>
                                <input type="text" name="fatherOcc" className={styles.input} value={formData.fatherOcc} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Mother's Occupation</label>
                                <input type="text" name="motherOcc" className={styles.input} value={formData.motherOcc} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Family Location</label>
                                <input type="text" name="familyLocation" className={styles.input} value={formData.familyLocation} onChange={handleChange} />
                            </div>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>About Family</label>
                                <textarea name="aboutFamily" className={styles.textarea} value={formData.aboutFamily} onChange={handleChange} placeholder="Tell us about your family..." />
                            </div>
                        </div>
                    </div>

                    {/* Section 7: About Me & Photos */}
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>About & Photos</h3>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>About Me</label>
                            <textarea name="aboutMe" className={styles.textarea} value={formData.aboutMe} onChange={handleChange} required placeholder="Describe yourself..." />
                        </div>

                        <div className={styles.formGroup} style={{ marginTop: '20px' }}>
                            <label className={styles.label}>Upload Photos</label>
                            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '10px' }}>
                                Max size: 5MB per image. Formats: JPG, PNG. First photo will be your profile picture.
                            </p>
                            <div className={styles.photoUploadSection}>
                                {formData.photos.map((photo, index) => (
                                    <div key={index} className={styles.photoUploadBox} style={{ border: 'none' }}>
                                        <img src={URL.createObjectURL(photo)} alt="preview" className={styles.photoPreview} />
                                        <button type="button" className={styles.removePhoto} onClick={() => removePhoto(index)}><X size={12} /></button>
                                    </div>
                                ))}
                                <label className={styles.photoUploadBox}>
                                    <input type="file" id="photos" multiple accept="image/*" hidden onChange={handleFileChange} />
                                    <Upload size={24} color="#ccc" />
                                    <span style={{ fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>Add Photo</span>
                                </label>
                            </div>
                        </div>

                        <div className={styles.checkboxGroup} style={{ marginTop: '20px' }}>
                            <input type="checkbox" id="confirm" checked={isConfirmed} onChange={(e) => setIsConfirmed(e.target.checked)} />
                            <label htmlFor="confirm" style={{ fontSize: '0.9rem' }}>I confirm that the information provided is accurate.</label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                        style={{ opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Processing...' : 'Register'}
                    </button>

                </form>
            </div >
        </div >
    );
};

export default RegisterPage;

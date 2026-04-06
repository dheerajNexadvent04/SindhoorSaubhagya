"use client";

import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import styles from './ContactFormSection.module.css';
import { sendToGoogleSheet } from '@/lib/googleSheet';

const ContactFormSection = () => {
    const [formData, setFormData] = React.useState({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitMessage, setSubmitMessage] = React.useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            await sendToGoogleSheet({
                formType: 'contact-page-message',
                submittedAt: new Date().toISOString(),
                pagePath: '/contact',
                ...formData,
            });

            setSubmitMessage('Message submitted successfully. Our team will contact you soon.');
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
        } catch (error) {
            console.error('ContactFormSection: submit failed', error);
            setSubmitMessage('Unable to submit right now. Please try again in a moment.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>

                {/* Left Side - Form */}
                <div className={styles.formSide}>
                    <h2 className={styles.formTitle}>Send us a Message</h2>
                    <form onSubmit={handleSubmit} data-sheet-ignore="true" data-form-type="contact-page-message">
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Enter your full name"
                                className={styles.input}
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="your.email@example.com"
                                className={styles.input}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="+91 98765 43210"
                                className={styles.input}
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Subject</label>
                            <select
                                className={styles.select}
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select a subject</option>
                                <option value="general">General Inquiry</option>
                                <option value="support">Technical Support</option>
                                <option value="billing">Billing</option>
                                <option value="feedback">Feedback</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Message / Query</label>
                            <textarea
                                name="message"
                                placeholder="Tell us how we can help you..."
                                className={styles.textarea}
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                        {submitMessage && (
                            <p style={{ marginTop: '12px', fontSize: '14px', color: '#333' }}>{submitMessage}</p>
                        )}
                    </form>
                </div>

                {/* Right Side - Info */}
                <div className={styles.infoSide}>
                    <h3 className={styles.infoTitle}>Contact Information</h3>

                    {/* Address */}
                    <div className={styles.infoItem}>
                        <div className={styles.iconCircle}>
                            <MapPin size={24} color="#E31E24" />
                        </div>
                        <div className={styles.infoContent}>
                            <h4>Office Address</h4>
                            <p>123 Matrimony Plaza, Connaught Place</p>
                            <p>New Delhi - 110001, India</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className={styles.infoItem}>
                        <div className={styles.iconCircle}>
                            <Mail size={24} color="#E31E24" />
                        </div>
                        <div className={styles.infoContent}>
                            <h4>Email Address</h4>
                            <a href="mailto:support@matrimony.com">support@matrimony.com</a>
                            <a href="mailto:care@matrimony.com">care@matrimony.com</a>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className={styles.infoItem}>
                        <div className={styles.iconCircle}>
                            <Phone size={24} color="#E31E24" />
                        </div>
                        <div className={styles.infoContent}>
                            <h4>Contact Number</h4>
                            <p>+91 98765 43210</p>
                            <p>+91 98765 43211 (Toll Free)</p>
                        </div>
                    </div>

                    <div className={styles.separator}></div>

                    <h4 className={styles.operatingTitle}>Operating Hours</h4>
                    <p className={styles.operatingText}>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className={styles.operatingText}>Saturday: 10:00 AM - 4:00 PM</p>
                    <p className={styles.operatingText}>Sunday: Closed</p>

                </div>
            </div>
        </section>
    );
};

export default ContactFormSection;

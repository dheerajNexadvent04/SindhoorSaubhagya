"use client";
import React, { useState } from "react";
import styles from "./MatrimonyQueries.module.css";
import Image from "next/image";

const faqs = [
    {
        question: "Q1: How do I create a profile on Sindoor Saubhagya?",
        answer:
            "Click on the Register button and fill in your details step by step. The whole thing takes about five to ten minutes. Once submitted our team reviews your profile and it typically goes live within a day. After that you can start browsing at your own pace.",
    },
    {
        question: "Q2: Can I look for profiles from a specific religion or community?",
        answer: "Yes. The search filters on our platform let you look by religion, community, caste, mother tongue, location, and several other criteria. You are in complete control of how you narrow your search.",
    },
    {
        question: "Q3: How is my personal information handled?",
        answer: "Your data is stored securely and encrypted. You control what appears on your profile and who can contact you. We do not share your information with outside parties.",
    },
    {
        question: "Q4: Who do I speak to if I run into a problem?",
        answer: "Reach out through the Contact Us page, by email, or by phone. Our team is available Monday through Saturday. We try to respond to every message within the same day.",
    },
];

const MatrimonyQueries: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>
                Things People Usually <span className={styles.highlight}>Ask Us</span>
            </h2>

            <div className={styles.container}>
                {/* Left Side - Images */}
                <div className={styles.imageGrid}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/couple-traditional.png"
                            alt="Couple Traditional"
                            fill
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/think-people-2.png"
                            alt="Think People 2"
                            fill
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/couple_1.png"
                            alt="Couple 1"
                            fill
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/think-people-4.png"
                            alt="Think People 4"
                            fill
                            className={styles.image}
                        />
                    </div>
                </div>

                {/* Right Side - FAQ Accordion */}
                <div className={styles.faqList}>
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`${styles.faqItem} ${openIndex === index ? styles.active : ""
                                }`}
                            onClick={() => toggleFAQ(index)}
                        >
                            <div className={styles.faqHeader}>
                                <span className={styles.question}>{faq.question}</span>
                                <span className={styles.icon}>
                                    <svg
                                        width="14"
                                        height="8"
                                        viewBox="0 0 14 8"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`${styles.arrow} ${openIndex === index ? styles.arrowOpen : ''}`}
                                    >
                                        <path d="M1 1L7 7L13 1" stroke="#D32F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </div>
                            <div className={`${styles.faqBody} ${openIndex === index ? styles.open : ''}`}>
                                <div className={styles.faqInner}>
                                    <div className={styles.faqContent}>
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MatrimonyQueries;

"use client";

import Image from 'next/image';
import styles from './Testimonials.module.css';


const testimonials = [
    {
        id: 1,
        text: "I was not expecting much honestly. I had been on a couple of other platforms and felt like I was just another profile in a pile. But the conversations I had here felt different from the start. The person I ended up meeting had a very similar outlook on life and family. We got married last year and I still think about how close I came to not signing up.",
        name: "Karan and Meghna",
        role: "New Delhi",
        image: "/groom-phone.png"
    },
    {
        id: 2,
        text: "We were looking for someone for our son for almost two years. Nothing was clicking. A relative suggested we try Sindoor Saubhagya and within a few months we came across a profile that felt right in every way. The families met, conversations happened naturally, and things moved forward from there. We are very glad we gave it a chance.",
        name: "Suresh and Kamala",
        role: "Delhi",
        image: "/bride-phone.png"
    },
    {
        id: 3,
        text: "Faith was really important to me in a partner and I found it genuinely difficult to find that on most platforms. Here I could actually filter by what mattered to me without it feeling like an afterthought. I met my husband through this platform and our shared values have been the foundation of our relationship from day one.",
        name: "Divya and Rajat",
        role: "Delhi",
        image: "/couple-formal.png"
    },
    {
        id: 4,
        text: "The profiles here felt more real than what I had seen elsewhere. People had actually filled things in properly and you could get a sense of who someone was before reaching out. My wife and I spoke for three months before meeting and by the time we did it felt like we already knew each other. It was a good experience overall.",
        name: "Shilpika and Rakesh",
        role: "Delhi",
        image: "/couple-traditional.png"
    },
];

// Duplicate data to ensure seamless scroll loop
const marqueeData = [...testimonials, ...testimonials, ...testimonials];

const Testimonials = () => {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    In Their <span className={styles.titleHighlight}>Own Words</span>
                </h2>
                <p className={styles.subtitle}>
                    A few people who used this platform share what the experience was like for them.
                </p>
            </div>

            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeRow}>
                    <div className={`${styles.marqueeRow} ${styles.scrollRight}`}>
                        {marqueeData.map((item, index) => (
                            <div key={`row1-${index}`} className={styles.card}>
                                <div className={styles.stars}>*****</div>
                                <p className={styles.quote}>"{item.text}"</p>
                                <div className={styles.author}>
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={48}
                                        height={48}
                                        className={styles.avatar}
                                    />
                                    <div className={styles.authorInfo}>
                                        <span className={styles.authorName}>{item.name}</span>
                                        <span className={styles.authorRole}>{item.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.marqueeRow}>
                    <div className={`${styles.marqueeRow} ${styles.scrollLeft}`}>
                        {marqueeData.map((item, index) => (
                            <div key={`row2-${index}`} className={styles.card}>
                                <div className={styles.stars}>*****</div>
                                <p className={styles.quote}>"{item.text}"</p>
                                <div className={styles.author}>
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={48}
                                        height={48}
                                        className={styles.avatar}
                                    />
                                    <div className={styles.authorInfo}>
                                        <span className={styles.authorName}>{item.name}</span>
                                        <span className={styles.authorRole}>{item.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;


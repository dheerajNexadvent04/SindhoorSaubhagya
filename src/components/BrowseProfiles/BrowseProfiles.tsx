"use client";
import React, { useState } from 'react';
import styles from './BrowseProfiles.module.css';

const TABS = [
    'Marital Status',
    'Caste',
    'Sect',
    'State',
    'City'
];

const DATA: Record<string, string[]> = {
    'Marital Status': [
        'Never Married', 'Divorced', 'Widowed', 'Separated', 'Awaiting Divorce'
    ],
    'Caste': [
        'Adidravida', 'Agarwal', 'Arya Vysya', 'Baniya', 'Brahmin', 'Brahmin - Iyer', 'Brahmin - Iyengar',
        'Chettiar', 'Jat', 'Kapu', 'Kayastha', 'Khatri', 'Kshatriya', 'Lingayat', 'Maratha', 'Mudaliar',
        'Nadar', 'Nair', 'Padmasali', 'Rajput', 'Reddy', 'SC', 'ST', 'Sindhi', 'Vanniyar', 'Velama',
        'Vokkaliga', 'Yadav'
    ],
    'Sect': [
        'Shaivism', 'Vaishnavism', 'Shaktism', 'Smartism', 'Arya Samaj', 'ISKCON',
        'Digambar', 'Shvetambar', 'Theravada', 'Mahayana', 'Radhasoami', 'Swaminarayan'
    ],
    'State': [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
        'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
        'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
        'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
    ],
    'City': [
        'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat',
        'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
        'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot'
    ]
};

const BrowseProfiles: React.FC = () => {
    const [activeTab, setActiveTab] = useState(TABS[0]);

    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>Browse profiles by</h2>

            <div className={styles.tabsContainer}>
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className={styles.contentGrid}>
                {DATA[activeTab]?.map((item, index) => (
                    <React.Fragment key={item}>
                        <span className={styles.item}>
                            {item}
                        </span>
                        {index < DATA[activeTab].length - 1 && (
                            <span className={styles.separator}>|</span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
};

export default BrowseProfiles;

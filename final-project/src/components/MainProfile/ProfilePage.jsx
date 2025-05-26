import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/ProfilePage.module.css';

const localhost = "http://localhost:5000";

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        institution: '',
        fieldOfExpertise: ''
    });
    const [stats, setStats] = useState({
        totalReviews: 0,
        inProgress: 0,
        completed: 0
    });
    const [isReviewer, setIsReviewer] = useState(false);
    const {roleId, userId, logout} = useAuth();

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!userId) return;
    
            try {
                const token = localStorage.getItem('authToken');
                const reviewerCheck = roleId === 2;
                setIsReviewer(reviewerCheck);

                const profileResponse = await axios.get(`${localhost}/api/profiles/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setFormData({
                    fullName: profileResponse.data.fullName || '',
                    email: profileResponse.data.email || '',
                    institution: profileResponse.data.institution || '',
                    fieldOfExpertise: profileResponse.data.fieldOfExpertise || ''
                });

                if (reviewerCheck) {
                    const reviewsResponse = await axios.get(`${localhost}/api/reviews/user/${userId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const reviews = reviewsResponse.data;
                    const totalReviews = reviews.length;
                    const completed = reviews.filter(review => review.isCompleted).length;
                    const inProgress = totalReviews - completed;
    
                    setStats({
                        totalReviews,
                        inProgress,
                        completed
                    });
                }
    
            } catch (error) {
                if (error.response?.status === 401) {
                    logout();
                }
                console.error('Error fetching profile data:', error);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchProfileData();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`${localhost}/api/profiles/${userId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Ошибка сохранения профиля:', error);
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.profilePage}>
            <section className={styles.personalInfoSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Personal Information</h2>
                    <button 
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        className={styles.editButton}
                    >
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                </div>
                <div className={styles.infoGridContainer}>
                    <div className={styles.infoField}>
                        <label className={styles.infoFieldLabel}>Full Name</label>
                        <input
                            name="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={styles.infoFieldInput}
                            readOnly={!isEditing}
                        />
                    </div>
                    
                    <div className={styles.infoField}>
                        <label className={styles.infoFieldLabel}>Email</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={styles.infoFieldInput}
                            readOnly={!isEditing}
                        />
                    </div>
                    
                    <div className={styles.infoField}>
                        <label className={styles.infoFieldLabel}>Institution</label>
                        <input
                            name="institution"
                            type="text"
                            value={formData.institution}
                            onChange={handleInputChange}
                            className={styles.infoFieldInput}
                            readOnly={!isEditing} 
                        />
                    </div>
                    
                    <div className={styles.infoField}>
                        <label className={styles.infoFieldLabel}>Field of Expertise</label>
                        <input
                            name="fieldOfExpertise"
                            type="text"
                            value={formData.fieldOfExpertise}
                            onChange={handleInputChange}
                            className={styles.infoFieldInput}
                            readOnly={!isEditing}
                        />
                    </div>
                </div>
            </section>

            {isReviewer && (
                <section className={styles.personalInfoSection}>
                    <h2>Review Statistics</h2>
                    <div className={styles.statsGrid}>
                        <div className={styles.statValue}>{stats.totalReviews}</div>
                        <div className={styles.statValue}>{stats.inProgress}</div>
                        <div className={styles.statValue}>{stats.completed}</div>
                        
                        <div className={styles.statLabel}>Total Reviews</div>
                        <div className={styles.statLabel}>In Progress</div>
                        <div className={styles.statLabel}>Completed</div>
                    </div>
                </section>
            )}


            <section className={styles.personalInfoSection}>
                <h2>Review Preferences</h2>
                <div className={styles.preferencesList}>
                    <h3> Ваще Мнение не учитывается</h3>  
                </div>
            </section>
        </div>
    );
};

export default ProfilePage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from '../../styles/ProfilePage.module.css';

const localhost = "http://localhost:5000";

const ProfilePage = () => {
    const { userId } = useParams(); // Получаем userId из URL
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
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const currentUserId = JSON.parse(atob(token.split('.')[1])).userId; // Получаем ID текущего пользователя из токена
                
                setIsCurrentUser(currentUserId === parseInt(userId));

                // Загрузка данных профиля
                const profileResponse = await axios.get(`${localhost}/api/profile/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                setFormData({
                    fullName: profileResponse.data.fullName,
                    email: profileResponse.data.email,
                    institution: profileResponse.data.institution || '',
                    fieldOfExpertise: profileResponse.data.fieldOfExpertise || ''
                });

                // Загрузка статистики
                const statsResponse = await axios.get(`${localhost}/api/profile/${userId}/stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                setStats({
                    totalReviews: statsResponse.data.totalReviews || 0,
                    inProgress: statsResponse.data.inProgress || 0,
                    completed: statsResponse.data.completed || 0
                });

            } catch (error) {
                console.error('Ошибка загрузки профиля:', error);
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
            await axios.put(`${localhost}/api/profile/${userId}`, formData, {
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

            <section className={styles.personalInfoSection}>
                <h2>Review Preferences</h2>
                <div className={styles.preferencesList}>
                    <div className={styles.preferenceItem}>
                        <input 
                            type="checkbox" 
                            id="available" 
                            defaultChecked 
                            className={styles.preferenceCheckbox}
                        />
                        <label>Available for new reviews</label>
                    </div>
                    
                    <div className={styles.preferenceItem}>
                        <label>Maximum concurrent reviews</label>
                        <input
                            type="number"
                            defaultValue="3"
                            min="1"
                            max="10"
                            className={styles.preferenceInput}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProfilePage;
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import ReviewProgressPage from '../reviewProgress/ReviewProgressPage';
import SubmitArticle from "../submitArticle/SubmitArticle";
import CompletedReviewsPage from "../completedReviews/CompletedReviewsPage";
import ArticlesPage from "../myArticlesPage/MyArticlePage";
import AdminPage from "../adminPanel/AdminPage";
import styles from '../../styles/RouterConfig.module.css';
import profileImg from '../../styles/img/profile.jpg';
import { useAuth } from '../../hooks/useAuth';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
const localhost = "http://localhost:5000";

const MainProfile = () => {
    const { roleId, username, logout, token, userId } = useAuth();
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState(null);
    const fileInputRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const fetchUserAvatar = async () => {
        try {
            const profileResponse = await axios.get(
                `${localhost}/api/profiles/${userId}`,
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            
            const profilePicId = profileResponse.data.profilePicId;
            
            if (profilePicId) {
                const fileResponse = await axios.get(
                    `${localhost}/api/files/download/${profilePicId}`,
                    {
                        responseType: 'blob',
                        headers: { 
                            'Authorization': `Bearer ${token}`,
                        }
                    }
                );
                
                const blobUrl = URL.createObjectURL(fileResponse.data);
                setAvatar(blobUrl);
            } else {
                setAvatar(undefined);
            }
        } catch (error) {
            console.error('Error fetching avatar:', error);
            setAvatar(undefined);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserAvatar();
        }
    }, [userId, token]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setAvatar(null);

            const formData = new FormData();
            formData.append('file', file);

            const fileResponse = await axios.post(
                `${localhost}/api/files/upload`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            const fileId = fileResponse.data.id;

            await axios.put(
                `${localhost}/api/profiles/${userId}/avatar`,
                { profilePicId: fileId },
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            fetchUserAvatar();

        } catch (error) {
            console.error('Error uploading avatar:', error);
            setAvatar(undefined);
        }
    };

    useEffect(() => {
        return () => {
            if (avatar && avatar !== profileImg && typeof avatar === 'string') {
                URL.revokeObjectURL(avatar);
            }
        };
    }, [avatar]);

    const isTabAvailable = (tabName) => {
        switch (tabName) {
            case 'adminPanel':
                return roleId === 1;
            case 'inProgressReviews':
            case 'completedReviews':
                return roleId === 2;
            case 'myArticles':
            case 'submitArticle':
                return roleId === 3;
            case 'profile':
                return true;
            default:
                return false;
        }
    };

    return (
        <>
            <header className={styles.appHeader}>
                <div className={styles.headerLeft}>
                    <h1>ReviewSystem</h1>
                </div>
                <div className={styles.headerRight}>
                    <span className={styles.profileName}>{username || 'Зарегайся скотина'}</span>
                    <div onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
                        {avatar === null ? (
                            <div className={styles.profileImage} style={{ backgroundColor: 'transparent' }} />
                        ) : (
                            <img
                                src={avatar || profileImg}
                                alt="User Avatar"
                                className={styles.profileImage}
                            />
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                    <button
                        onClick={handleLogout}
                        className={styles.logoutButton}
                    >
                        Exit
                    </button>
                </div>
            </header>


            <div className={styles.dashboardHeader}>
                <h2>
                    {roleId === 1 && 'Admin Dashboard'}
                    {roleId === 2 && 'Reviewer Dashboard'}
                    {roleId === 3 && 'User Dashboard'}
                    {!roleId && 'Dashboard'}
                </h2>
                <div className={styles.statusInfo}>
                    Status: <span className={styles.statusActive}>
                        {roleId === 1 && 'Admin'}
                    {roleId === 2 && 'Active Reviewer'}
                    {roleId === 3 && 'User'}
                    {!roleId && 'Unknown'}
                    </span>
                </div>
            </div>

            <nav className={styles.mainNav}>
                <div className={styles.navLinks}>
                    <NavLink to="/profile" className={({ isActive }) =>
                        isActive ? styles.activeNavLink : undefined
                    }>Profile</NavLink>

                    {isTabAvailable('myArticles') && (
                        <NavLink to="/myArticles" className={({ isActive }) =>
                            isActive ? styles.activeNavLink : undefined
                        }>My Articles</NavLink>
                    )}

                    {isTabAvailable('submitArticle') && (
                        <NavLink to="/submitArticle" className={({ isActive }) =>
                            isActive ? styles.activeNavLink : undefined
                        }>Submit Article</NavLink>
                    )}

                    {isTabAvailable('inProgressReviews') && (
                        <NavLink to="/inProgressReviews" className={({ isActive }) =>
                            isActive ? styles.activeNavLink : undefined
                        }>In Progress Reviews</NavLink>
                    )}

                    {isTabAvailable('completedReviews') && (
                        <NavLink to="/completedReviews" className={({ isActive }) =>
                            isActive ? styles.activeNavLink : undefined
                        }>Completed Reviews</NavLink>
                    )}

                    {isTabAvailable('adminPanel') && (
                        <NavLink to="/adminPanel" className={({ isActive }) =>
                            isActive ? styles.activeNavLink : undefined
                        }>Admin Panel</NavLink>
                    )}
                </div>
            </nav>

            <main className={styles.contentArea}>
                <Routes>
                    <Route path="/profile" element={<ProfilePage />} />

                    {isTabAvailable('myArticles') && (
                        <Route path="/myArticles" element={<ArticlesPage/>} />
                    )}

                    {isTabAvailable('submitArticle') && (
                        <Route path="/submitArticle" element={<SubmitArticle/>} />
                    )}

                    {isTabAvailable('inProgressReviews') && (
                        <Route path="/inProgressReviews" element={<ReviewProgressPage/>} />
                    )}

                    {isTabAvailable('completedReviews') && (
                        <Route path="/completedReviews" element={<CompletedReviewsPage/>} />
                    )}

                    {isTabAvailable('adminPanel') && (
                        <Route path="/adminPanel" element={<AdminPage/>} />
                    )}
                </Routes>
            </main>

            <footer className={styles.footercontainer}>
                <p>© 2025 Review System. All rights reserved.</p>
            </footer>
        </>
    );
};

export default MainProfile;
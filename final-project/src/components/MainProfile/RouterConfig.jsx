import { Routes, Route, NavLink } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import ReviewProgressPage from '../reviewProgress/ReviewProgressPage';
import SubmitArticle from "../submitArticle/SubmitArticle";
import CompletedReviewsPage from "../completedReviews/CompletedReviewsPage";
import ArticlesPage from "../myArticlesPage/MyArticlePage";
import AdminPage from "../adminPanel/AdminPage";
import styles from '../../styles/RouterConfig.module.css';
import profileImg from '../../styles/img/32.jpg';
import { useAuth } from '../../hooks/useAuth';

const MainProfile = () => {
    const { roleId, username } = useAuth();

    const isTabAvailable = (tabName) => {
        switch (tabName) {
            case 'adminPanel':
                return roleId === 1; // Только для админа
            case 'inProgressReviews':
            case 'completedReviews':
                return roleId === 2; // Только для ревьюера
            case 'myArticles':
            case 'submitArticle':
                return roleId === 3; // Только для пользователя
            case 'profile':
                return true; // Профиль доступен всем
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
                    <span className={styles.profileName}>{username || 'John Smith'}</span>
                    <img
                        src={profileImg}
                        alt="?"
                        className={styles.profileImage}
                    />
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
                    {/* Профиль доступен всем */}
                    <NavLink to="/profile" className={({ isActive }) =>
                        isActive ? styles.activeNavLink : undefined
                    }>Profile</NavLink>

                    {/* My Articles - только для пользователя (roleId === 3) */}
                    {isTabAvailable('myArticles') && (
                        <NavLink to="/myArticles" className={({ isActive }) =>
                            isActive ? styles.activeNavLink : undefined
                        }>My Articles</NavLink>
                    )}

                    {/* Submit Article - только для пользователя (roleId === 3) */}
                    {isTabAvailable('submitArticle') && (
                        <NavLink to="/submitArticle" className={({ isActive }) =>
                            isActive ? styles.activeNavLink : undefined
                        }>Submit Article</NavLink>
                    )}

                    {/* In Progress Reviews - только для ревьюера (roleId === 2) */}
                    {isTabAvailable('inProgressReviews') && (
                        <NavLink to="/inProgressReviews" className={({ isActive }) =>
                            isActive ? styles.activeNavLink : undefined
                        }>In Progress Reviews</NavLink>
                    )}

                    {/* Completed Reviews - только для ревьюера (roleId === 2) */}
                    {isTabAvailable('completedReviews') && (
                        <NavLink to="/completedReviews" className={({ isActive }) =>
                            isActive ? styles.activeNavLink : undefined
                        }>Completed Reviews</NavLink>
                    )}

                    {/* Admin Panel - только для админа (roleId === 1) */}
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
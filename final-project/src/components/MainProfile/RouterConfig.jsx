import { Routes, Route, NavLink } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import ReviewProgressPage from '../reviewProgressPage/ReviewProgressPage';
import styles from '../../styles/RouterConfig.module.css';
import profileImg from '../../styles/img/32.jpg';

const MainProfile = () => {
  return (
    <>
      <header className={styles.appHeader}>
        <div className={styles.headerLeft}>
          <h1>ReviewSystem</h1>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.profileName}>John Smith</span>
          <img
          src={profileImg} 
          alt="?"
          className={styles.profileImage}
        /> 
        </div>
      </header>

      <div className={styles.dashboardHeader}>
        <h2>Reviewer Dashboard</h2>
        <div className={styles.statusInfo}>
          Status: <span className={styles.statusActive}>Active Reviewer</span>
        </div>
      </div>
    
      <nav className={styles.mainNav}>
        <div className={styles.navLinks}>
          <NavLink to="/profile" className={({ isActive }) => 
            isActive ? styles.activeNavLink : undefined
          }>Profile</NavLink>
          <NavLink to="/myArticles" className={({ isActive }) => 
            isActive ? styles.activeNavLink : undefined
          }>My Articles</NavLink>
          <NavLink to="/submitArticle" className={({ isActive }) => 
            isActive ? styles.activeNavLink : undefined
          }>Submit Article</NavLink>
          <NavLink to="/inProgressReviews" className={({ isActive }) => 
            isActive ? styles.activeNavLink : undefined
          }>In Progress Reviews</NavLink>
          <NavLink to="/completedReviews" className={({ isActive }) => 
            isActive ? styles.activeNavLink : undefined
          }>Completed Reviews</NavLink>
        </div>
      </nav>
   
      <main className={styles.contentArea}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/myArticles" element={null} />
          <Route path="/submitArticle" element={null} />
          <Route path="/inProgressReviews" element={<ReviewProgressPage/>} />
          <Route path="/completedReviews" element={null} />
        </Routes>
      </main>
    </>
  );
};

export default MainProfile;
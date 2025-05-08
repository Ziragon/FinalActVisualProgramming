import { Routes, Route, NavLink } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import ReviewProgressPage from '../review_progress/ReviewProgressPage';
import '../../ProfileStyles/RouterConfig.css';

const MainProfile = () => {
  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <h1>ReviewSystem</h1>
        </div>
        <div className="header-right">
          <span className="profile-name">John Smith</span> 
        </div>
      </header>

      <div className="dashboard-header">
        <h2>Reviewer Dashboard</h2>
        <div className="status-info">
          Status: <span className="status-active">Active Reviewer</span>
        </div>
      </div>
    
      <nav className="main-nav">
        <div className="nav-links">
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/myArticles">My Articles</NavLink>
          <NavLink to="/submitArticle">Submit Article</NavLink>
          <NavLink to="/inProgressReviews">In Progress Reviews</NavLink>
          <NavLink to="/completedReviews">Completed Reviews</NavLink>
        </div>
      </nav>
   
      <main className="content-area">
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
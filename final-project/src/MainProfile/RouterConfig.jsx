import { Routes, Route, NavLink } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import ReviewProgressPage from '../components/review_progress/ReviewProgressPage';
import './ProfileStyles/RouterConfig.css';

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
          <NavLink to="/Profile">Profile</NavLink>
          <NavLink to="/MyArticles">My Articles</NavLink>
          <NavLink to="/SubmitArticle">Submit Article</NavLink>
          <NavLink to="/InProgressReviews">In Progress Reviews</NavLink>
          <NavLink to="/CompletedReviews">Completed Reviews</NavLink>
        </div>
      </nav>
   
      <main className="content-area">
        <Routes>
          <Route path="/Profile" element={<ProfilePage />} />
          <Route path="/MyArticles" element={null} />
          <Route path="/SubmitArticle" element={null} />
          <Route path="/InProgressReviews" element={ReviewProgressPage} />
          <Route path="/CompletedReviews" element={null} />
        </Routes>
      </main>
    </>
  );
};

export default MainProfile;
import React, {useState} from 'react';
import './ProfileStyles/ProfilePage.css';

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
      fullName: 'John Smith',
      email: 'john.smith@university.edu',
      institution: 'University of Science',
      fieldOfExpertise: 'Computer Science'
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleEditToggle = () => {
      setIsEditing(!isEditing);
    };

  return (
    <div className="profile-page">
  
  <section className="personal-info-section">
        <div className="section-header">
          <h2 className="section-title">Personal Information</h2>
          <button 
            onClick={handleEditToggle}
            className="edit-button"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
        <div className="info-grid-container">
          <div className="info-field">
            <label className="info-field-label">Full Name</label>
            <input
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              className="info-field-input"
              readOnly={!isEditing}
            />
          </div>
          
          <div className="info-field">
            <label className="info-field-label">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="info-field-input"
              readOnly={!isEditing}
            />
          </div>
          
          <div className="info-field">
            <label className="info-field-label">Institution</label>
            <input
              name="institution"
              type="text"
              value={formData.institution}
              onChange={handleInputChange}
              className="info-field-input"
              readOnly={!isEditing} 
            />
          </div>
          
          <div className="info-field">
            <label className="info-field-label">Field of Expertise</label>
            <input
              name="fieldOfExpertise"
              type="text"
              value={formData.fieldOfExpertise}
              onChange={handleInputChange}
              className="info-field-input"
              readOnly={!isEditing}
            />
          </div>
        </div>
      </section>

      <section className="personal-info-section">
        <h2>Review Statistics</h2>
        <div className="stats-grid">
          <div className="stat-value">12</div>
          <div className="stat-value">3</div>
          <div className="stat-value">9</div>
          
          <div className="stat-label">Total Reviews</div>
          <div className="stat-label">In Progress</div>
          <div className="stat-label">Completed</div>
        </div>
      </section>

      <section className="personal-info-section">
        <h2 >Review Preferences</h2>
        <div className="preferences-list">
          <div className="preference-item">
            <input 
              type="checkbox" 
              id="available" 
              defaultChecked 
              className="preference-checkbox"
            />
            <label>Available for new reviews</label>
          </div>
          
          <div className="preference-item">
            <label >Maximum concurrent reviews</label>
            <input
              type="number"
              defaultValue="3"
              min="1"
              max="10"
              className="preference-input"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
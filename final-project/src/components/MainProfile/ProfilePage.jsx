import React, {useState} from 'react';
import styles from '../../styles/ProfilePage.module.css';

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
      <div className={styles.profilePage}>
    
    <section className={styles.personalInfoSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Personal Information</h2>
            <button 
              onClick={handleEditToggle}
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
            <div className={styles.statValue}>12</div>
            <div className={styles.statValue}>3</div>
            <div className={styles.statValue}>9</div>
            
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
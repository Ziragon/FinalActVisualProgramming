import React from 'react';
import PortalModal from '../myArticlesPage/PortalModal.jsx';
import styles from '../../styles/CompletedReviewModal.module.css';
import starIcon from '../../styles/img/star.svg'; 


const ReviewDetailsModal = ({ review, onClose }) => {
  if (!review) return null;

  return (
    <PortalModal>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
          <h3>{review.name}</h3>

          <div className={styles.section}>
            <h3>Review Summary</h3>
            <div className={styles.ratingSection}>
              <p>Review Score</p>
              <div className={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className={`${styles.starContainer} ${
                      star <= review.rating ? styles.starFilled : ''
                    }`}
                  >
                    <img
                      src={starIcon}
                      alt={star <= review.rating ? 'Filled star' : 'Empty star'}
                      className={styles.starImage}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Recommendation</h3>
            <p>{review.decision}</p>
          </div>

          <div className={styles.section}>
            <h3>Detailed Review</h3>
            <h4>Technical Merit</h4>
            <p>{review.technicalMerit || "No technical comments provided."}</p>

            <h4>Originality</h4>
            <p>{review.originality || "No originality comments provided."}</p>

            <h4>Presentation Quality</h4>
            <p>{review.presentationQuality || "No presentation quality comments provided."}</p>
          </div>

          <div className={styles.section}>
            <h3>Additional Comments</h3>
            <h4>Comments to Authors</h4>
            <p>{review.commentsToAuthor || "No additional comments for authors."}</p>

            <h4>Confidential Comments to Editor</h4>
            <p>{review.confidentialComments || "No confidential comments for editor."}</p>
          </div>

          {review.attachments && review.attachments.length > 0 && (
            <div className={styles.section}>
              <h3>Attachments</h3>
              <ul className={styles.attachmentsList}>
                {review.attachments.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.footer}>
            <p>© {new Date().getFullYear()} Review System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </PortalModal>
  );
};

export default ReviewDetailsModal;
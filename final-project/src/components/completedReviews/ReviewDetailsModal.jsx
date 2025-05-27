import React, { useState, useEffect } from 'react';
import PortalModal from '../myArticlesPage/PortalModal.jsx';
import styles from '../../styles/CompletedReviewModal.module.css';
import starIcon from '../../styles/img/star.svg';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const ReviewDetailsModal = ({ review, onClose }) => {
  const { token } = useAuth();
  const [attachments, setAttachments] = useState([]);
  const [isLoadingAttachments, setIsLoadingAttachments] = useState(false);

  useEffect(() => {
    const fetchAttachments = async () => {
      if (!review?.attachmentsId || !token) return; // Не выполняем запрос без токена
      
      setIsLoadingAttachments(true);
      try {
        const attachmentArray = Array.isArray(review.attachmentsId) 
          ? review.attachmentsId 
          : [review.attachmentsId];
        
        const attachmentsData = await Promise.all(
          attachmentArray.map(async (id) => {
            const response = await axios.get(`http://localhost:5000/api/files/download/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` },
              responseType: 'blob',
            });
            
            const fileUrl = URL.createObjectURL(response.data);
            return {
              id,
              name: `Attachment_${id}`,
              url: fileUrl
            };
          })
        );
        
        setAttachments(attachmentsData);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching attachments:', error);
        }
      } finally {
        setIsLoadingAttachments(false);
      }
    };

    fetchAttachments();

    return () => {
      attachments.forEach(file => URL.revokeObjectURL(file.url));
    };
  }, [review, token]); 

  if (!review) return null;

  const handleDownload = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <p className={styles.wrappedText}>{review.decision}</p>
          </div>

          <div className={styles.section}>
            <h3>Detailed Review</h3>
            <h4>Technical Merit</h4>
            <p className={styles.wrappedText}>{review.technicalMerit || "No technical comments provided."}</p>

            <h4>Originality</h4>
            <p className={styles.wrappedText}>{review.originality || "No originality comments provided."}</p>

            <h4>Presentation Quality</h4>
            <p className={styles.wrappedText}>{review.presentationQuality || "No presentation quality comments provided."}</p>
          </div>

          <div className={styles.section}>
            <h3>Additional Comments</h3>
            <h4>Comments to Authors</h4>
            <p className={styles.wrappedText}>{review.commentsToAuthor || "No additional comments for authors."}</p>

            <h4>Confidential Comments to Editor</h4>
            <p className={styles.wrappedText}>{review.confidentialComments || "No confidential comments for editor."}</p>
          </div>

          {(attachments.length > 0 || isLoadingAttachments) && (
            <div className={styles.section}>
              <h3>Attachments</h3>
              {isLoadingAttachments ? (
                <p>Loading attachments...</p>
              ) : (
                <ul className={styles.attachmentsList}>
                  {attachments.map((file, index) => (
                    <li key={index}>
                      <button 
                        onClick={() => handleDownload(file.url, file.name)}
                        className={styles.downloadButton}
                      >
                      {file.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
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
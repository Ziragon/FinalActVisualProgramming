import React, {useState, useCallback, useEffect, useRef} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import PortalModal from '../myArticlesPage/PortalModal.jsx';
import styles from '../../styles/ContinueReviewModal.module.css';
import starIcon from "../../styles/img/star.svg";
import loadIcon from "../../styles/img/drop-file.svg";

const ContinueReviewModal = ({ article, onClose, onReviewUpdated }) => {
  const { token, userId } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [apiError, setApiError] = useState(null);
  const [initialValues, setInitialValues] = useState({
    overallRating: 0,
    recommendation: '',
    technicalComments: '',
    originalityComments: '',
    presentationComments: '',
    authorComments: '',
    editorComments: '',
    attachment: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (!token || !userId) return;

    const fetchReviewData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/reviews/${article.reviewId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        const reviewData = response.data;
        setInitialValues({
          overallRating: reviewData.rating || 0,
          recommendation: reviewData.decision || '',
          technicalComments: reviewData.technicalMerit || '',
          originalityComments: reviewData.originality || '',
          presentationComments: reviewData.presentationQuality || '',
          authorComments: reviewData.commentsToAuthor || '',
          editorComments: reviewData.confidentialComments || '',
          attachment: null
        });
        setSelectedRating(reviewData.rating || 0);
      } catch (error) {
        console.error('Error fetching review data:', error);
        setApiError(error.response?.data?.message || 'Failed to load review data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewData();
  }, [article.reviewId, token, userId]);

  const validate = (values) => {
    const errors = {};
    
    if (!values.overallRating) {
      errors.overallRating = 'Overall rating is required';
    }
    
    if (!values.recommendation) {
      errors.recommendation = 'Recommendation is required';
    }
    
    if (!values.technicalComments) {
      errors.technicalComments = 'Technical comments are required';
    } else if (values.technicalComments.length < 50) {
      errors.technicalComments = 'Technical comments must be at least 50 characters';
    }
    
    if (!values.originalityComments) {
      errors.originalityComments = 'Originality comments are required';
    } else if (values.originalityComments.length < 30) {
      errors.originalityComments = 'Originality comments must be at least 30 characters';
    }
    
    if (!values.presentationComments) {
      errors.presentationComments = 'Presentation comments are required';
    } else if (values.presentationComments.length < 30) {
      errors.presentationComments = 'Presentation comments must be at least 30 characters';
    }
    
    return errors;
  };

  const handleSaveDraft = async (values) => {
    try {
      let attachmentId = null;
      
      // Загрузка файла, если он есть
      if (values.attachment) {
        const formDataFile = new FormData();
        formDataFile.append('file', values.attachment);

        const fileResponse = await axios.post(
          `http://localhost:5000/api/files/upload`,
          formDataFile,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        attachmentId = fileResponse.data.id;
      }

      const response = await axios.put(
        `http://localhost:5000/api/reviews/${article.reviewId}`,
        {
          reviewerId: userId,
          rating: values.overallRating,
          decision: values.recommendation,
          technicalMerit: values.technicalComments,
          originality: values.originalityComments,
          presentationQuality: values.presentationComments,
          commentsToAuthor: values.authorComments,
          confidentialComments: values.editorComments,
          attachmentsId: attachmentId // Сохраняем ID файла
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (onReviewUpdated) {
        onReviewUpdated({ ...response.data, shouldRefresh: true });
      }
      
      return response.data;
    } catch (error) {
      setApiError(error.response?.data?.message || 'Error saving draft');
      throw error;
    }
  };

  const handleSubmitReview = async (values) => {
    try {
      let attachmentId = null;
      
      // Загрузка файла, если он есть
      if (values.attachment) {
        const formDataFile = new FormData();
        formDataFile.append('file', values.attachment);

        const fileResponse = await axios.post(
          `http://localhost:5000/api/files/upload`,
          formDataFile,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        attachmentId = fileResponse.data.id;
      }

      const updateResponse = await axios.put(
        `http://localhost:5000/api/reviews/${article.reviewId}`,
        {
          reviewerId: userId,
          rating: values.overallRating,
          decision: values.recommendation,
          technicalMerit: values.technicalComments,
          originality: values.originalityComments,
          presentationQuality: values.presentationComments,
          commentsToAuthor: values.authorComments,
          confidentialComments: values.editorComments,
          attachmentsId: attachmentId // Сохраняем ID файла
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      await axios.post(
        `http://localhost:5000/api/reviews/${article.reviewId}/complete`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (onReviewUpdated) {
        onReviewUpdated({ ...updateResponse.data, isCompleted: true, shouldRefresh: true });
      }
    } catch (error) {
      setApiError(error.response?.data?.message || 'Error submitting review');
      throw error;
    }
  };

  const handleFileChange = (e, setFieldValue) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFieldValue('attachment', file);
    }
  };

  return (
    <PortalModal>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button 
            onClick={onClose} 
            className={styles.closeButton}
          >
            X
          </button>
          {apiError && <div className={styles.apiError}>{apiError}</div>}
          
          <Formik
            initialValues={initialValues}
            enableReinitialize={true} 
            validate={validate}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await handleSubmitReview(values);
                onClose();
              } catch (error) {
                console.error('Submission error:', error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form>
                <h3>{article.name}</h3>

                <div className={styles.section}>
                  <h3>Review Summary</h3>
                  <div className={styles.ratingSection}>
                    <p>Overall Rating</p>
                    <div className={styles.ratingStars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={styles.starContainer}
                          onClick={() => {
                            setSelectedRating(star);
                            setFieldValue('overallRating', star);
                          }}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          <img
                            src={starIcon}
                            alt="Star"
                            className={`
                              ${styles.starIcon}
                              ${star <= (hoverRating || selectedRating) ? styles.filled : ''}
                            `}
                          />
                        </div>
                      ))}
                    </div>
                    <Field type="hidden" name="overallRating" />
                    <ErrorMessage name="overallRating" component="div" className={styles.error} />
                  </div>
                </div>

                <div className={styles.section}>
                  <h3>Recommendation</h3>
                  <Field 
                    as="select" 
                    name="recommendation" 
                    className={styles.recommendationSelect}
                  >
                    <option value="">Select recommendation</option>
                    <option value="Accept as is">Accept as is</option>
                    <option value="Accept with minor revisions">Accept with minor revisions</option>
                    <option value="Major revisions required">Major revisions required</option>
                    <option value="Reject">Reject</option>
                  </Field>
                  <ErrorMessage name="recommendation" component="div" className={styles.error} />
                </div>

                <div className={styles.section}>
                  <h3>Detailed Review</h3>
                  <h4>Technical Merit (Minimum 50 characters)</h4>
                  <Field
                    as="textarea"
                    name="technicalComments"
                    placeholder="Evaluate the technical quality of the research..."
                    className={styles.textarea}
                  />
                  <ErrorMessage name="technicalComments" component="div" className={styles.error} />
                  <div className={styles.charCount}>
                    {values.technicalComments.length}/50 characters
                  </div>

                  <h4>Originality (Minimum 30 characters)</h4>
                  <Field
                    as="textarea"
                    name="originalityComments"
                    placeholder="Assess the honesty and originality of the work..."
                    className={styles.textarea}
                  />
                  <ErrorMessage name="originalityComments" component="div" className={styles.error} />
                  <div className={styles.charCount}>
                    {values.originalityComments.length}/30 characters
                  </div>

                  <h4>Presentation Quality (Minimum 30 characters)</h4>
                  <Field
                    as="textarea"
                    name="presentationComments"
                    placeholder="Comment on the clarity and organization..."
                    className={styles.textarea}
                  />
                  <ErrorMessage name="presentationComments" component="div" className={styles.error} />
                  <div className={styles.charCount}>
                    {values.presentationComments.length}/30 characters
                  </div>
                </div>

                <div className={styles.section}>
                  <h3>Additional Comments</h3>
                  <h4>Comments to Authors</h4>
                  <Field
                    as="textarea"
                    name="authorComments"
                    placeholder="Provide constructive feedback..."
                    className={styles.textarea}
                  />

                  <h4>Confidential Comments to Editor</h4>
                  <Field
                    as="textarea"
                    name="editorComments"
                    placeholder="Private comments for the editor..."
                    className={styles.textarea}
                  />
                </div>

                <div className={styles.section}>
                  <h3>Attachment</h3>
                  <div className={styles.fileUpload}>
                    <label htmlFor="attachment" className={styles.uploadLabel}>
                      {values.attachment ? (
                        <span>{values.attachment.name}</span>
                      ) : (
                        <>
                          <>
                            <img src={loadIcon} alt="Loading" className={styles.icon}/>
                          </>
                          <span>Click to select a file</span>
                        </>
                      )}
                    </label>
                    <input
                      type="file"
                      id="attachment"
                      ref={fileInputRef}
                      className={styles.fileInput}
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                    />
                    <button 
                      type="button" 
                      className="black_button"
                      onClick={handleButtonClick}
                    >
                      Select File
                    </button>
                  </div>
                </div>

                <div className={styles.buttonGroup}>
                  <button 
                    type="button" 
                    onClick={async () => {
                      try {
                        await handleSaveDraft(values);
                        onClose();
                      } catch (error) {
                        console.error('Error saving draft:', error);
                      }
                    }} 
                    className="black_button"
                  >
                    Save Draft
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="black_button"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>

                <div className={styles.footer}>
                  <p>© {new Date().getFullYear()} Review System. All rights reserved.</p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </PortalModal>
  );
};

export default ContinueReviewModal;
import React, {useState, useCallback} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import PortalModal from '../myArticlesPage/PortalModal.jsx';
import styles from '../../styles/ContinueReviewModal.module.css';
import starIcon from "../../styles/img/star.svg";

const ContinueReviewModal = ({ article, onClose, onSaveDraft, onSubmitReview }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedRating, setSelectedRating] = useState(article.overallRating || 0);
  const [hoverRating, setHoverRating] = useState(0);

  const initialValues = {
    overallRating: article.overallRating || 0,
    recommendation: article.recommendation || '',
    technicalComments: article.technicalComments || '',
    originalityComments: article.originalityComments || '',
    presentationComments: article.presentationComments || '',
    authorComments: article.authorComments || '',
    editorComments: article.editorComments || '',
    attachments: article.attachments || []
  };

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


  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e, setFieldValue, attachments) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFieldValue('attachments', [...attachments, ...newFiles]);
    }
  }, []);

  return (
    <PortalModal>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={(values, { setSubmitting }) => {
              onSubmitReview(values);
              setSubmitting(false);
              onClose();
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
                  <h3>Attachments</h3>
                  <div 
                    className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => handleDrop(e, setFieldValue, values.attachments)}
                    onClick={() => document.getElementById('fileInput').click()}
                  >
                    <p>Drag and drop files here or click to upload</p>
                    <input
                      id="fileInput"
                      type="file"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setFieldValue('attachments', [...values.attachments, ...files]);
                      }}
                      multiple
                      className={styles.fileInput}
                    />
                  </div>
                  {values.attachments.length > 0 && (
                    <ul className={styles.attachmentsList}>
                      {values.attachments.map((file, index) => (
                        <li key={index}>
                          {file.name || file}
                          <button 
                            type="button"
                            onClick={() => {
                              const newAttachments = [...values.attachments];
                              newAttachments.splice(index, 1);
                              setFieldValue('attachments', newAttachments);
                            }}
                            className={styles.removeAttachment}
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

               <div className={styles.buttonGroup}>
                  <button 
                    type="button" 
                    onClick={() => {
                      onSaveDraft(values); // надо реализовать сэйв
                      onClose();
                    }} 
                    className="black_button"
                  >
                    Save Draft
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    // также доделать функцию отправки
                    className="black_button"
                    
                  >
                    Submit Review
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
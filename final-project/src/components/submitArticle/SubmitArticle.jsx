import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/SubmitArticle.module.css';
import loadIcon from "../../styles/img/drop-file.svg";

const localhost = "http://localhost:5000";

const SubmitArticle = () => {
    const { isAuthenticated, userId, token } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        content: '',
        tags: '',
        isOriginal: false
    });
    const [featuredImage, setFeaturedImage] = useState(null);
    const [submissionType, setSubmissionType] = useState('text');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFeaturedImage(e.target.files[0]);
            if (submissionType !== 'file') {
                setSubmissionType('file');
                setFormData(prev => ({ ...prev, content: '' }));
            }
        }
    };

    const handleSubmissionTypeChange = (type) => {
        setSubmissionType(type);
        if (type === 'text') {
            setFeaturedImage(null);
        } else {
            setFormData(prev => ({ ...prev, content: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.isOriginal) {
            setError("Please confirm that this is your original work.");
            return;
        }

        if (!formData.title || !formData.category) {
            setError("The name and category are required");
            return;
        }

        setIsSubmitting(true);

        try {
            let bodyFileId = null;
            if (submissionType === 'file' && featuredImage) {
                const formDataFile = new FormData();
                formDataFile.append('file', featuredImage);

                const fileResponse = await axios.post(
                    `${localhost}/api/files/upload`,
                    formDataFile,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                bodyFileId = fileResponse.data.id;
            }

            const articleResponse = await axios.post(`${localhost}/api/articles`, {
                authorId: Number(userId),
                name: formData.title,
                category: formData.category,
                body: submissionType === 'text' ? formData.content : "",
                body_id: bodyFileId,
                tags: formData.tags || "",
                status: "draft"
            }, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (formData.isOriginal) {
                await axios.post(
                    `${localhost}/api/articles/${articleResponse.data.id}/submit`,
                    {},
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
            }
            setFormData({
                title: '',
                category: '',
                content: '',
                tags: '',
                isOriginal: false
            });
            setFeaturedImage(null);
            alert('The article has been successfully submitted!');

        } catch (err) {
            console.error('Ошибка:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });
            
            setError(err.response?.data?.message || 'Error when sending the article');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className={styles.SubmitPage}>
            <div className={styles.personalInfoSection}>
                <h1 className={styles.sectionTitle}>Submit an article</h1>
                <p className={styles.sectionDescription}>Fill in the details below to submit the article</p>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.articleForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title" className={styles.formLabel}>Article title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Enter the title of the article"
                            className={styles.formInput}
                            value={formData.article}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="category" className={styles.formLabel}>Category</label>
                        <select
                            id="category"
                            name="category"
                            className={styles.formSelect}
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a category</option>
                            <option value="technology">Technologies</option>
                            <option value="science">The science</option>
                            <option value="health">Health</option>
                            <option value="business">Business</option>
                            <option value="entertainment">Entertainments</option>
                        </select>
                    </div>

                    <div className={styles.submissionTypeSelector}>
                        <button
                            type="button"
                            className={`black_button ${submissionType === 'text' ? styles.active : ''}`}
                            onClick={() => handleSubmissionTypeChange('text')}
                        >
                            Write an article
                        </button>
                        <button
                            type="button"
                            className={`black_button ${submissionType === 'text' ? styles.active : ''}`}
                            onClick={() => handleSubmissionTypeChange('file')}
                            style={{ marginLeft: '8px' }}
                        >
                            Upload a file
                        </button>
                    </div>

                    {submissionType === 'text' ? (
                        <div className={styles.formGroup}>
                            <label htmlFor="content" className={styles.formLabel}>The content of the article</label>
                            <textarea
                                id="content"
                                name="content"
                                placeholder="Write the content of the article here..."
                                className={styles.formTextarea}
                                value={formData.content}
                                onChange={handleChange}
                                required={submissionType === 'text'}
                                disabled={submissionType !== 'text'}
                            />
                        </div>
                    ) : (
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Upload a file</label>
                            <div className={styles.fileUpload}>
                                <label htmlFor="featuredImage" className={styles.uploadLabel}>
                                    {featuredImage ? (
                                        <span>{featuredImage.name}</span>
                                    ) : (
                                        <>
                                            <img src={loadIcon} alt="Loading" className={styles.icon}/>
                                            <span>Upload the file in Docx or Pdf format</span>
                                            <button
                                                type="button"
                                                className="black_button"
                                                onClick={handleButtonClick}>
                                                Select a file
                                            </button>
                                        </>
                                    )}
                                </label>
                                <input
                                    type="file"
                                    id="featuredImage"
                                    accept=".doc,.docx,.pdf"
                                    className={styles.fileInput}
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                />
                            </div>
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="tags" className={styles.formLabel}>Tags</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            placeholder="Enter the tags separated by commas"
                            className={styles.formInput}
                            value={formData.tags}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="isOriginal"
                                className={styles.checkboxInput}
                                checked={formData.isOriginal}
                                onChange={handleChange}
                                required
                            />
                            <span>I confirm that this is my original work and I agree with the rules of publication.</span>
                        </label>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="submit"
                            className="black_button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Shipment...' : 'Submit for moderation'}
                        </button>
                        <button type="button" className="white_button">Save the draft</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitArticle;
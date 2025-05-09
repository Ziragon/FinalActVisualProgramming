import styles from '../../styles/SubmitArticle.module.css';
import cl from "../../styles/ReviewProgressPage.module.css";
import loadIcon from "../../styles/img/drop-file.svg";
import { useState, useRef } from 'react';
const SubmitArticle = () => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        content: '',
        tags: '',
        isOriginal: false
    });
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click(); // Программно кликаем на input
    };

    const [featuredImage, setFeaturedImage] = useState(null)

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
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // ЛОГИКА ОТПРАВКИ ФОРМЫ
        console.log({ ...formData, featuredImage });
    };

    return (
        <div className={styles.SubmitPage}>
            <div className={styles.personalInfoSection}>
                <h1 className={styles.sectionTitle}>Submit Article for Review</h1>
                <p className={styles.sectionDescription}>Please fill in the details below to submit your article for review.</p>

                <form onSubmit={handleSubmit} className={styles.articleForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title" className={styles.formLabel}>Article Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Enter article title"
                            className={styles.formInput}
                            value={formData.title}
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
                            <option value="technology">Technology</option>
                            <option value="science">Science</option>
                            <option value="health">Health</option>
                            <option value="business">Business</option>
                            <option value="entertainment">Entertainment</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="content" className={styles.formLabel}>Article Content</label>
                        <textarea
                            id="content"
                            name="content"
                            placeholder="Write your article content here..."
                            className={styles.formTextarea}
                            value={formData.content}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Featured Image</label>
                        <div className={styles.fileUpload}>
                            <label htmlFor="featuredImage" className={styles.uploadLabel}>
                                {featuredImage ? (
                                    <span>{featuredImage.name}</span>
                                ) : (
                                    <>
                                        <img src={loadIcon} alt="Loading" className={styles.icon}/>
                                        <span>Drag and drop your image here or</span>
                                        <button
                                            type="button"
                                            className={cl.black_button}
                                            onClick={handleButtonClick}>
                                            Browse Files
                                        </button>
                                    </>
                                )}
                            </label>
                            <input
                                type="file"
                                id="featuredImage"
                                accept="image/*"
                                className={styles.fileInput}
                                onChange={handleImageChange}
                                ref={fileInputRef}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="tags" className={styles.formLabel}>Tags</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            placeholder="Enter tags separated by commas"
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
                            <span>I confirm that this article is my original work and I have read and agree to the submission guidelines</span>
                        </label>
                    </div>

                    <div className={styles.formActions}>
                        <button type="submit" className={cl.black_button}>Submit for Review</button>
                        <button type="button" className={cl.white_button}>Save Draft</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitArticle;
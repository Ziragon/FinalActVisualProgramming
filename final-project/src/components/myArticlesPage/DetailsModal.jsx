import React from 'react';
import styles from '../../styles/DetailsModal.module.css';

const DetailsModal = ({ article, onClose }) => {
    if (!article) return null;

return (
<div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{article.title}</h2>
                
        <div className={styles.field}>
            <strong>Category:</strong>
            <span className={styles.tag}>{article.category || article.tag || "Uncategorized"}</span>
        </div>

        <div className={styles.field}>
            <strong>Tags:</strong>
            {article.tags?.length > 0 ? 
            (article.tags.map((tag, index) => (<span key={index} className={styles.tag}>{tag}</span>))) : 
            (<span>No tags available</span>)}
        </div>

        <div className={styles.field}>
            <strong>Article Content:</strong>
            <p>{article.content || "No content available."}</p>
        </div>

        {article.featuredImage && typeof article.featuredImage === 'string' && article.featuredImage.trim() !== '' ? 
        (<div className={styles.field}>
            <strong>Featured Image:</strong>
            <img src={article.featuredImage} alt="Featured" className={styles.featuredImage} />
        </div>) : 
        (<div className={styles.field}>
            <strong>Featured Image:</strong>
            <span>No images</span>
        </div>)
        }

        <div className={styles.footerButtons}>
            <button className="black_button" onClick={onClose}>
                Close
            </button>
        </div>
    </div>
</div>
);
};

export default DetailsModal;
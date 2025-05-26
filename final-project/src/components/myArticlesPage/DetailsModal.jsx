import React from 'react';
import styles from '../../styles/DetailsModal.module.css';
import PortalModal from './PortalModal.jsx';

const DetailsModal = ({ article, onClose }) => {
    if (!article) return null;

    console.log(article)

    const tagsArray = !article.tags ? [] :
        Array.isArray(article.tags) ? article.tags :
        typeof article.tags === 'string' ? article.tags.split(',').map(tag => tag.trim()) :
        [String(article.tags)];

    return (
        <PortalModal>
            <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                    <h2 className={styles.modalTitle}>{article.name}</h2>
                    
                    <div className={styles.field}>
                        <strong>Category: </strong>
                        <span className={styles.tag}>{article.category || article.tag || "Uncategorized"}</span>
                    </div>

                    <div className={styles.field}>
                        <strong>Tags: </strong>
                        {tagsArray.length > 0 ? 
                            (tagsArray.map((tag, index) => (
                                <span key={index} className={styles.tag}>{tag}</span>
                            ))) : 
                            (<span>No tags available</span>)}
                    </div>

                    <div className={styles.field}>
                        <strong>Article Content:</strong>
                        <p>{article.body || "No content available."}</p>
                    </div>

                    <div className={styles.footerButtons}>
                        <button className="black_button" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </PortalModal>
    );
};

export default DetailsModal;
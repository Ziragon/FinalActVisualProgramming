import React, {useState} from 'react';
import defcl from "../../styles/ReviewDefaultClasses.module.css";
import ContinueReviewModal from './ContinueReviewModal';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const localhost = "http://localhost:5000";

const InProgressBlock = ({ item, onReviewUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { token, userId } = useAuth();

    const handleSaveDraft = async (formData) => {
        try {
            const response = await axios.put(
                `${localhost}/api/reviews/${item.reviewId}`,
                {
                    rating: formData.overallRating,
                    decision: formData.recommendation,
                    technicalMerit: formData.technicalComments,
                    originality: formData.originalityComments,
                    presentationQuality: formData.presentationComments,
                    commentsToAuthor: formData.authorComments,
                    confidentialComments: formData.editorComments,
                    progress: formData.progress
                },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            onReviewUpdate(response.data);
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error saving draft:', err);
        }
    };

    const handleSubmitReview = async (formData) => {
        try {
            // First update the review
            await axios.put(
                `${localhost}/api/reviews/${item.reviewId}`,
                {
                    rating: formData.overallRating,
                    decision: formData.recommendation,
                    technicalMerit: formData.technicalComments,
                    originality: formData.originalityComments,
                    presentationQuality: formData.presentationComments,
                    commentsToAuthor: formData.authorComments,
                    confidentialComments: formData.editorComments,
                    progress: 100
                },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            // Then mark as complete
            const response = await axios.post(
                `${localhost}/api/reviews/${item.reviewId}/complete`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            onReviewUpdate(response.data);
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error submitting review:', err);
        }
    };

    return (
        <div> 
            <div className={defcl.req_block}>
                <div className={defcl.right_float_block}>
                    <p className={defcl.p_date}>Due: {item.requestDate.toDateString().slice(4)}</p>
                </div>
                <p className={defcl.p_name}>{item.name}</p>
                <p className={defcl.p_author}>Author: {item.author}</p>
                <div className={defcl.progress_bar_container}>
                    <div 
                        className={defcl.progress_bar_fill}
                        style={{ width: `${item.progress}%` }}
                    ></div>
                </div>
                <div className={defcl.flex_block_inprog}>
                    <p className={defcl.p_progress}>Progress: {item.progress}%</p>
                    <div className={defcl.buttons}>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className='black_button'
                        >
                            Continue Review
                        </button>
                    </div>
                </div>
            </div>
            
            {isModalOpen && (
                <ContinueReviewModal
                    article={item}
                    onClose={() => setIsModalOpen(false)}
                    onSaveDraft={handleSaveDraft}
                    onSubmitReview={handleSubmitReview}
                />
            )}
        </div>
    );
};

export default InProgressBlock;
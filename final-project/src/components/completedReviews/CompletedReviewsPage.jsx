import React, {useState, useEffect} from 'react';
import defcl from "../../styles/ReviewDefaultClasses.module.css";
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import CompletedReviewsBlock from './CompletedReviewsBlock';

const localhost = "http://localhost:5000";

const CompletedReviewsPage = () => {
    const { isAuthenticated, userId, token } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get(`${localhost}/api/reviews/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const responseProfile = await axios.get(`${localhost}/api/reviews/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const formattedReviews = response.data.map(review => ({
                    id: review.id,
                    title: review.name,
                    rating: review.rating,
                    decision: review.decision,
                    technicalMerit: review.technicalMerit,
                    originality: review.originality,
                    presentationQuality: review.presentationQuality,
                    commentsToAuthor: review.commentsToAuthor,
                    confidentialComments: review.confidentialComments,
                    attachmentsId: review.attachmentsId,
                    progress: review.progress,
                    isCompleted: review.progress,
                    completeDate: formatDate(review.completeDate)
                }));
                
                setReviews(formattedReviews);
                setIsLoading(false);
            } catch (err) {
                console.error('Ошибка при загрузке статей:', err);
                setError('Не удалось загрузить статьи');
                setIsLoading(false);
            }
        };

        if (isAuthenticated && userId) {
            fetchArticles();
        }
    }, [isAuthenticated, userId, token]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"; // Если дата не передана
        
        const date = new Date(dateString);
        
        // Проверяем, что дата валидна
        if (isNaN(date.getTime())) return "N/A";
        
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    };

    if (isLoading) {
        return <div className={defcl.container}>Loading...</div>;
    }

    if (error) {
        return <div className={defcl.container}>{error}</div>;
    }

    return (
        <div className={defcl.main_container}>
        {reviews
        .filter(item => item.isCompleted)
        .map((item) =>
            <div className={defcl.container}>
                <CompletedReviewsBlock
                    className={defcl.req_block}
                    item={item}
                />
            </div>
        )}
        </div>
    )
}

export default CompletedReviewsPage
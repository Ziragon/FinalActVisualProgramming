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
    const [reviewerNames, setReviewerNames] = useState({});
    const [articleNames, setArticleNames] = useState({});

    const fetchAuthorName = async (userId) => {
        try {
            if (!userId) return 'Unnamed User';

            if (reviewerNames[userId]) {
                return reviewerNames[userId];
            }

            const response = await axios.get(`${localhost}/api/profiles/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const name = response.data.fullName || `Unnamed User id: ${userId}`;

            setReviewerNames(prev => ({ ...prev, [userId]: name }));
            
            return name;
        } catch (err) {
            console.error(`Error fetching author name for user ${userId}:`, err);
            return `Unnamed User id: ${userId}`;
        }
    };

    const fetchArticleName = async (id) => {
        try {
            if (!userId) return 'Unnamed User';

            if (articleNames[id]) {
                return articleNames[id];
            }

            const response = await axios.get(`${localhost}/api/articles/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const name = response.data.name;

            setArticleNames(prev => ({ ...prev, [name]: name }));
            
            return name;
        } catch (err) {
            console.error(`Error fetching author name for user ${userId}:`, err);
        }
    }

    const enrichReviewsWithReviewerNames = async (reviews) => {
        return Promise.all(reviews.map(async review => {
            const authorName = await fetchAuthorName(review.userId);
            const articleName = await fetchArticleName(review.id);
            return {
                ...review,
                author: authorName,
                name: articleName
            };
        }));
    };

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get(`${localhost}/api/reviews/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const formattedReviews = response.data.map(review => ({
                    id: review.id,
                    userId: review.userId,
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
                    isCompleted: review.isCompleted,
                    completeDate: new Date(review.completeDate)
                }));
                
                setReviews(await enrichReviewsWithReviewerNames(formattedReviews));
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

    if (isLoading) {
        return <div className={defcl.container}>Loading...</div>;
    }

    if (error) {
        return <div className={defcl.container}>{error}</div>;
    }

    const completedReviews = reviews.filter(item => item.isCompleted);
    
    if (completedReviews.length === 0) {
        return (
            <div className={defcl.noReviewsContainer}>
                <p className={defcl.noReviewsText}>Завершённых рецензий пока что нет...</p>
            </div>
        );
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
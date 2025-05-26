import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import ReviewRequestsBlock from './ReviewRequestsBlock';
import InProgressBlock from './InProgressBlock';
import defcl from "../../styles/ReviewDefaultClasses.module.css";

const localhost = "http://localhost:5000";

const ReviewProgressPage = () => {
    const { token, userId } = useAuth();
    const [articlesForReview, setArticlesForReview] = useState([]);
    const [articlesInProgress, setArticlesInProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                // 1. Fetch articles under review (for New Review Requests)
                const underReviewResponse = await axios.get(
                    `${localhost}/api/articles/status/under_review`,
                    { headers }
                );

                // 2. Fetch draft articles (for In Progress Reviews)
                const draftResponse = await axios.get(
                    `${localhost}/api/articles/status/draft`,
                    { headers }
                );

                // 3. Fetch user's reviews to track progress
                const reviewsResponse = await axios.get(
                    `${localhost}/api/reviews/user/${userId}`,
                    { headers }
                );

                // Set articles for review
                setArticlesForReview(underReviewResponse.data.map(article => ({
                    ...article,
                    requestDate: new Date(article.requestDate)
                })));

                // Combine draft articles with their review progress
                const inProgressArticles = draftResponse.data.map(article => {
                    const review = reviewsResponse.data.find(r => r.articleId === article.id);
                    return {
                        ...article,
                        requestDate: new Date(article.requestDate),
                        progress: review?.progress || 0,
                        reviewId: review?.id
                    };
                });

                setArticlesInProgress(inProgressArticles);
                
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.response?.data?.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchData();
        }
    }, [token, userId]);

    const handleAcceptReview = async (articleId) => {
        try {
            // 1. Update article status to draft
            await axios.put(
                `${localhost}/api/articles/${articleId}/status`,
                { status: 'draft' },
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // 2. Create the review
            const response = await axios.post(
                `${localhost}/api/reviews`,
                { 
                    articleId,
                    reviewerId: userId,
                    progress: 0
                },
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // 3. Find the accepted article
            const acceptedArticle = articlesForReview.find(a => a.id === articleId);
            
            if (!acceptedArticle) {
                throw new Error('Article not found');
            }

            // 4. Update state
            setArticlesForReview(prev => prev.filter(a => a.id !== articleId));
            setArticlesInProgress(prev => [...prev, {
                ...acceptedArticle,
                status: 'draft',
                progress: 0,
                reviewId: response.data.id
            }]);
            
        } catch (err) {
            console.error('Error accepting review:', err);
            setError(err.response?.data?.message || 'Failed to accept review');
        }
    };

    const handleDeclineReview = async (articleId) => {
        setArticlesForReview(prev => prev.filter(article => article.id !== articleId));
    };

    const handleReviewUpdate = (updatedReview) => {
        setArticlesInProgress(prev => 
            prev.map(article => 
                article.reviewId === updatedReview.id 
                    ? { ...article, progress: updatedReview.progress } 
                    : article
            )
        );
        
        if (updatedReview.isCompleted) {
            setArticlesInProgress(prev => 
                prev.filter(article => article.reviewId !== updatedReview.id)
            );
        }
    };

    if (loading) return <div className={defcl.main_container}>Loading...</div>;
    if (error) return <div className={defcl.main_container}>Error: {error}</div>;

    return (
        <div className={defcl.main_container}>
            <div className={defcl.container}>
                <p className={defcl.p_header}>New Review Requests</p>
                {articlesForReview.length > 0 ? (
                    articlesForReview.map((article) => (
                        <ReviewRequestsBlock
                            key={article.id}
                            item={article}
                            onAccept={() => handleAcceptReview(article.id)}
                            onDecline={() => handleDeclineReview(article.id)}
                        />
                    ))
                ) : (
                    <p>No new review requests</p>
                )}
            </div>
            <div className={defcl.container}>
                <p className={defcl.p_header}>In Progress Reviews</p>
                {articlesInProgress.length > 0 ? (
                    articlesInProgress.map((article) => (
                        <InProgressBlock
                            key={article.reviewId || article.id}
                            item={article}
                            onReviewUpdate={handleReviewUpdate}
                        />
                    ))
                ) : (
                    <p>No in-progress reviews</p>
                )}
            </div>
        </div>
    );
};

export default ReviewProgressPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import DetailsModal from '../myArticlesPage/DetailsModal';
import ReviewRequestsBlock from './ReviewRequestsBlock';
import InProgressBlock from './InProgressBlock';
import defcl from "../../styles/ReviewDefaultClasses.module.css";

const localhost = "http://localhost:5000";
const profilesApi = "http://localhost:5000/api/profiles";

const ReviewProgressPage = () => {
    const { token, userId } = useAuth();
    const [articlesForReview, setArticlesForReview] = useState([]);
    const [articlesInProgress, setArticlesInProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [authorNames, setAuthorNames] = useState({});
    const [selectedArticle, setSelectedArticle] = useState(null);

    const parseTags = (tags) => {
        if (!tags) return [];
        if (Array.isArray(tags)) return tags;
        
        try {
          const parsed = JSON.parse(tags);
          return Array.isArray(parsed) ? parsed : [tags];
        } catch (e) {
          return typeof tags === 'string' 
            ? tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            : [String(tags)];
        }
      };

    const fetchAuthorName = async (userId) => {
        try {
            if (!userId) return 'Unnamed User';

            if (authorNames[userId]) {
                return authorNames[userId];
            }

            const response = await axios.get(`${profilesApi}/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const name = response.data.fullName || `Unnamed User id: ${userId}`;

            setAuthorNames(prev => ({ ...prev, [userId]: name }));
            
            return name;
        } catch (err) {
            console.error(`Error fetching author name for user ${userId}:`, err);
            return `Unnamed User id: ${userId}`;
        }
    };

    const enrichArticlesWithAuthorNames = async (articles) => {
        return Promise.all(articles.map(async article => {
            const authorName = await fetchAuthorName(article.userId);
            return {
                ...article,
                author: authorName
            };
        }));
    };

    const fetchArticlesInProgress = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
    
            const [draftResponse, reviewsResponse] = await Promise.all([
                axios.get(`${localhost}/api/articles/status/under_review`, { headers }),
                axios.get(`${localhost}/api/reviews/user/${userId}`, { headers })
            ]);
    
            const articles = draftResponse.data.map(article => {
                const review = reviewsResponse.data.find(r => r.articleId === article.id);
                return {
                    ...article,
                    requestDate: new Date(article.requestDate),
                    progress: review?.progress || 0,
                    reviewId: review?.id,
                    userId: article.userId,
                    tags: parseTags(article.tags)
                };
            });
    
            return await enrichArticlesWithAuthorNames(articles);
        } catch (err) {
            console.error('Error fetching in-progress articles:', err);
            throw err;
        }
    };
    

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

                const [underReviewResponse, inProgressArticles] = await Promise.all([
                    axios.get(`${localhost}/api/articles/status/await_review`, { headers }),
                    fetchArticlesInProgress()
                ]);

                const forReviewWithAuthors = await enrichArticlesWithAuthorNames(
                    underReviewResponse.data.map(article => ({
                        ...article,
                        requestDate: new Date(article.requestDate),
                        userId: article.userId,
                        tags: parseTags(article.tags)
                    }))
                );

                setArticlesForReview(forReviewWithAuthors);
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
    }, [token, userId, refreshTrigger]);

    const handleAcceptReview = async (articleId) => {
        try {
            const response = await axios.post(
                `${localhost}/api/reviews`,
                { articleId },
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const acceptedArticle = articlesForReview.find(a => a.id === articleId);
            
            if (!acceptedArticle) {
                throw new Error('Article not found');
            }

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

    const handleReviewUpdate = async (updatedReview) => {
      if (updatedReview.shouldRefresh) {
        setRefreshTrigger(prev => prev + 1);
      } else if (updatedReview.isCompleted) {
        const updatedArticles = await fetchArticlesInProgress();
        setArticlesInProgress(updatedArticles);
      } else {
        setArticlesInProgress(prev => 
          prev.map(article => 
            article.reviewId === updatedReview.id 
              ? { ...article, progress: updatedReview.progress } 
              : article
          )
        );
      }
    };

    const handleDownloadFile = async (fileId, articleId) => {
        try {
            const response = await axios.get(`${localhost}/api/files/download/${fileId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob'
            });

            const contentType = response.headers['content-type'];

            console.log(contentType)

            const filename = `article${articleId}`;

            const blob = new Blob([response.data], { type: contentType });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            link.remove();
    
        } catch (error) {
            console.error('Error downloading file:', error);
    
            let errorMessage = 'An unknown error occurred';
            if (error.response) {
                errorMessage = `Server responded with status code ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'No response received from server';
            }
    
            alert(`Error downloading file: ${errorMessage}`);
        }
    };

    const handleViewArticle = (article) => {
        setSelectedArticle(article);
    };

    const handleCloseModal = () => {
        setSelectedArticle(null);
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
                            onDownload={() => handleDownloadFile(article.bodyFileId, article.id)}
                            onViewArticle={() => handleViewArticle(article)}
                        />
                    ))
                ) : (
                    <p className={defcl.no_item_message}>Выложенных Статей на оценку пока что нет</p>
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
                            onViewArticle={() => handleViewArticle(article)}
                            onDownload={() => handleDownloadFile(article.bodyFileId, article.id)}
                        />
                    ))
                ) : (
                    <p className={defcl.no_item_message}>Ваши рецензии отсутствуют</p>
                )}
            </div>
            {selectedArticle && (
                <DetailsModal 
                    article={selectedArticle} 
                    onClose={handleCloseModal} 
                />
            )}
        </div>
    );
};

export default ReviewProgressPage;
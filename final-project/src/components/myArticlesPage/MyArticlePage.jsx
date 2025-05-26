import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import DetailsModal from './DetailsModal';
import styles from '../../styles/myArticlesPage.module.css';
import calendarImg from '../../styles/img/calendar-lines-alt-svgrepo-com.svg';
import tagImg from '../../styles/img/tag-fill-round-1176-svgrepo-com.svg';

const localhost = "http://localhost:5000";

const ArticlesPage = () => {
    const { isAuthenticated, userId, token } = useAuth();
    const [activeTag, setActiveTag] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArticleId, setSelectedArticleId] = useState(null);
    const [articles, setArticles] = useState([]);
    const [articleDetails, setArticleDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const articlesPerPage = 5;

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get(`${localhost}/api/articles/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('Raw API response:', response.data); 
                const formattedArticles = response.data.map(article => ({
                  id: article.id,
                  name: article.name,
                  status: getStatusText(article.status),
                  submitted: new Date(article.requestDate),
                  tag: article.category,
                  body: article.body,
                  tags: article.tags ? article.tags.split(',') : []
                }));
                
                setArticles(formattedArticles);
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


    const getStatusText = (status) => {
        switch (status) {
            case 'draft': return 'In Progress';
            case 'await_review': return 'Pending Review';
            case 'under_review': return 'Reviewing';
            case 'reviewed': return 'Reviewed';

            default: return status;
        }
    };

    const allTags = ['All', ...new Set(articles.map(article => article.tag))];

    const filteredByTag = activeTag === 'All' ? articles : articles.filter(article => article.tag === activeTag);

    const filteredBySearch = filteredByTag.filter(article => 
        article.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredArticles = filteredBySearch;


    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

    const getPageNumbers = () => {
        const pages = [];
        let startPage = currentPage - 1;
        let endPage = currentPage + 1;
        
        if (startPage < 1) {
            const diff = 1 - startPage;
            startPage = 1;
            endPage = Math.min(totalPages, endPage + diff);
        }
        
        if (endPage > totalPages) {
            const diff = endPage - totalPages;
            endPage = totalPages;
            startPage = Math.max(1, startPage - diff);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    if (isLoading) {
        return <div className={styles.container}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.container}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.mainTitle}>My Articles</h1>

            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>All Articles</h2>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Search articles..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.filterContainer}>
                <select
                    className={styles.tagSelect}
                    value={activeTag}
                    onChange={(e) => {
                        setActiveTag(e.target.value);
                        setCurrentPage(1);
                    }}>
                    {allTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>
            </div>

            <div className={styles.articlesList}>
                {currentArticles.map(article => (
                    <div key={article.id} className={styles.articleCard}>
                        <div className={styles.articleContent}>
                            <h3 className={styles.articleTitle}>{article.name}</h3>
                            <ul className={styles.articleMeta}>
                                <img src={calendarImg} alt='?' className={styles.iconsformat} />
                                <li><strong>Submitted:&nbsp;</strong> { article.submitted.toDateString().slice(4)}</li>
                                <img src={tagImg} alt='?' className={styles.iconsformat} />
                                <li><strong>{article.tag}</strong></li>
                            </ul>
                        </div>

                        <div className={styles.articleActions}>
                            <span className={`${styles.articleStatus} ${styles[article.status.replace(/\s+/g, '')]}`}>
                                {article.status}
                            </span>
                            <button
                                className="black_button"
                                onClick={() => setSelectedArticleId(article.id)}>
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedArticleId && (
                <DetailsModal
                    article={{
                        id: selectedArticleId,
                        ...articles.find(a => a.id === selectedArticleId),
                        ...(articleDetails.find(d => d.id === selectedArticleId) || {})
                    }}
                    onClose={() => setSelectedArticleId(null)}
                />
            )}

            {filteredArticles.length > articlesPerPage && (
                <div className={styles.pagination}>
                    {currentPage > 1 && (
                        <button
                            className={styles.paginationButton}
                            onClick={() => setCurrentPage(1)}>
                            « First
                        </button>
                    )}

                    {getPageNumbers().map(number => (
                        <button
                            key={number}
                            className={`${styles.paginationButton} ${currentPage === number ? styles.activePage : ''}`}
                            onClick={() => setCurrentPage(number)}>
                            {number}
                        </button>
                    ))}

                    {currentPage < totalPages && (
                        <button
                            className={styles.paginationButton}
                            onClick={() => setCurrentPage(totalPages)}>
                            Last »
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ArticlesPage;
import React, { useState } from 'react';
import DetailsModal from './DetailsModal';
import styles from '../../styles/myArticlesPage.module.css';
import calendarImg from '../../styles/img/calendar-lines-alt-svgrepo-com.svg';
import tagImg from '../../styles/img/tag-fill-round-1176-svgrepo-com.svg';

const ArticlesPage = () => {
    const [activeTag, setActiveTag] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArticleId, setSelectedArticleId] = useState(null);
    const articlesPerPage = 5;

const articles = [
    {
      id: 1,
      title: "Machine Learning Advances in 2025",
      status: "Pending Review",
      submitted: "May 4, 2025",
      tag: "Technology",
    },
    {
      id: 2,
      title: "Blockchain in Healthcare",
      status: "In Progress",
      submitted: "May 3, 2025",
      tag: "Healthcare",
    },
    {
      id: 3,
      title: "Sustainable Energy Solutions",
      status: "Reviewed",
      submitted: "May 2, 2025",
      tag: "Environment",
    },
    {
      id: 4,
      title: "Quantum Computing Breakthroughs",
      status: "Pending Review",
      submitted: "May 1, 2025",
      tag: "Technology",
    },
    {
      id: 5,
      title: "AI in Modern Education",
      status: "In Progress",
      submitted: "April 30, 2025",
      tag: "Technology",
    },
    {
      id: 6,
      title: "Genome Editing Ethics",
      status: "Reviewed",
      submitted: "April 29, 2025",
      tag: "Healthcare",
    },
    {
      id: 7,
      title: "Renewable Energy Storage",
      status: "Pending Review",
      submitted: "April 28, 2025",
      tag: "Environment",
    },
    {
      id: 8,
      title: "Cybersecurity Trends",
      status: "In Progress",
      submitted: "April 27, 2025",
      tag: "Technology",
    },
    {
      id: 9,
      title: "Precision Medicine",
      status: "Reviewed",
      submitted: "April 26, 2025",
      tag: "Healthcare",
    },
    {
      id: 10,
      title: "Climate Change Models",
      status: "Pending Review",
      submitted: "April 25, 2025",
      tag: "Environment",
    },
    {
        id: 11,
        title: "Climate Change Models",
        status: "Pending Review",
        submitted: "April 25, 2025",
        tag: "Environment",
      },
      {
        id: 12,
        title: "Climate Change Models",
        status: "Pending Review",
        submitted: "April 25, 2025",
        tag: "Science",
      },
      {
        id: 13,
        title: "Climate Change Models",
        status: "Pending Review",
        submitted: "April 25, 2025",
        tag: "Environment",
      },
      {
        id: 14,
        title: "Climate Change Models",
        status: "Pending Review",
        submitted: "April 25, 2025",
        tag: "Environment",
      },
      {
        id: 15,
        title: "Climate Change Models",
        status: "Pending Review",
        submitted: "April 25, 2025",
        tag: "Environment",
      },
      {
        id: 16,
        title: "Climate Change Models",
        status: "Pending Review",
        submitted: "April 25, 2025",
        tag: "Environment",
      },
  ];

const articleDetails = [
{
  id: 1,
  title:"Machine Learning Advances in 2025",
  category: "Technology",
  tags: ["machine-learning", "ai", "future"],
  content: "In 2025, machine learning has made huge leaps...",
  featuredImage: ""
},
{
  id: 2,
  title:"Blockchain in Healthcare",
  category: "Blockchain",
  tags: ["blockchain", "healthcare", "data-security"],
  content: "Blockchain is transforming the healthcare industry by providing secure data storage.",
  featuredImage: ""
},
{
  id: 3,
  title:"Sustainable Energy Solutions",
  category: "Renewable Energy",
  tags: ["solar", "wind-energy", "green-tech"],
  content: "Sustainable energy solutions are becoming more efficient and affordable.",
  featuredImage: ""
}
];  

const allTags = ['All', ...new Set(articles.map(article => article.tag))];

const filteredByTag = activeTag === 'All' ? articles : articles.filter(article => article.tag === activeTag);

const filteredBySearch = filteredByTag.filter(article => article.title.toLowerCase().includes(searchTerm.toLowerCase()));

const filteredArticles = filteredBySearch;

 const getArticleDetails = (id) => {
        return articleDetails.find(detail => detail.id === id);
    };

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
          <h3 className={styles.articleTitle}>{article.title}</h3>
          <ul className={styles.articleMeta}>
            <img src={calendarImg} alt='?' className={styles.iconsformat} />
            <li><strong>Submitted:</strong> {article.submitted}</li>
            <img src={tagImg} alt='?' className={styles.iconsformat} />
            <li><strong>{article.tag}</strong></li>
          </ul>
        </div>

        <div className={styles.articleActions}>
          <span className={`${styles.articleStatus} ${styles[article.status.replace(/\s+/g, '')]}`}>
            {article.status}
          </span>
          <button
            className={styles.detailsButton}
            onClick={() => setSelectedArticleId(article.id)}>View Details</button>
        </div>
      </div>
    ))}
  </div>
  {selectedArticleId && (
      <DetailsModal
          article={{
              id: selectedArticleId,
              ...articles.find(a => a.id === selectedArticleId),
              ...getArticleDetails(selectedArticleId)
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
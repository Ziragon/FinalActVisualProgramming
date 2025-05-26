import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

const localhost = "http://localhost:5000";

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showAddUser, setShowAddUser] = useState(false);
    const { isAuthenticated, token, userId } = useAuth();
    const [users, setUsers] = useState([]);
    const [articles, setArticles] = useState([]);
    const [isFetchingArticles, setIsFetchingArticles] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [isFetchingReviews, setIsFetchingReviews] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        login: '',
        roleId: '',
        fullName: '',
        email: '',
        institution: '',
        fieldOfExpertise: ''
    });
    const [newUserForm, setNewUserForm] = useState({
        login: '',
        password: '',
        roleId: ''
    });

    useEffect(() => {
        if (isAuthenticated && userId && token) {
            fetchUsers();
            fetchArticles();
            fetchReviews();
        }
    }, [isAuthenticated, token, userId, refreshTrigger]);

    const fetchUsers = async () => {
        try {
            const [responseUser, responseProfile] = await Promise.all([
                axios.get(`${localhost}/api/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${localhost}/api/profiles`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);
        
            const combinedData = await responseUser.data.map(user => {
                const profile = responseProfile.data.find(p => p.userId === user.userId);
                
                return {
                    id: user.userId,
                    login: user.login,
                    roleId: user.roleId,
                    ...{
                        fullName: profile.fullName,
                        email: profile.email,
                        institution: profile.institution,
                        fieldOfExpertise: profile.fieldOfExpertise
                    }
                };
            });

            await setUsers(combinedData);
            setIsLoading(false);
        } catch (err) {
            console.error('Ошибка при загрузке профилей:', err);
            setError('Не удалось загрузить профили');
            setIsLoading(false);
        }
    };

    const fetchArticles = async () => {
        try {
            setIsFetchingArticles(true);
            
            const articlesResponse = await axios.get(`${localhost}/api/articles`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
    
            const authorIds = [...new Set(articlesResponse.data.map(article => article.userId))];
            const profilesResponse = await Promise.all(
                authorIds.map(id => 
                    axios.get(`${localhost}/api/profiles/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                )
            );
    
            const profilesMap = profilesResponse.reduce((map, response) => {
                const profileData = response.data.undefined || response.data;
                if (profileData && profileData.userId) {
                    map[profileData.userId] = profileData;
                }
                return map;
            }, {});
    
            const articlesWithAuthors = articlesResponse.data.map(article => {
                const profile = profilesMap[article.userId];
                return {
                    id: article.id,
                    title: article.name,
                    category: article.category,
                    status: article.status,
                    authorId: article.userId,
                    authorName: profile?.fullName || 'Unknown Author'
                };
            });
    
            setArticles(articlesWithAuthors);
        } catch (error) {
            console.error('Error fetching articles:', error);
            setError('Failed to load articles');
        } finally {
            setIsFetchingArticles(false);
        }
    };

    const fetchReviews = async () => {
        try {
            setIsFetchingReviews(true);
            
            const reviewsResponse = await axios.get(`${localhost}/api/reviews`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
    
            const reviewerIds = [...new Set(reviewsResponse.data.map(review => review.userId))];
            const articleIds = [...new Set(reviewsResponse.data.map(review => review.articleId))];
    
            const [profilesResponse, articlesResponse] = await Promise.all([
                Promise.all(
                    reviewerIds.map(id => 
                        axios.get(`${localhost}/api/profiles/${id}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        }).catch(() => null)
                    )
                ),
                Promise.all(
                    articleIds.map(id => 
                        axios.get(`${localhost}/api/articles/${id}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        }).catch(() => null) 
                    )
                )
            ]);

            const profilesMap = profilesResponse.reduce((map, response) => {
                if (response && response.data) {
                    const profileData = response.data.undefined || response.data;
                    if (profileData && profileData.userId) {
                        map[profileData.userId] = profileData;
                    }
                }
                return map;
            }, {});
    
            const articlesMap = articlesResponse.reduce((map, response) => {
                if (response && response.data) {
                    map[response.data.id] = response.data;
                }
                return map;
            }, {});

            const reviewsWithDetails = reviewsResponse.data.map(review => {
                const reviewerProfile = profilesMap[review.userId];
                const article = articlesMap[review.articleId];
                
                return {
                    id: review.id,
                    articleTitle: article?.name || 'Unknown Article',
                    reviewerName: reviewerProfile?.fullName || 'Unknown Reviewer',
                    rating: review.rating || 0,
                    progress: review.progress || 0,
                    status: review.progress === 100 ? 'Completed' : 'Pending'
                };
            });
    
            setReviews(reviewsWithDetails);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setError('Failed to load reviews');
        } finally {
            setIsFetchingReviews(false);
        }
    };

    const handleDeleteUserClick = async (user) => {
        try {
            if (!isAuthenticated || !token) {
                console.error('Пользователь не аутентифицирован');
                return;
            }
    
            const response = await axios.delete(`${localhost}/api/users/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.status === 204) {
                setRefreshTrigger(prev => prev + 1);
            }
    
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
            if (error.response) {
                console.error('Данные ошибки:', error.response.data);
                console.error('Статус ошибки:', error.response.status);
            }
        }
    };

    const handleNewUserFormChange = (e) => {
        const { name, value } = e.target;
        setNewUserForm({
            ...newUserForm,
            [name]: value
        });
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        
        try {
            if (!isAuthenticated || !token) {
                console.error('Пользователь не аутентифицирован');
                return;
            }
    
            const response = await axios.post(`${localhost}/api/users/register`, {
                login: newUserForm.login,
                password: newUserForm.password,
                roleId: parseInt(newUserForm.roleId)
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.status === 200) {
                setShowAddUser(false);
                setNewUserForm({ login: '', password: '', roleId: '' });
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            console.error('Ошибка при регистрации пользователя:', error);
            if (error.response) {
                console.error('Данные ошибки:', error.response.data);
                console.error('Статус ошибки:', error.response.status);
                setError(error.response.data.message || 'Ошибка при регистрации пользователя');
            }
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setEditFormData({
            id: user.id,
            login: user.login,
            roleId: user.roleId,
            fullName: user.fullName,
            email: user.email,
            institution: user.institution,
            fieldOfExpertise: user.fieldOfExpertise
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    const handleEditFormSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (!isAuthenticated || !token) {
                console.error('Пользователь не аутентифицирован');
                return;
            }
    
            const userResponse = await axios.put(
                `${localhost}/api/users/${editFormData.id}`,
                {
                    login: editFormData.login,
                    roleId: parseInt(editFormData.roleId)
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            const profileResponse = await axios.put(
                `${localhost}/api/profiles/${editFormData.id}`,
                {
                    fullName: editFormData.fullName,
                    email: editFormData.email,
                    institution: editFormData.institution,
                    fieldOfExpertise: editFormData.fieldOfExpertise
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            if (userResponse.status === 200 && profileResponse.status === 200) {
                setRefreshTrigger(prev => prev + 1);
                setEditingUser(null);
            }
        } catch (error) {
            console.error('Ошибка при обновлении данных:', error);
            if (error.response) {
                console.error('Данные ошибки:', error.response.data);
                console.error('Статус ошибки:', error.response.status);
                setError(error.response.data.message || 'Ошибка при обновлении данных');
            }
        }
    };

    const handleDeleteArticle = async (articleId) => {
        try {
            await axios.delete(`${localhost}/api/articles/${articleId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Error deleting article:', error);
            setError('Failed to delete article');
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await axios.delete(`${localhost}/api/reviews/${reviewId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Error deleting review:', error);
            setError('Failed to delete review');
        }
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    return (
        <div className={styles.SubmitPage}>
            <div className={styles.personalInfoSection}>
                <h1 className={styles.sectionTitle}>Admin Dashboard</h1>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'users' ? styles.active : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        User Management
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'articles' ? styles.active : ''}`}
                        onClick={() => setActiveTab('articles')}
                    >
                        Articles
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.active : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews
                    </button>
                </div>

                {activeTab === 'users' && (
                    <div className={styles.userManagement}>
                        <div className={styles.searchBar}>
                            <input
                                type="text"
                                placeholder="Search users..."
                                className={styles.searchInput}
                            />
                        </div>

                        <button
                            className={styles.addButton}
                            onClick={() => setShowAddUser(true)}
                        >
                            Add New User
                        </button>

                        {showAddUser && (
                            <div className={styles.addUserForm}>
                                <h3>Add New User</h3>
                                <form onSubmit={handleAddUser}>
                                    <div className={styles.formGroup}>
                                        <label>Login</label>
                                        <input 
                                            type="text" 
                                            name="login"
                                            value={newUserForm.login}
                                            onChange={handleNewUserFormChange}
                                            className={styles.formInput} 
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Password</label>
                                        <input 
                                            type="password" 
                                            name="password"
                                            value={newUserForm.password}
                                            onChange={handleNewUserFormChange}
                                            className={styles.formInput} 
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Role</label>
                                        <select 
                                            name="roleId"
                                            value={newUserForm.roleId}
                                            onChange={handleNewUserFormChange}
                                            className={styles.formInput}
                                            required
                                        >
                                            <option value="">Select Role</option>
                                            <option value="1">Admin</option>
                                            <option value="2">Reviewer</option>
                                            <option value="3">User</option>
                                        </select>
                                    </div>
                                    <div className={styles.formActions}>
                                        <button type="button" onClick={() => setShowAddUser(false)}>Cancel</button>
                                        <button type="submit">Save</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {editingUser && (
                            <div className={styles.editUserModal}>
                                <div className={styles.editUserForm}>
                                    <h3>Edit User</h3>
                                    {error && <div className={styles.errorMessage}>{error}</div>}
                                    <form onSubmit={handleEditFormSubmit}>
                                        <div className={styles.formGroup}>
                                            <label>Login</label>
                                            <input
                                                type="text"
                                                name="login"
                                                value={editFormData.login}
                                                onChange={handleEditFormChange}
                                                className={styles.formInput}
                                                required
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Full Name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={editFormData.fullName}
                                                onChange={handleEditFormChange}
                                                className={styles.formInput}
                                                required
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={editFormData.email}
                                                onChange={handleEditFormChange}
                                                className={styles.formInput}
                                                required
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Institution</label>
                                            <input
                                                type="text"
                                                name="institution"
                                                value={editFormData.institution}
                                                onChange={handleEditFormChange}
                                                className={styles.formInput}
                                                required
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Field Of Expertise</label>
                                            <input
                                                type="text"
                                                name="fieldOfExpertise"
                                                value={editFormData.fieldOfExpertise}
                                                onChange={handleEditFormChange}
                                                className={styles.formInput}
                                                required
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Role</label>
                                            <select
                                                name="roleId"
                                                value={editFormData.roleId}
                                                onChange={handleEditFormChange}
                                                className={styles.formInput}
                                                required
                                            >
                                                <option value="1">Admin</option>
                                                <option value="2">Reviewer</option>
                                                <option value="3">User</option>
                                            </select>
                                        </div>
                                        <div className={styles.formActions}>
                                            <button type="button" onClick={handleCancelEdit}>Cancel</button>
                                            <button type="submit">Save Changes</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        <table className={styles.usersTable}>
                            <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Institution</th>
                                <th>Field of Expertise</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.login} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.roleId}</td>
                                    <td>{user.institution}</td>
                                    <td>{user.fieldOfExpertise}</td>
                                    <td>
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => handleEditClick(user)}
                                        >Edit</button>
                                        <button 
                                            className={styles.actionButton}
                                            onClick={() => handleDeleteUserClick(user)}
                                            >Delete</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'articles' && (
                    <div className={styles.userManagement}>
                        <div className={styles.searchBar}>
                            <input
                                type="text"
                                placeholder="Search articles..."
                                className={styles.searchInput}
                            />
                        </div>

                        {isFetchingArticles ? (
                            <div>Loading articles...</div>
                        ) : (
                            <table className={styles.usersTable}>
                                <thead>
                                    <tr>
                                        <th>Article Title</th>
                                        <th>Author</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {articles.map(article => (
                                        <tr key={article.id}>
                                            <td>{article.title}</td>
                                            <td>{article.authorName}</td>
                                            <td>{article.category}</td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${
                                                    article.status === 'reviewed' ? styles.completed : styles.pending
                                                }`}>
                                                    {article.status}
                                                </span>
                                            </td>
                                            <td>
                                            <button 
                                                className={styles.actionButton}
                                                onClick={() => handleDeleteArticle(article.id)}
                                            >
                                                Delete
                                            </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className={styles.userManagement}>
                        <div className={styles.searchBar}>
                            <input
                                type="text"
                                placeholder="Search reviews..."
                                className={styles.searchInput}
                            />
                        </div>

                        {isFetchingReviews ? (
                            <div>Loading reviews...</div>
                        ) : (
                            <table className={styles.usersTable}>
                                <thead>
                                    <tr>
                                        <th>Article Title</th>
                                        <th>Reviewer</th>
                                        <th>Rating</th>
                                        <th>Progress</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reviews.map(review => (
                                        <tr key={review.id}>
                                            <td>{review.articleTitle}</td>
                                            <td>{review.reviewerName}</td>
                                            <td>
                                                <span className={styles.ratingStars}>
                                                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                                </span>
                                            </td>
                                            <td>{review.progress}%</td>
                                            <td>
                                                <button 
                                                    className={styles.actionButton}
                                                    onClick={() => handleDeleteReview(review.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
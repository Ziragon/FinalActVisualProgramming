import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

const localhost = "http://localhost:5000";

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddUser, setShowAddUser] = useState(false);
    const { isAuthenticated, token, userId } = useAuth();
    const [users, setUsers] = useState([]);
    const [reviews, setReviews] = useState([
        { id: 1, articleTitle: 'Introduction to React', reviewer: 'John Doe', rating: 4, status: 'Completed' },
        { id: 2, articleTitle: 'Advanced JavaScript', reviewer: 'Admin User', rating: 5, status: 'Pending' }
    ]);
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        institution: '',
        fieldOfExpertise: ''
    });

    useEffect(() => {
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

                    console.log(profile.userId, user.userId)
                    
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
                
                console.log('Объединенные данные:', combinedData);
            } catch (err) {
                console.error('Ошибка при загрузке профилей:', err);
                setError('Не удалось загрузить профили');
                setIsLoading(false);
            }
        };
    
        if (isAuthenticated && userId) {
            fetchUsers();
        }
    }, [isAuthenticated, token, userId]);

    const handleAddUser = (e) => {
        e.preventDefault();
        setShowAddUser(false);
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setEditFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
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

    const handleEditFormSubmit = (e) => {
        e.preventDefault();
        const updatedUsers = users.map(user =>
            user.id === editingUser.id ? { ...user, ...editFormData } : user
        );
        setUsers(updatedUsers);
        setEditingUser(null);
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
                                        <label>First Name</label>
                                        <input type="text" className={styles.formInput} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Last Name</label>
                                        <input type="text" className={styles.formInput} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Email</label>
                                        <input type="email" className={styles.formInput} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Role</label>
                                        <select className={styles.formInput}>
                                            <option value="">Select Role</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Editor">Editor</option>
                                            <option value="User">User</option>
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
                                    <form onSubmit={handleEditFormSubmit}>
                                        <div className={styles.formGroup}>
                                            <label>First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={editFormData.firstName}
                                                onChange={handleEditFormChange}
                                                className={styles.formInput}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={editFormData.lastName}
                                                onChange={handleEditFormChange}
                                                className={styles.formInput}
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
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Role</label>
                                            <select
                                                name="role"
                                                value={editFormData.role}
                                                onChange={handleEditFormChange}
                                                className={styles.formInput}
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Editor">Editor</option>
                                                <option value="User">User</option>
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Institution</label>
                                            <input
                                                type="text"
                                                name="institution"
                                                value={editFormData.institution}
                                                onChange={handleEditFormChange}
                                                className={styles.formInput}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Field of Expertise</label>
                                            <input
                                                type="text"
                                                name="fieldOfExpertise"
                                                value={editFormData.fieldOfExpertise}
                                                onChange={handleEditFormChange}
                                                className={styles.formInput}
                                            />
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
                                        >
                                            Edit
                                        </button>
                                        <button className={styles.actionButton}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'articles' && (
                    <div className={styles.articlesSection}>
                        <p>Articles management will be here</p>
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

                        <table className={styles.usersTable}>
                            <thead>
                            <tr>
                                <th>Article Title</th>
                                <th>Reviewer</th>
                                <th>Rating</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {reviews.map(review => (
                                <tr key={review.id}>
                                    <td>{review.articleTitle}</td>
                                    <td>{review.reviewer}</td>
                                    <td>
                                        <span className={styles.ratingStars}>
                                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${
                                            review.status === 'Completed' ? styles.completed : styles.pending
                                        }`}>
                                            {review.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className={styles.actionButton}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
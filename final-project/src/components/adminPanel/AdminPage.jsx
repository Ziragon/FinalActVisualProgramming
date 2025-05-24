import React, { useState } from 'react';
import styles from '../../styles/AdminPage.module.css';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [showAddUser, setShowAddUser] = useState(false);
    const [users, setUsers] = useState([
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'Editor', status: 'Active' },
        { id: 2, firstName: 'Admin', lastName: 'User', email: 'admin@example.com', role: 'Admin', status: 'Active' }
    ]);

    const handleAddUser = (e) => {
        e.preventDefault();

        setShowAddUser(false);
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

                        <table className={styles.usersTable}>
                            <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>{user.role}</td>
                                    <td>{user.status}</td>
                                    <td>
                                        <button className={styles.actionButton}>Edit</button>
                                        <button className={styles.actionButton}>Block</button>
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
            </div>
        </div>
    );
};
export default AdminPage;
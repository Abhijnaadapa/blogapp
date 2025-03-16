import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminStyles.css';
const API_BASE_URL = 'http://localhost:3001/admin-api';

function Admin() {
    console.log("Admin component rendered (CONSOLIDATED)");
    const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isAdminLoggedIn') === 'true');
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');
    const [usersAuthors, setUsersAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        if (isLoggedIn) {
            const fetchUsersAuthors = async () => {
                setLoading(true);
                setFetchError(null);
                try {
                    const response = await axios.get(`${API_BASE_URL}/users-authors`);
                    setUsersAuthors(response.data.payload);
                } catch (error) {
                    console.error('Error fetching users/authors:', error);
                    setFetchError('Failed to fetch users and authors.');
                } finally {
                    setLoading(false);
                }
            };
            fetchUsersAuthors();
        }
    }, [isLoggedIn]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');

        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email: e.target.email.value,
                password: e.target.password.value,
            });
            if (response.data.message === 'success') {
                localStorage.setItem('isAdminLoggedIn', 'true');
                setIsLoggedIn(true);
                navigate('/admin'); // Or wherever you want to redirect after login
            } else {
                setLoginError('Login failed. Please check your credentials and try again.');
            }
        } catch (error) {
            console.error('Login failed:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setLoginError(error.response.data.message);
            } else {
                setLoginError('Login failed. Please check your credentials and try again.');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdminLoggedIn');
        setIsLoggedIn(false);
        navigate('/admin/login'); // Redirect to login page
    };

    const handleToggleActive = async (email, isActive) => {
        try {
            await axios.put(`${API_BASE_URL}/users-authors/toggle`, {
                emails: [email],
                isActive: !isActive,
            });
            setUsersAuthors(prev =>
                prev.map(ua =>
                    ua.email === email ? { ...ua, isActive: !isActive } : ua
                )
            );
        } catch (error) {
            console.error('Error toggling status:', error);
            setFetchError('Failed to toggle status.');
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="admin-login-container">
                <h2>Admin Login</h2>
                {loginError && <p className="error-message" style={{ color: 'red' }}>{loginError}</p>}
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" name="email" required />
                    <input type="password" placeholder="Password" name="password" required />
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }

    return (
        <div className='admin-dashboard'>
            <h2>Admin Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>

            {loading ? (
                <div>Loading users and authors...</div>
            ) : fetchError ? (
                <div>Error: {fetchError}</div>
            ) : (
                <div>
                    {usersAuthors.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Active</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersAuthors.map(ua => (
                                    
                                    <tr key={ua.email} >
                                        <td>{ua.email}</td>
                                        <td>{ua.isActive ? 'Yes' : 'No'}</td>
                                        <td>
                                            <button   className={`toggle-button ${ua.isActive ? 'active' : 'inactive'}`}  onClick={() => handleToggleActive(ua.email, ua.isActive)}>
                                                {ua.isActive ? 'Disable Read' : 'Enable Read'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div>No users or authors found.</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Admin;
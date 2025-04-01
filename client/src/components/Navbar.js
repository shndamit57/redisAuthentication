import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav style={styles.navbar}>
            <h2>Auth System</h2>
            <div style={styles.links}>
                {!user ? (
                    // Show Login and Register when no user is logged in
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" style={styles.link}>Register</Link>
                    </>
                ) : (
                    // Show Dashboard and Admin for logged-in users
                    <>
                        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                        {user.role === 'admin' && <Link to="/admin" style={styles.link}>Admin</Link>}
                        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#333',
        color: 'white',
    },
    links: {
        display: 'flex',
        gap: '15px',
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '18px',
    },
    logoutBtn: {
        backgroundColor: 'red',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        cursor: 'pointer',
    },
};

export default Navbar;

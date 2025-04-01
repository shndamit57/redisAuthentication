import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome, {user?.email}</p>
        </div>
    );
};

export default Dashboard;

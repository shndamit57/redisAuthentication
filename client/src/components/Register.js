import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL;

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${apiUrl}/api/auth/register`, { email, password, role });
            navigate('/login');
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value='user'>User</option>
                    <option value='admin'>Admin</option>
                </select>
                <button type='submit'>Register</button>
            </form>
        </div>
    );
};

export default Register;

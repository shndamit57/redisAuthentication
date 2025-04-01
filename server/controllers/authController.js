import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import redisClient from '../config/redisClient.js';

const generateTokens = async (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    await redisClient.sendCommand(['HSET', `sessions:${userId}`, refreshToken, 'active']);
    return { accessToken, refreshToken };
};

export const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = new User({ email, password: hashedPassword, role, username: email });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const { accessToken, refreshToken } = await generateTokens(user._id);

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });

        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.json({ accessToken, user });
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.sendStatus(403);
    try {
        const { userId } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedSession = await redisClient.hget(`sessions:${userId}`, refreshToken);
        if (!storedSession) return res.sendStatus(403);
        const newTokens = await generateTokens(userId);
        res.cookie('refreshToken', newTokens.refreshToken, { httpOnly: true, secure: true });
        res.json({ accessToken: newTokens.accessToken });
    } catch (error) {
        res.sendStatus(403);
    }
};

export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.sendStatus(204);
        const { userId } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const sessionExists = await redisClient.exists(`sessions:${userId}`);
        if (sessionExists) {
            await redisClient.sendCommand(['HDEL', `sessions:${userId}`, refreshToken]); // Remove specific refresh token
        } 
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Logout failed' });
    }
};

export const logoutAllDevices = async (req, res) => {
    try {
        const userId = req.user.userId;
        await redisClient.del(`sessions:${userId}`);
        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out from all devices' });
    } catch (error) {
        res.status(500).json({ message: 'Logout from all devices failed' });
    }
};

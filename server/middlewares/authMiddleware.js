import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    let token = req.cookies.accessToken; // Read token from cookies

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error.message);
        return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
    }
};

export default authMiddleware;

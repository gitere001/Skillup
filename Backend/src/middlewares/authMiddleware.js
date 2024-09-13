import jwt from 'jsonwebtoken';
import redisClient from '../storage/redis';

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the token exists in Redis
        const redisToken = await redisClient.get(decoded.id);

        if (!redisToken || redisToken !== token) {
            return res.status(401).json({ message: 'Session expired' });
        }

        // Attach user information to request
        req.user = decoded;

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(400).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;

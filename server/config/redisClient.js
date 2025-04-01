import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
    },
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

(async () => {
    if (!redisClient.isOpen) {  // Prevent multiple connections
        await redisClient.connect();
        console.log('Redis Connected');
    }
})();

export default redisClient;

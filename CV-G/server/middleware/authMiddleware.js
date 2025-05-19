const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied.' });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        console.log('User authenticated:', req.user); // Debugging
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(400).json({ error: 'Invalid token.' });
    }
};

module.exports = { authenticate };

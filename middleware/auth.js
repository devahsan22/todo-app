const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decoded;
        next();
        
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ 
                    message: 'Access denied. Admin privileges required.' 
                });
            }
            next();
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Server error during admin authentication.' 
        });
    }
};

module.exports = { auth, adminAuth };
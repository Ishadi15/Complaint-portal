const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { adminLogin, getAllComplaints, updateComplaintStatus, getStats } = require('../controllers/adminController');

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET || 'slt_secret_key', (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.adminId = decoded.id;
        next();
    });
};

router.post('/login', adminLogin);
router.get('/complaints', verifyAdmin, getAllComplaints);
router.post('/update-status', verifyAdmin, updateComplaintStatus);
router.get('/stats', verifyAdmin, getStats);

module.exports = router;

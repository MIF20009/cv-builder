const express = require('express');
const router = express.Router();
const { getUserDashboard } = require('../controllers/dashboardController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getUserDashboard);

module.exports = router;

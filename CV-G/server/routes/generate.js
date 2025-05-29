const express = require('express')
const router = express.Router()
const { generateCV } = require('../controllers/generateController');
const authenticate = require('../middleware/authMiddleware');


router.post('/',authenticate, generateCV)

module.exports = router // ✅ Export the router

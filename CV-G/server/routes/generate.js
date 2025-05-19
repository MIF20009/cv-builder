const express = require('express')
const router = express.Router()
const { generateCV } = require('../controllers/generateController')

router.post('/', generateCV)

module.exports = router // ✅ Export the router

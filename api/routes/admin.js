const express = require('express')
const router = express.Router()

const AdminControllers = require('../controllers/admin')
const checkAuth = require('../middleware/check-auth')

router.post('/signup', AdminControllers.admin_signup)

router.post('/login', AdminControllers.admin_login)

router.delete('/:adminId', checkAuth, AdminControllers.admin_delete)

module.exports = router
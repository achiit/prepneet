const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// User registration
router.post('/register', authController.register);

// User login
router.post('/login', authController.login);
router.get('/', (req, res) => {
    res.send('Hello World!');
})

module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
// User registration
router.post('/register', authController.register);

// User login
router.post('/login', authController.login);
router.get('/', (req, res) => {
    res.send('Hello World!');
})
// router.get('/create-biology-question-paper', authController.createBiologyQuestionPaper);
// router.get('/create-chemistry-question-paper', authController.createChemistryQuestionPaper);
// router.get('/create-physics-question-paper', authController.createPhysicsQuestionPaper);
// Create final paper (non-authenticated route)
router.get('/create-final-paper', authController.createFinalPaper);

router.get('/fetch-final-paper', authMiddleware.authenticate, authController.fetchFinalPaper);

module.exports = router;

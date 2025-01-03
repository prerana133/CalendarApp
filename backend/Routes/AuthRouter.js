const { signup, login } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const ensureAuthenticated = require('../Middlewares/EnsureAuthenticated');
const { ensureAdmin } = require('../Middlewares/EnsureAdmin');

const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);

// Protected route for admin only
router.get('/admin', ensureAuthenticated, ensureAdmin, (req, res) => {
    res.status(200).json({ message: 'Welcome, Admin!' });
});

module.exports = router;

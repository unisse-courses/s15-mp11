const router = require('express').Router();
const userController = require('../controllers/userController');

// Update the import to include the new loginValidation
const { registerValidation, loginValidation } = require('../validators.js');
const { isPublic, isPrivate } = require('../middlewares/checkAuth');

// GET login to display login page
router.get('/login', isPublic, (req, res) => {
  res.render('login', {

  });
});

// GET register to display registration page
router.get('/register', isPublic, (req, res) => {
  res.render('register', {

  });
});



// POST methods for form submissions
router.post('/register', isPublic, registerValidation, userController.registerUser);
router.post('/login', isPublic, loginValidation, userController.loginUser, userController.updateLastActive);

// logout
router.get('/logout', isPrivate, userController.logoutUser, userController.updateLastActive);

module.exports = router;

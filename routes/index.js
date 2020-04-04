const router = require('express').Router();
const userController = require('../controllers/userController');
const userModel = require('../models/user');

const { isPublic, isPrivate, isPrivatePost, isPrivateProfile } = require('../middlewares/checkAuth');
const { updateAccountValidation } = require('../validators.js');

router.get('/', isPublic, (req, res) => {
	res.render('home', {

	});
});

router.get('/home', isPublic, (req, res) => {
  res.render('home', {
    
  });
});

router.get('/post', isPrivatePost, (req, res,) => {
	res.render('post', {
		session: req.session.username,
		name: req.session.name
	});
});

router.get('/updateProfile', (req, res) => {
	res.render('updateProfile', {
		session: req.session.username,
		name: req.session.name
	});
});

router.post('/updateProfile', userController.updateProfile);
router.post('/updateAccount', updateAccountValidation, userController.updateAccount);

router.post('/overview', userController.displayProfile);
router.get('/overview', userController.displayOverview);
router.get('/following', userController.displayFollowing);
router.get('/followers', userController.displayFollowers);

module.exports = router;

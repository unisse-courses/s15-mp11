const router = require('express').Router();
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const userModel = require('../models/user');
const postModel = require('../models/post');

const { isPublic, isPrivate, isPrivatePost, isPrivateProfile } = require('../middlewares/checkAuth');
const { updateAccountValidation } = require('../validators.js');

router.get('/', postController.displayPosts);
router.get('/home', postController.displayPosts);

router.get('/post/:id', postController.displaySpecificPost);

router.get('/profile/:username/updateProfile', (req, res) => {
	res.render('updateProfile', {
		session: req.session.username,
		name: req.session.name,
		url: req.session.url
	});
});

router.get('/createPost', (req, res) => {
	res.render('createPost', {
		session: req.session.username,
		name: req.session.name,
		url: req.session.url
	});
});

router.post('/profile/:username/updateProfile', userController.updateProfile);
router.post('/profile/:username/updateAccount', updateAccountValidation, userController.updateAccount);
router.get('/profile/:username/overview', userController.displayOverview);
router.get('/profile/:username/following', userController.displayFollowing);
router.get('/profile/:username/followers', userController.displayFollowers);
router.post('/createPost', postController.createPost);
router.post('/createReply', postController.createReply);


router.get('/about', (req, res) => {
	res.render('about', {
		session: req.session.username,
		name: req.session.name,
		url: req.session.url
	});
});

router.get('/team', (req, res) => {
	res.render('team', {
		session: req.session.username,
		name: req.session.name,
		url: req.session.url
	});
});

router.get('/contact', (req, res) => {
	res.render('contact', {
		session: req.session.username,
		name: req.session.name,
		url: req.session.url
	});
});

// to check
router.post('/followUser', userController.followUser);

router.post('/update/post/:id/:comment', postController.loadUpdateComment);
router.post('/updateComment', postController.updateComment);

// life hax to delete data lang
router.get('/deletePost', postController.deletePost);
router.get('/deleteUser', userController.deleteUser);

module.exports = router;

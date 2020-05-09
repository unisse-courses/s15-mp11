const router = require('express').Router();
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const userModel = require('../models/user');
const postModel = require('../models/post');
const commentModel = require('../models/comments');

// Configure multer
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() +'-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

const { isPublic, isPrivate, isPrivatePost, isPrivateProfile } = require('../middlewares/checkAuth');
const { updateAccountValidation } = require('../validators.js');

router.get('/', postController.displayPosts);
router.get('/home', postController.displayPosts);
router.post('/home', postController.displayByCategory)

router.get('/post/:id', postController.displaySpecificPost);

router.get('/createPost', (req, res) => {
	res.render('createPost', {
		session: req.session.username,
		name: req.session.name,
		img: req.session.img,
		url: req.session.url
	});
});

router.post('/profile/:username/updateProfile', upload.single('customProfilePicture'), userController.updateProfile);
router.post('/profile/:username/updateAccount', updateAccountValidation, userController.updateAccount);
router.get('/profile/:username/overview', userController.displayOverview);
router.get('/profile/:username/following', userController.displayFollowing);
router.get('/profile/:username/followers', userController.displayFollowers);
router.post('/home/createPost', upload.single('customPicture'), postController.createPost);
router.post('/post/:id', commentController.createComment);


router.get('/about', (req, res) => {
	res.render('about', {
		session: req.session.username,
		name: req.session.name,
		img: req.session.img,
		url: req.session.url
	});
});

router.get('/team', (req, res) => {
	res.render('team', {
		session: req.session.username,
		name: req.session.name,
		img: req.session.img,
		url: req.session.url
	});
});

router.get('/contact', (req, res) => {
	res.render('contact', {
		session: req.session.username,
		name: req.session.name,
		img: req.session.img,
		url: req.session.url
	});
});

// to check
router.post('/followUser', userController.followUser);

router.post('/post/:id/:comment/updateComment', commentController.updateComment);
router.post('/post/:id/:comment/updateCommentVote', commentController.updateCommentVote);
router.post('/post/deleteComment', commentController.deleteComment);
router.get('/post/:id/delete', postController.deletePost);

router.post('/home/search', postController.search);

// life hax to delete data lang
router.get('/deletePost', postController.deleteAllPost);
router.get('/deleteUser', userController.deleteUser);

module.exports = router;

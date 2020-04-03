const router = require('express').Router();
const userController = require('../controllers/userController');
const userModel = require('../models/user');

const { isPublic, isPrivate } = require('../middlewares/checkAuth');

router.get('/', isPublic, (req, res) => {
  res.render('home', { 

  });
});

router.get('/home', isPublic, (req, res) => {
  res.render('home', {
    
  });
});

router.get('/post', isPrivate, (req, res,) => {
	res.render('post', {
		session: 'admin'
	});
});

router.get('/overview', isPrivate, (req, res) => {
	var profileUsername = 'admin';
	userModel.getOne({ username: profileUsername }, (err, result) => {
		if (result) {
		  console.log(result);
		  // found a match, return to login with error
		  res.render('overview', {
			name: result.name,
			joinDate: result.joinDate,
			lastActive: result.lastActive,
			userScore: result.userScore,
			groupTitle: result.groupTitle,
			numPosts: result.numPosts,
			numViews: result.numViews,
			memberTitle: result.memberTitle,
			session: 'admin'
		  });
		}
	});
});

router.get('/following', (req, res) => {
	const username = 'admin';
	userModel.getOne({ username: username }, (err, result) => {
		if (result) {
		  res.render('following', {
			name: result.name,
			joinDate: result.joinDate,
			lastActive: result.lastActive
		  });
		}
	});
});

router.get('/followers', (req, res) => {
	const username = 'admin';
	userModel.getOne({ username: username }, (err, result) => {
		if (result) {
		  res.render('followers', {
			name: result.name,
			joinDate: result.joinDate,
			lastActive: result.lastActive
		  });
		}
	});
});


router.get('/logout', userController.logoutUser);

module.exports = router;

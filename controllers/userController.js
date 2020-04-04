const userModel = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

exports.registerUser = (req, res) => {
  const errors = validationResult(req);
  const { name, email, password, username } = req.body;
  if (errors.isEmpty()) {
    const saltRounds = 10;

    // Hash password
    bcrypt.hash(password, saltRounds, (err, hashed) => {
      var temp = 'profile/';
      temp += name;
      const newUser = {
        name: name,
        email: email,
        username: username,
        password: hashed,
        url: temp
      };

      userModel.create(newUser, (err, user) => {
        if (err) {
          req.flash('error_msg', 'Could not create user. Please try again.');
          res.redirect('/register');
          console.log(err);
          // res.status(500).send({ message: "Could not create user"});
        } else {
          req.flash('success_msg', 'You are now registered! Login below.');
          res.redirect('/login');
        }
      });
    });
  } 
  else {
    const messages = errors.array().map((item) => item.msg);

    req.flash('error_msg', messages.join(' '));

    userModel.getOne({ email: email }, (err, result) => {
      if (result) {
        console.log(result);
        // found a match, return to login with error
        req.flash('error_msg', 'User already exists. Please login.');
        res.redirect('/login');
      } else {
        // no match, create user (next step)
        // for now we redirect to the login with no error.
        res.redirect('/register');
      }
    });
  }
};

exports.loginUser = (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const {
      username,
      password
    } = req.body;

    userModel.getOne({ username: username }, (err, user) => {
      if (err) {
        // Database error occurred...
        req.flash('error_msg', 'Something happened! Please try again.');
        res.redirect('/login');
      } 
      else {
        // Successful query
        if (user) {
          // User found!
         // Check password with hashed value in the database
          bcrypt.compare(password, user.password, (err, result) => {
            // passwords match (result == true)
            if (result) {
              // Update session object once matched!
              req.session.user = user._id;
              req.session.name = user.name;
              req.session.username = user.username;

              var query = {
                username: req.session.username
              };
              var update = {
                $set: { lastActive: Date.now() }
              };
              userModel.findOneAndUpdate(query, update, { new: true }, function(err, result)  {
                if (err) throw err;

                console.log(result);
              });
              console.log(update);

              res.redirect('/');
              
            } else {
              // passwords don't match
              req.flash('error_msg', 'Incorrect password. Please try again.');
              res.redirect('/login');
            }
          });
        } 
        else {
          // No user found
          req.flash('error_msg', 'No registered user with that email. Please register.');
          res.redirect('/register');
        }
      }
    });
  }
  else {
    const messages = errors.array().map((item) => item.msg);

    req.flash('error_msg', messages.join(' '));
    res.redirect('/login');
  }
};

exports.logoutUser = (req, res) => {
  if (req.session) {
    var query = {
      username: req.session.username
    };
    var update = {
      $set: { lastActive: Date.now() }
    };
    userModel.findOneAndUpdate(query, update, { new: true }, function(err, result)  {
      if (err) throw err;

      console.log(result);
    });
    console.log(update);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  }
};

exports.displayProfile = (req, res) => {
  var { profileUsername } = req.body;
  req.session.viewProfile = profileUsername;
  userModel.getOne({ username: req.session.viewProfile }, (err, result) => {
    if (result) {
      var userRating = '';
      if (result.userScore >= 80 && result.userScore <= 120)
        userRating = 'Good';
      else if (result.userScore >= 40 && result.userScore <= 80)
        userRating = 'Neutral';
      else if (result.userScore < 40)
        userRating = 'Bad';
      else
        userRating = 'Outstanding';
      // found a match, return to login with error
      if (req.session.username == profileUsername) {
        res.render('overview', {
          name: result.name,
          joinDate: result.joinDate,
          lastActive: result.lastActive,
          userScore: result.userScore,
          userRating: userRating,
          groupTitle: result.groupTitle,
          numPosts: result.numPosts,
          numViews: result.numViews,
          memberTitle: result.memberTitle,
          username: profileUsername,
          session: req.session.username,
          update: 'true',
          location: result.location,
          about: result.aboutMe
        });
      }
      else if (req.session.username) {
        res.render('overview', {
          name: result.name,
          joinDate: result.joinDate,
          lastActive: result.lastActive,
          userScore: result.userScore,
          userRating: userRating,
          groupTitle: result.groupTitle,
          numPosts: result.numPosts,
          numViews: result.numViews,
          memberTitle: result.memberTitle,
          username: profileUsername,
          session: req.session.username,
          location: result.location,
          about: result.aboutMe
        });
      }
      else {
        res.render('overview', {
          name: result.name,
          joinDate: result.joinDate,
          lastActive: result.lastActive,
          userScore: result.userScore,
          userRating: userRating,
          groupTitle: result.groupTitle,
          numPosts: result.numPosts,
          numViews: result.numViews,
          memberTitle: result.memberTitle,
          username: profileUsername,
          location: result.location,
          about: result.aboutMe
        });
      }
    }
    else {
      console.log('NO MATCH FOUND!');
    }
  });
};

exports.displayOverview = (req, res) => {
  userModel.getOne({ username: req.session.viewProfile }, (err, result) => {
    if (result) {
      var userRating = '';
      if (result.userScore >= 80 && result.userScore <= 120)
        userRating = 'Good';
      else if (result.userScore >= 40 && result.userScore <= 80)
        userRating = 'Neutral';
      else if (result.userScore < 40)
        userRating = 'Bad';
      else
        userRating = 'Outstanding';
      // found a match, return to login with error
      if (req.session.username == req.session.viewProfile) {
        res.render('overview', {
          name: result.name,
          joinDate: result.joinDate,
          lastActive: result.lastActive,
          userScore: result.userScore,
          userRating: userRating,
          groupTitle: result.groupTitle,
          numPosts: result.numPosts,
          numViews: result.numViews,
          memberTitle: result.memberTitle,
          username: req.session.viewProfile,
          session: req.session.username,
          update: 'true',
          location: result.location,
          about: result.aboutMe
        });
      }
      else if (req.session.username) {
        res.render('overview', {
          name: result.name,
          joinDate: result.joinDate,
          lastActive: result.lastActive,
          userScore: result.userScore,
          userRating: userRating,
          groupTitle: result.groupTitle,
          numPosts: result.numPosts,
          numViews: result.numViews,
          memberTitle: result.memberTitle,
          username: req.session.viewProfile,
          session: req.session.username,
          location: result.location,
          about: result.aboutMe
        });
      }
      else {
        res.render('overview', {
          name: result.name,
          joinDate: result.joinDate,
          lastActive: result.lastActive,
          userScore: result.userScore,
          userRating: userRating,
          groupTitle: result.groupTitle,
          numPosts: result.numPosts,
          numViews: result.numViews,
          memberTitle: result.memberTitle,
          username: req.session.viewProfile,
          location: result.location,
          about: result.aboutMe
        });
      }
    }
    else {
      console.log('NO MATCH FOUND!');
    }
  });
};

exports.displayFollowers = (req, res) => {
  userModel.getOne({ username: req.session.viewProfile }, (err, result) => {
    if (result) {
      // found a match, return to login with error
      if (req.session.username) {
        res.render('followers', {
          name: result.name,
          joinDate: result.joinDate,
          lastActive: result.lastActive,
          userScore: result.userScore,
          groupTitle: result.groupTitle,
          numPosts: result.numPosts,
          numViews: result.numViews,
          memberTitle: result.memberTitle,
          username: req.session.viewProfile,
          session: req.session.username
        });
      }
      else {
        res.render('followers', {
          name: result.name,
          joinDate: result.joinDate,
          lastActive: result.lastActive,
          userScore: result.userScore,
          groupTitle: result.groupTitle,
          numPosts: result.numPosts,
          numViews: result.numViews,
          memberTitle: result.memberTitle,
          username: req.session.viewProfile,
        });
      }
    }
    else {
      console.log('NO MATCH FOUND!');
    }
  });
};

exports.displayFollowing = (req, res) => {
  userModel.getOne({ username: req.session.viewProfile }, (err, result) => {
    if (result) {
      // found a match, return to login with error
      if (req.session.username) {
        res.render('following', {
          name: result.name,
          joinDate: result.joinDate,
          lastActive: result.lastActive,
          userScore: result.userScore,
          groupTitle: result.groupTitle,
          numPosts: result.numPosts,
          numViews: result.numViews,
          memberTitle: result.memberTitle,
          username: req.session.viewProfile,
          session: req.session.username
        });
      }
      else {
        res.render('following', {
          name: result.name,
          joinDate: result.joinDate,
          lastActive: result.lastActive,
          userScore: result.userScore,
          groupTitle: result.groupTitle,
          numPosts: result.numPosts,
          numViews: result.numViews,
          memberTitle: result.memberTitle,
          username: req.session.viewProfile,
        });
      }
    }
    else {
      console.log('NO MATCH FOUND!');
    }
  });
};

exports.updateProfile = (req, res) => {
  var { location, about } = req.body;
  var query = {
    username: req.session.username
  };

  var update = {
    $set: { location: location, aboutMe: about }
  };

  console.log(query);
  console.log(update);
  userModel.findOneAndUpdate(query, update, { new: true }, function(err, result)  {
  if (err) throw err;
  
    res.render('overview', {
      name: result.name,
      joinDate: result.joinDate,
      lastActive: result.lastActive,
      userScore: result.userScore,
      groupTitle: result.groupTitle,
      numPosts: result.numPosts,
      numViews: result.numViews,
      memberTitle: result.memberTitle,
      username: req.session.username,
      session: req.session.username,
      update: 'true',
      location: result.location,
      about: result.aboutMe
    });
  });
};

exports.updateAccount = (req, res) => {
  const errors = validationResult(req);
  var { oldPass, conPass, newPass } = req.body;
  var query = {
    username: req.session.username
  };
  if (errors.isEmpty()) {
    const saltRounds = 10;

    // Hash password
    bcrypt.hash(newPass, saltRounds, (err, hashed) => {
      var update = {
        $set: { password: hashed }
      };
      userModel.findOneAndUpdate(query, update, { new: true }, function(err, result)  {
        if (err) throw err;

        res.render('overview', {
          name: result.name,
          joinDate: result.joinDate,
          lastActive: result.lastActive,
          userScore: result.userScore,
          groupTitle: result.groupTitle,
          numPosts: result.numPosts,
          numViews: result.numViews,
          memberTitle: result.memberTitle,
          username: req.session.username,
          session: req.session.username,
          update: 'true',
          location: result.location,
          about: result.aboutMe
        });

        console.log(result);
      });
    });

  }
  else {
    const msg = errors.array().map((item) => item.msg);
    req.flash('error_msg', msg.join(' '));

    res.redirect('/updateProfile');
  }
};

exports.updateLastActive = (req, res) => {
  var query = {
    username: req.session.username
  };
  var update = {
    $set: { lastActive: Date.now }
  };
  userModel.findOneAndUpdate(query, update, { new: true }, function(err, result)  {
    if (err) throw err;

    res.redirect('/');

    console.log(result);
  });
  console.log(update);
};

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
      var temp = username;
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
              req.session.url = user.url;
              req.session.img = user.img;

              var query = {
                username: req.session.username
              };
              var update = {
                $set: { lastActive: Date.now() }
              };
              userModel.findOneAndUpdate(query, update, { new: true }, function(err, result)  {
                if (err) throw err;

              });

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

    });

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  }
};

exports.displayOverview = (req, res) => {
  var queryProfile = {
    username: req.params.username
  };
  userModel.getOne(queryProfile, (err, result) => {
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

      // update num views
      var incViews = result.numViews;
      incViews++;

      var update = {
        $set: { numViews: incViews }
      }

      userModel.findOneAndUpdate(queryProfile, update, {new:true}, (err, post1) => {
        if (err) 
          throw err;
        else {
          post1.save(post1);

        }
      });

      if (req.session.username === result.username) {
        console.log('1');
        res.render('overview', {
          name: req.session.username,
          joinDate: result.joinDate,
          lastActive: result.lastActive,
          userScore: result.userScore,
          userRating: userRating,
          groupTitle: result.groupTitle,
          numPosts: result.numPosts,
          numViews: result.numViews,
          memberTitle: result.memberTitle,
          username: req.session.username,
          session: req.session.username,
          profileURL: result.url,
          url: req.session.url,
          img: result.img,
          update: 'true',
          location: result.location,
          about: result.aboutMe
        });
      }
      else if (req.session.username !== result.username && req.session.username) {
        console.log('2');
        var query = {
            $and: [ { followers: { $elemMatch: { followerUsername: req.session.username, followerName: req.session.name } } },
            {username: result.username} ]
        };
        console.log(result.username);
        userModel.getOne(query, (err, addResult) => {
          if (addResult) {
            // dont
            console.log(addResult);
            res.render('overview', {
              name: req.session.username,
              joinDate: result.joinDate,
              lastActive: result.lastActive,
              userScore: result.userScore,
              userRating: userRating,
              groupTitle: result.groupTitle,
              numPosts: result.numPosts,
              numViews: result.numViews,
              memberTitle: result.memberTitle,
              username: result.username,
              session: result.name,
              profileURL: result.url,
              url: req.session.url,
              img: result.img,
              location: result.location,
              about: result.aboutMe,
            });
          } 
          else {
            console.log('2');
            console.log(err);
            res.render('overview', {
              name: req.session.name,
              joinDate: result.joinDate,
              lastActive: result.lastActive,
              userScore: result.userScore,
              userRating: userRating,
              groupTitle: result.groupTitle,
              numPosts: result.numPosts,
              numViews: result.numViews,
              memberTitle: result.memberTitle,
              username: req.params.username,
              session: req.session.username,
              profileURL: result.url,
              url: req.session.url,
              img: result.img,
              location: result.location,
              about: result.aboutMe,
              addUser: result.username,
              addName: result.name,
              addImg: result.img,
              addURL: result.url
            });
          }
        });
      }
      else {
        console.log('3');
        res.render('overview', {
          joinDate: result.joinDate,
          lastActive: result.lastActive,
          userScore: result.userScore,
          userRating: userRating,
          groupTitle: result.groupTitle,
          numPosts: result.numPosts,
          numViews: result.numViews,
          memberTitle: result.memberTitle,
          username: req.params.username,
          location: result.location,
          profileURL: result.url,
          img: result.img,
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
  var query = {
    username: req.params.username
  };
  userModel.getOne(query, (err, result) => {
    if (result) {
      if (!req.session.username) {
        res.render('followers', {
          name: req.session.username,
          joinDate: result.joinDate,
          lastActive: result.lastActive,
          userScore: result.userScore,
          groupTitle: result.groupTitle,
          numPosts: result.numPosts,
          numViews: result.numViews,
          memberTitle: result.memberTitle,
          followers: result.followers,
          img: result.img,
          profileURL: result.url,
        });
      }
      else {
        res.render('followers', {
          name: req.session.username,
          joinDate: result.joinDate,
          lastActive: result.lastActive,
          userScore: result.userScore,
          groupTitle: result.groupTitle,
          numPosts: result.numPosts,
          numViews: result.numViews,
          memberTitle: result.memberTitle,
          username: req.session.viewProfile,
          followers: result.followers,
          profileURL: result.url,
          url: req.session.url,
          username: req.session.viewProfile,
          session: req.session.username,
          img: result.img,
        });
      }
    }
    else {
      console.log('NO MATCH FOUND!');
    }
  });
};

exports.displayFollowing = (req, res) => {
  var query = {
    username: req.params.username
  };
  userModel.getOne(query, (err, result) => {
    if (result) {
      if (!req.session.username) {
        res.render('following', {
          name: req.session.username,
          joinDate: result.joinDate,
          lastActive: result.lastActive,
          userScore: result.userScore,
          groupTitle: result.groupTitle,
          numPosts: result.numPosts,
          numViews: result.numViews,
          memberTitle: result.memberTitle,
          username: req.session.viewProfile,
          following: result.following,
          img: result.img,
          profileURL: result.url,
        });
      }
      else {
        res.render('following', {
          name: req.session.username,
          joinDate: result.joinDate,
          lastActive: result.lastActive,
          userScore: result.userScore,
          groupTitle: result.groupTitle,
          numPosts: result.numPosts,
          numViews: result.numViews,
          memberTitle: result.memberTitle,
          username: req.session.viewProfile,
          following: result.following,
          profileURL: result.url,
          url: req.session.url,
          session: req.session.username,
          img: result.img,
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
  var usr = req.params.username;
  var update = {
    $set: { location: location, aboutMe: about }
  };

  userModel.findOneAndUpdate(query, update, { new: true }, function(err, result)  {
    if (err) throw err;
    
    else {
      result.save(result);
      var userRating = '';
      if (result.userScore >= 80 && result.userScore <= 120)
        userRating = 'Good';
      else if (result.userScore >= 40 && result.userScore <= 80)
        userRating = 'Neutral';
      else if (result.userScore < 40)
        userRating = 'Bad';
      else
        userRating = 'Outstanding';

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
        url: req.session.url,
        update: 'true',
        location: result.location,
        about: result.aboutMe,
        userRating: userRating,
        img: result.img,
      });
    };
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
          url: req.session.url,
          update: 'true',
          location: result.location,
          about: result.aboutMe,
          img: result.img,
        });
      });
    });

  }
  else {
    const msg = errors.array().map((item) => item.msg);
    req.flash('error_msg', msg.join(' '));

    res.redirect('/updateProfile');
  }
};

exports.followUser = (req, res) => {
  // follow the user
  var { addURL } = req.body;
  var url = addURL + '/overview';
  var query = {
    username: req.session.username
  };
  var { addUsername, addName, addImg } = req.body;
  var person = {
    followingUsername: addUsername,
    followingName: addName,
    img: addImg
  };
  userModel.getOne(query, function(err, result)  {
    if (err) 
      throw err;

    else {
      result.following.push(person);
      result.save(result);

      // add the user to the others follower list
      var query1 = {
        username: addUsername
      };
      var person1 = {
        followerUsername: result.username,
        followerName: result.name,
        img: result.img
      };

      userModel.getOne(query1, function(err, result1)  {
        if (err) 
          throw err;
        else {
          result1.followers.push(person1);
          result1.save(result1);

          res.redirect('/');
        }
      });
    }
  });

};

exports.deleteUser = (req, res) => {
  var query = {
    
  };
  userModel.deleteOne(query, (err, status) => {
    if (err) 
      throw err;
      
    res.redirect('/home');
  });
};
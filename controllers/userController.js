const userModel = require('../models/user');
const postModel = require('../models/post');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

exports.registerUser = (req, res) => {
  const errors = validationResult(req);
  const { name, email, password, username } = req.body;
  if (errors.isEmpty()) {
    const saltRounds = 10;

    userModel.getOne({ $or: [ {email: email}, {username:username}] }, (err, result) => {
      if (result) {
        // found a match, return to login with error
        req.flash('error_msg', 'User already exists. Please login.');
        res.redirect('/login');
      } 
      else {
        // no match, create user (next step)
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
            } 
            else {
              req.flash('success_msg', 'You are now registered! Login below.');
              res.redirect('/login');
            }
          });
        });
      }
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
      } 
      else {
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

              res.redirect('/home');
              
            } else {
              // passwords don't match
              req.flash('error_msg', 'Incorrect password. Please try again.');
              res.redirect('/login');
            }
          });
        } 
        else {
          // No user found
          req.flash('error_msg', 'No registered user with that email. Please register first.');
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

exports.displayActivity = (req, res) => {
  var query = {
    username: req.params.username
  }
  console.log(query);
  userModel.getOne(query, (err, result) => {
    if (err) 
      throw err;
    console.log(result);
    postModel.getAllPosts({author: result.username}, (err, posts) => {
      var postObjects = [];

      posts.forEach(function(doc) {
        postObjects.push(doc.toObject());
      });

      res.render('activity', {
        profile: result,
        sessionID: req.session.user,
        session: req.session.username,
        img: req.session.img,
        url: req.session.url,
        posts: postObjects
      });
    });
  });
};

exports.displayOverview = (req, res) => {
  var queryProfile = {
    username: req.params.username
  };

  // Retrieve User Profile to be viewed
  userModel.getOne(queryProfile, (err, result) => {
    if (result) {
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
        if (req.session.username) {
          if (req.session.username === result.username) {

            res.render('overview', {
              profile: post1,
              session: req.session.username,
              img: req.session.img,
              update: true,
              url: req.session.url,
            });
          }
          else if (req.session.username !== result.username && req.session.username) {
            // Retrieve Current User's Object ID to be used for querying the list of followers
            userModel.getOne({ username: req.session.username }, (err, user) => {
              if (err) throw err;

              var query = {
                  $and: [ { followers: { _id: user._id } }, { username: post1.username } ]
              };
              // Retrieve Current user information viewing another user to enable follow
              userModel.getOne(query, (err, addResult) => {
                if (addResult) {
                  res.render('overview', {
                    profile: post1,
                    session: req.session.username,
                    img: req.session.img,
                    url: req.session.url
                  });
                } 
                else {
                  res.render('overview', {
                    profile: post1,
                    session: req.session.username,
                    url: req.session.url,
                    img: req.session.img,
                    addUser: true
                  });
                }
              });
            });
          }
        }
        else {
          res.render('overview', {
            profile: post1,
            url: req.session.url,
          });
        }
      });
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
      res.render('followers', {
        profile: result,
        sessionID: req.session.user,
        session: req.session.username,
        img: req.session.img,
        url: req.session.url,
      });
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
      res.render('following', {
        profile: result,
        sessionID: req.session.user,
        session: req.session.username,
        img: req.session.img,
        url: req.session.url,
      });
    }
    else {
      console.log('NO MATCH FOUND!');
    }
  });
};

exports.updateProfile = (req, res) => {
  var { location, about } = req.body;
  const file = req.file;
  var query = {
    username: req.params.username
  };
  var usr = req.params.username;

  if (file) {
    var update = {
      $set: { location: location, aboutMe: about, img: '/'+file.path }
    };
    req.session.img = file.path;
  }
  else {
    var update = {
      $set: { location: location, aboutMe: about}
    };
  }

  userModel.findOneAndUpdate(query, update, { new: true }, function(err, result)  {
    if (err) throw err;
    
    else {
      result.save(result);

      res.render('overview', {
        profile: result,
        session: req.session.username,
        img: req.session.img,
        update: true,
        url: req.session.url,
      });
    };
  });
};

exports.updateAccount = (req, res) => {
  const errors = validationResult(req);
  var { oldPass, conPass, newPass } = req.body;
  var query = {
    username: req.params.username
  };

  if (errors.isEmpty()) {
    const saltRounds = 10;

    userModel.getOne({ username:req.params.username }, (err, user) => {
      bcrypt.compare(oldPass, user.password, (err, result) => {
        // passwords match (result == true)
        if (result) {
          // Hash password
          bcrypt.hash(newPass, saltRounds, (err, hashed) => {
            var update = {
              $set: { password: hashed }
            };
            userModel.findOneAndUpdate({ username:req.params.username }, update, { new: true }, function(err, result1)  {
              if (err) throw err;

            });
          });
          res.redirect('overview');
        } 
        else {
          // passwords don't match
          req.flash('error_msg', 'Incorrect password. Please try again.');
          res.redirect('overview');
        }
      });
    });
  }
  else {
    const msg = errors.array().map((item) => item.msg);
    req.flash('error_msg', msg.join(' '));

    res.redirect('overview');
  }
};

exports.followUser = (req, res) => {
  // Add the followed user to the CURRENT USER'S FOLLOWING LIST
  var { profileID } = req.body;

  var query1 = {
    username: req.session.username
  };
  var update1 = {

  }
  userModel.findOneAndUpdate(query1, update1, { new: true }, function(err, result1)  {
    if (err) throw err;

    result1.following.push(profileID);
    result1.save(result1);
    // Add the CURRENT USER to the followed user's FOLLOWER LIST
    var query2 = {
      _id: profileID
    };
    var update2 = {

    };

    userModel.findOneAndUpdate(query2, update2, { new: true }, function(err, result2)  {
      if (err) throw err;

      result2.followers.push(result1._id);
      result2.save(result2);

      res.render('overview', {
        profile: result2,
        session: req.session.username,
        img: req.session.img,
        url: result2.url
      });
    });
  });
};

exports.deleteUser = (req, res) => {
  var query = {
    
  };
  userModel.deleteOne(query, (err, status) => {
    if (err) 
      throw err;
      
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/');
      });
    res.redirect('/home');
  });
};
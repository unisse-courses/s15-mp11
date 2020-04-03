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
      console.log(username);
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

              console.log(req.session);


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
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  }
};

exports.displayProfile = (req, res) => {
  const { username } = req.body;
  userModel.getOne({ username: username }, (err, result) => {
    if (result) {
      console.log(result);
      // found a match, return to login with error
      return result
    }
  });
};
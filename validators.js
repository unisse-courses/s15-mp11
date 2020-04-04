const { body } = require('express-validator');

const registerValidation = [
  // Name should not be empty
  body('name').not().isEmpty().withMessage("Name is required."),

  // Username
  body('username').not().isEmpty().withMessage("Username is required."),

  // Email should not be empty and must be a valid email
  body('email').not().isEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Please provide a valid email."),

  // Password needs to be min 6 chars
  body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),

  // Confirm Password needs to be min 6 chars AND must match the req.body.password field
  body('cpassword').isLength({ min: 6 }).withMessage("Password must be at least 6 characters long.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must match.");
      }
      return true;
    })
];

const loginValidation = [
  // Email should not be empty and must be a valid email
  body('username').not().isEmpty().withMessage("Email is required."),
  // Password should not be empty and needs to be min 6 chars
  body('password').not().isEmpty().withMessage("Password is required.")
];

const updateAccountValidation = [
  // Confirm Password needs to be min 6 chars AND must match the req.body.password field

  // Password needs to be min 8 chars
  body('newPass').isLength({ min: 8 }).withMessage("New password must be at least 8 characters long."),
];

// update exports
module.exports = { registerValidation, loginValidation, updateAccountValidation };
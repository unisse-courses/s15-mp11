const mongoose = require('./connection');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, min: 8, required: true },
    name: { type: String, required: true},
    url: { type: String, required: true},
    joinDate: { type: Date, default: Date.now },
    lastActive: { type: Date, required: false },
    numViews: { type: Number, default: 0 },
    numPosts: { type: Number, default: 0 },
    userScore: { type: Number, default: 100 },
    memberTitle: { type: String, default: 'I am new here' },
    groupTitle: { type: String, default: 'Member' },
    followers: [Number],
    following: [Number],
    img: { type: String, default: 'default'},
    location: { type: String, required: false},
    aboutMe: { type: String, required: false}
  }
);

const User = mongoose.model('users', userSchema);

// Saving a user given the validated object
exports.create = function(obj, next) {
  const user = new User(obj);

  user.save(function(err, user) {
    next(err, user);
  });
};

// Retrieving a user based on ID
exports.getById = function(id, next) {
  User.findById(id, function(err, user) {
    next(err, user);
  });
};

// Retrieving just ONE user based on a query (first one)
exports.getOne = function(query, next) {
  User.findOne(query, function(err, user) {
    next(err, user);
  });
};

exports.findOneAndUpdate = function(query, update, opt, next) {
  User.findOneAndUpdate(query, update, opt, function(err, user) {
    next(err, user);
  });
};

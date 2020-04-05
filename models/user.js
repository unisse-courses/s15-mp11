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
    followers: [{
      followerUsername: String,
      followerName: String,
      img: String
    }],
    following: [{
      followingUsername: String,
      followingName: String,
      img: String
    }],
    img: { type: String, default: '/graphics/default.PNG'},
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

exports.getCount = function(req, next) {
  User.find(req, function(err, post) {

  }).count(function(err, count) {
    next(err, count);
  });
};

// Retrieving a user based on ID
exports.getAll = function(id, next) {
  User.find(id, function(err, user) {
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

exports.deleteOne = function(filter, next) {
  User.remove(filter, function(err, status) {
    next(err, status);
  });
}
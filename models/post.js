const mongoose = require('./connection');

const postSchema = new mongoose.Schema({
    postID: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    numViews: { type: Number, default: 0},
    numReplies: { type: Number, default: 0 },
    img: { type: String, required: false },
    postTime: { type: Date, default: Date.now },
    comments: [{
      commentID: Number,
      postTime: Date,
      voteScore: Number,
      content: String,
      authorUsername: String
    }],
    url: { type: String, required: false }
  }
);

const Post = mongoose.model('posts', postSchema);

// Saving a post given the validated object
exports.create = function(obj, next) {
  const post = new Post(obj);

  post.save(function(err, post) {
    next(err, post);
  });
};

exports.createComment = function(query, comment, opt, next) {
  Post.findOneAndUpdate(query, update, opt, function(err, post) {
    next(err, post);
  });
};

exports.getCount = function(req, next) {
  Post.find(req, function(err, post) {

  }).count(function(err, count) {
    next(err, count);
  });
};

// Retrieving all posts
exports.getAllPosts = function(query, next) {
  Post.find(query, function(err, post) {
    next(err, post);
  });
};

exports.getOnePost = function(query, next) {
  Post.findOne(query, function(err, post) {
    next(err, post);
  });
};

exports.findOneAndUpdate = function(query, update, opt, next) {
  Post.findOneAndUpdate(query, update, opt, function(err, post) {
    next(err, post);
  });
};
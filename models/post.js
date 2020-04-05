const mongoose = require('./connection');

const postSchema = new mongoose.Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    numViews: { type: Number, default: 0},
    numReplies: { type: Number, default: 0 },
    img: { type: String, required: false },
    postTime: { type: Date, default: Date.now },
    comments: [{
      commentID: { type: Number },
      postTime: { type: Date },
      voteScore: { type: Number },
      content: { type: String },
      authorUsername:{ type: String },
      authorURL: { type: String },
      authorIMG: { type: String }
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

exports.updateComment = function(query, update, opt, next) {
  Post.update(query, update, opt, function(err, post) {
    next(err, post);
  });
};

exports.deleteOne = function(filter, next) {
  Post.remove(filter, function(err, status) {
    next(err, status);
  });
}

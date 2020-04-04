const mongoose = require('./connection');

const commentSchema = new mongoose.Schema({
    postID: { type: String, required: true },
    commentID: { type: Number },
    postTime: { type: Date, default: Date.now },
    voteScore: { type: Number, default: 0 },
    content: { type: String },
    author: { type: String, required: true }
  }
);

const Comment = mongoose.model('comments', commentSchema);

exports.create = function(obj, next) {
  const comment = new Comment(obj);

  comment.save(function(err, comment) {
    next(err, comment);
  });
};
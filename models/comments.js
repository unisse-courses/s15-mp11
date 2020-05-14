const mongoose = require('./connection');


const commentSchema = new mongoose.Schema({
    postURL: { type: String, required: true },
    commentID: { type: Number, default: 1 },
    postTime: { type: Date, default: Date.now },
    lastEdited: { type: Date },
    isDeleted: { type: Number },
    voteScore: { type: Number, default: 0 },
    content: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    voters: [{ type:String }]
  }
);

const Comment = mongoose.model('comments', commentSchema);

exports.create = function(obj, next) {
  const comment = new Comment(obj);

  comment.save(function(err, comment) {
    next(err, comment);
  });
};

exports.getOne = function(query, next) {
  Comment.findOne(query, function(err, comment) {
    next(err, comment);
  });
};

exports.getAllComments = function(query, next) {
  Comment.find(query).populate('author').exec(function(err, comment) {
    next(err, comment);
  });
};

exports.delete = function(filter, next) {
  Comment.remove(filter, function(err, status) {
    next(err, status);
  });
}

exports.findOneAndUpdate = function(query, update, opt, next) {
  Comment.findOneAndUpdate(query, update, opt, function(err, comment) {
    next(err, comment);
  });
};
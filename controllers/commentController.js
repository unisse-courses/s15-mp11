const commentModel = require('../models/comments');
const postModel = require('../models/post')
const userModel = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

exports.createComment = (req, res) => {
	var { ta, url } = req.body;
	var query = {
		url: url
	};

	postModel.getOnePost(query, (err, post) => {
		if (err) throw err;

		// Update Post Replies Number
		var incReply = post.numReplies;
		incReply++;

		var update = {
			$set: { numReplies: incReply }
		}

		postModel.findOneAndUpdate(query, update, {new:true}, (err, post1) => {
			
		});

		incReply++;

		userModel.getOne({ username: req.session.username }, (err, user) => {
			// Prepare post reply data
			var replyAuthorURL = req.session.username;
			var reply = {
				postURL: url,
				commentID: incReply,
				postTime: Date.now(),
				content: ta,
				author: user._id
			};

			// Create a new comment
			commentModel.create(reply, (err, comment) => {
				if (err) throw err;

				postModel.getOnePost(query, (err, post1) => {
					commentModel.getAllComments({ postURL: url }, (err, comments) => {

						res.render('post', {
							session: req.session.username,
							img: req.session.img,
							name: req.session.name,
							url: req.session.url,
							post: post1,
							comments: comments
						});
					});
				});
			});
		});
	});
};

exports.updateCommentVote = (req, res) => {
	var url = '/post/' + req.params.id;
	var comID = req.params.comment;
	var keys = Object.keys(req.body);
	var voteType = req.body[keys[0]];

	var query = {
		$and: [ { postURL: url }, { commentID: comID } ]
	}
	var filter = {
		new: true
	}

	postModel.getOnePost({ url: url }, (err, post) => {
		if (err) throw err;

		commentModel.getOne(query, (err, comment) => {
			if (err) throw err;

			userModel.getOne({ username: req.session.username }, (err, user) => {
				if (err) throw err;

				var newScore = comment.voteScore;
				var newUserScore = user.userScore;
				if (newUserScore >= 80 && newUserScore <= 120)
					userRating = 'Good';
				else if (newUserScore >= 40 && newUserScore <= 80)
					userRating = 'Neutral';
				else if (newUserScore < 40)
					userRating = 'Bad';
				else
					userRating = 'Outstanding';

				if (voteType == 1) {
					newScore++;
					newUserScore++;
				}
				else {
					newScore--;
					newUserScore--;
				}

				var update = {
					$set: { voteScore: newScore, voters: [req.session.username], userRating: userRating }
				}

				userModel.findOneAndUpdate({ username: req.session.username }, { userScore: newUserScore }, { new: true }, (err, result) => {
					if (err) throw err;
				});

				commentModel.findOneAndUpdate(query, update, filter, (err, status) => {
					if (err) throw err;

					commentModel.getAllComments({ postURL: url }, (err, comments) => {
						if (err)
							throw err;
						res.render('post', {
							name: req.session.username,
							session: req.session.username,
							url: req.session.url,
							img: req.session.img,
							post: post,
							comments: comments
						});
					});
				});
			});
		});
	});
};

exports.updateComment = (req, res) => {
	var { url, newContent, comID } = req.body;
	var query = {
		$and: [ { postURL: url }, { commentID: comID } ]
	};
	var update = {
		$set: { content: newContent, lastEdited: Date.now() }
	};
	var filter = {
		new: true
	}

	postModel.getOnePost({ url: url }, (err, post) => {
		if (err)
			throw err;
		else {
			commentModel.findOneAndUpdate(query, update, filter, (err, status) => {
				if (err)
					throw err;
				else {
					commentModel.getAllComments({ postURL: url }, (err, comments) => {
						if (err)
							throw err;
						else {
							res.render('post', {
								name: req.session.username,
								session: req.session.username,
								url: req.session.url,
								img: req.session.img,
								post: post,
								comments: comments
							});
						}
					});
				}
			});
		}
	});
};

exports.deleteComment = (req, res) => {
	var { url, comID } = req.body;
	var newContent = 'The comment has been deleted and is no longer viewable.';
	var query = {
		$and: [ { postURL: url }, { commentID: comID } ]
	};
	var update = {
		$set: { content: newContent, isDeleted: true }
	};
	var filter = {
		new: true
	}

	postModel.getOnePost({ url: url }, (err, post) => {
		if (err)
			throw err;
		else {
			commentModel.findOneAndUpdate(query, update, filter, (err, status) => {
				if (err)
					throw err;
				else {
					commentModel.getAllComments({ postURL: url }, (err, comments) => {
						if (err)
							throw err;
						else {
							res.render('post', {
								name: req.session.username,
								session: req.session.username,
								url: req.session.url,
								img: req.session.img,
								post: post,
								comments: comments
							});
						}
					});
				}
			});
		}
	});
};
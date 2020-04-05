const postModel = require('../models/post');
const userModel = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

exports.createPost = (req, res) => {
	const errors = validationResult(req);
	const { postTitle, postCategory, content, picURL } = req.body;
	if (errors.isEmpty()) {
		postModel.getCount({}, (err, post) => {
			var count = post;
			count++;
			var temp = '/post/';
      		temp += count;
      		console.log(post);
			const newPost = {
				postID: count,
		        title: postTitle,
		        category: postCategory,
		        comments: [{
		        	commentID: 1,
		        	postTime: Date.now(),
				    voteScore: 0,
				    content: content,
				    authorUsername: req.session.username,
				    authorURL: req.session.url,
				    authorIMG: req.session.img
		        }],
		        url: temp,
		        img: picURL
		      };
			postModel.create(newPost, (err, post) => {
			    if (err) {
			      req.flash('error_msg', 'Could not create post. Please try again.');
			      res.redirect('/createPost');
			      console.log(err);
			      // res.status(500).send({ message: "Could not create user"});
			    } 
			    else {
			    	postModel.getAllPosts({}, (err1, posts) => {
						var postObjects = [];

						posts.forEach(function(doc) {
							postObjects.push(doc.toObject());
						});


						userModel.getOne({ username: req.session.username }, (err, user) => {
							if (err)
								throw err;
							else {
								var incPosts = user.numPosts;
								incPosts++;
								var update = {
									$set: { numPosts: incPosts }
								}
								userModel.findOneAndUpdate({ username: req.session.username }, update, {new:true}, (err, status) => {
									if (err)
										throw err;
									else {
							          status.save(status);
							        }
								});
							}
						});
						
						res.render('home', {
							name: req.session.name,
							session: req.session.username,
							url: req.session.url,
							posts: postObjects
						});
					});
			    }
		  	});
		});
	} 
	else {
	const messages = errors.array().map((item) => item.msg);

	req.flash('error_msg', messages.join(' '));

	postModel.getOne({ email: email }, (err, result) => {
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

exports.displayPosts = (req, res) => {
	postModel.getAllPosts({}, (err, posts) => {
		var postObjects = [];
		posts.forEach(function(doc) {
			postObjects.push(doc.toObject());
		});

		res.render('home', {
			name: req.session.username,
			session: req.session.username,
			url: req.session.url,
			posts: postObjects
		});
	});
};

exports.displaySpecificPost = (req, res) => {
	var id = req.params.id;
	var postURL = '/post/'+id;
	var query = {
		url: postURL
	};
	postModel.getOnePost(query, (err, post) => {
		if (err) 
			throw err;
		else {
			var incViews = post.numViews;
			incViews++;

			var update = {
				$set: { numViews: incViews }
			}

			postModel.findOneAndUpdate(query, update, {new:true}, (err, post1) => {

			});

			res.render('post', {
				name: req.session.name,
				session: req.session.username,
				url: req.session.url,
				img: req.session.img,
				post: post
			});
		}
	});
};

exports.createReply = (req, res) => {
	var { ta, url } = req.body;
	var query = {
		url: url
	};
	console.log(query);
	postModel.getOnePost(query, (err, post) => {
		if (err) throw err;

		// Update Post Replies Number
		var incReply = post.numReplies;
		incReply++;

		var update = {
			$set: { numReplies: incReply }
		}

		postModel.findOneAndUpdate(query, update, {new:true}, (err, post) => {
			
		});

		incReply++;

		// Prepare post reply data
		var replyAuthorURL = req.session.username;
		var reply = {
			commentID: incReply,
			postTime: Date.now(),
			voteScore: '0',
			content: ta,
			authorUsername: req.session.username,
			authorURL: replyAuthorURL,
			authorIMG: req.session.img
		};

		console.log(reply);
		// Save and update post
		post.comments.push(reply);
		post.save(post);

		res.render('post', {
			session: req.session.username,
			name: req.session.name,
			url: req.session.url,
			post: post
		});
	});
};

exports.updateVoteScore = (req, res) => {

};

exports.loadUpdateComment = (req, res) => {
	var { url, comID } = req.body;
	var query = {
		url: url,
		"comments.commentID": comID
	};
	postModel.getOnePost(query, (err, post) => {
		if (err)
			throw err;
		else {
			var index = comID - 1;
			var replies = post.numReplies + 1;
			res.render('updateComment', {
				incReply: replies,
				session: req.session.username,
				content: post.comments[index].content,
				score: post.comments[index].voteScore,
				username: post.comments[index].authorUsername,
				name: req.session.name,
				url: url,
				post: post,
				commentID: comID,
			});
			
		}
	});
};

exports.updateComment = (req, res) => {
	var { url, newContent, comID } = req.body;
	var trueID = comID - 1;
	var query = {
		url: url,
	};
	var update = {
		$set: { "comments.$[element].content": newContent }
	};
	var filter = {
		arrayFilters: [ { "element.commentID": comID } ],
		new: true
	}

	postModel.updateComment(query, update, filter, (err, status) => {
		if (err)
			throw err;
		else {
			res.redirect('/');
		}
	});
};

exports.deletePost = (req, res) => {
	var query = {
		
	};
	console.log(query);
	postModel.deleteOne(query, (err, status) => {
		if (err) 
			throw err;
			
		res.redirect('/home');
	});
};
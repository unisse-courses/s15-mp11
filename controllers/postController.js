const postModel = require('../models/post');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

exports.createPost = (req, res) => {
	const errors = validationResult(req);
	const { title, category, content } = req.body;
	if (errors.isEmpty()) {
		postModel.getCount({}, (err, post) => {
			var count = post;
			console.log(count);
			var temp = 'post/';
      		temp += count;
			const newPost = {
				postID: count,
		        title: title,
		        category: category,
		        comments: [{
		        	commentID: 1,
		        	postTime: Date.now(),
				    voteScore: 0,
				    content: content,
				    authorUsername: req.session.username
		        }],
		        url: temp
		      };
			postModel.create(newPost, (err, post) => {
			    if (err) {
			      req.flash('error_msg', 'Could not create post. Please try again.');
			      res.redirect('/createPost');
			      console.log(err);
			      // res.status(500).send({ message: "Could not create user"});
			    } 
			    else {
			    	console.log(post);
			    	postModel.getAllPosts({}, (err1, posts) => {
						var postObjects = [];

						posts.forEach(function(doc) {
							postObjects.push(doc.toObject());
						});

						console.log('posts: '+postObjects);
						
						res.render('home', {
							session: req.session.username,
							sessionName: req.session.name,
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
			session: req.session.username,
			sessionName: req.session.name,
			posts: postObjects
		});
	});
};

exports.displaySpecificPost = (req, res) => {
	var { x } = req.body;
	var query = {
		postID: 19
	};
	req.session.viewPost = 18;
	postModel.getOnePost(query, (err, post) => {
		var incViews = post.numViews;
		incViews++;

		var update = {
			$set: { numViews: incViews }
		}

		postModel.findOneAndUpdate(query, update, {new:true}, (err, post1) => {
			console.log(post1);
		});

		res.render('post', {
			session: req.session.username,
			sessionName: req.session.name,
			post: post
		});
	});
};

exports.createReply = (req, res) => {
	var { ta } = req.body;
	var query = {
		postID: 19
	};
	console.log(ta);
	postModel.getOnePost(query, (err, post) => {
		if (err) throw err;
		console.log('post: '+post);
		var incReply = post.numReplies;
		incReply++;

		var update = {
			$set: { numReplies: incReply }
		}

		postModel.findOneAndUpdate(query, update, {new:true}, (err, post) => {
			
		});

		incReply++;

		var reply = {
			commentID: incReply,
			postTime: Date.now(),
			voteScore: '0',
			content: ta,
			authorUsername: req.session.username
		};

		post.comments.push(reply);
		post.save(post);

		res.render('home', {
			session: req.session.username,
			sessionName: req.session.name,
		});
	});
};
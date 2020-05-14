const postModel = require('../models/post');
const userModel = require('../models/user');
const commentModel = require('../models/comments');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

exports.createPost = (req, res) => {
	const errors = validationResult(req);
	const { postTitle, postCategory, content, picURL } = req.body;
	var imgPath = picURL;
	if (errors.isEmpty()) {
		postModel.getCount({}, (err, post) => {
			var count;
			if (post.length == 0) {
				count = 0;
			}
			else {
				count = post[0].postID;
			}
			count++;
			var temp = '/post/';
      		temp += count.toString();
      		const file = req.file;

      		if (file) {
      			imgPath = file.path;
      		}

      		//	Retrieve post creator's _id
      		userModel.getOne({ username: req.session.username }, (err, user) => {
      			const newComment = {
      				postURL: temp,
	      			content: content,
	      			author: user._id
	      		}

	      		commentModel.create(newComment, (err, comment) => {
	      			if (err) throw err;
	      			else {
	      				const newPost = {
							postID: count,
					        title: postTitle,
					        category: postCategory,
					        comments: [comment._id],
					        url: temp,
					        author: req.session.username,
					        img: imgPath
					    };

					    postModel.create(newPost, (err, post) => {
						    if (err) {
						      req.flash('error_msg', 'Could not create post. Please try again.');
						      res.redirect('/createPost');
						      //console.log(err);
						      // res.status(500).send({ message: "Could not create user"});
						    } 
						    else {
						    	postModel.getAllPosts({}, (err1, posts) => {
									var postObjects = [];

									posts.forEach(function(doc) {
										postObjects.push(doc.toObject());
									});

									// Increment post creator's number of posts
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
										name: req.session.username,
										session: req.session.username,
										url: req.session.url,
										img: req.session.img,
										posts: postObjects
									});
								});
						    }
					  	});
	      			}
	      		});

      		});
		});
	} 
	else {
	const messages = errors.array().map((item) => item.msg);

	req.flash('error_msg', messages.join(' '));

	postModel.getOne({ email: email }, (err, result) => {
	  if (result) {

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
			img: req.session.img,
			url: req.session.url,
			posts: postObjects
		});
	});
};

exports.displayByCategory = (req, res) => {
	var category = req.body.categoryFilter;
	
	if (category == 'all')
		var query = { };
	else {
		var query = { category: category };
	}

	postModel.getAllPosts(query, (err, posts) => {
		var postObjects = [];

		posts.forEach(function(doc) {
			postObjects.push(doc.toObject());
		});

		commentModel.getOne({}, (err, content) => {

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
			commentModel.getAllComments({ postURL: postURL }, (err, comments) => {
				if (err) throw err;
				else {
					var incViews = post.numViews;
					incViews++;

					var update = {
						$set: { numViews: incViews }
					}

					postModel.findOneAndUpdate(query, update, {new:true}, (err, post1) => {

					});

					if (req.session.user) {
						res.render('post', {
							name: req.session.username,
							session: req.session.username,
							url: req.session.url,
							img: req.session.img,
							post: post,
							comments: comments
						});
					}
					else {
						res.render('post', {
							post: post,
							comments: comments
						});
					}
				}
			});
		}
	});
};

exports.deletePost = (req, res) => {
	var query = {
		postID: req.params.id
	};

	postModel.getOnePost(query, (err, post) => {
		if (err) throw err;

		commentModel.delete({ postURL: post.url }, (err, status1) => {
			if (err) throw err;

			postModel.deleteOne(query, (err, status2) => {
				if (err) throw err;

				res.redirect('/');
			});
		});
	});
};

exports.deleteAllPost = (req, res) => {
	var query = {
		
	};

	postModel.deleteOne(query, (err, status) => {
		if (err) 
			throw err;

		else {
			commentModel.delete(query, (err, status1) => {
				if (err)
					throw err;

				res.redirect('/home');
			});
		}
	});
};

exports.search = (req, res) => {
	const { searchBox } = req.body;
	var userQuery = {
		$or: [ {username:{$regex: '.*' + searchBox + '.*'}}, {name:{$regex: '.*' + searchBox + '.*'}}, {groupTitle:{$regex: '.*' + searchBox + '.*'}}, {location:{$regex: '.*' + searchBox + '.*'}}, {email:{$regex: '.*' + searchBox + '.*'}} ]
	}
	var postQuery = {
		$or: [ {category:{$regex: '.*' + searchBox + '.*'}}, {title:{$regex: '.*' + searchBox + '.*'}}, {author:{$regex: '.*' + searchBox + '.*'}} ]
	}
	var commentQuery = {
		$or: [ {content:{$regex: '.*' + searchBox + '.*'}} ]
	}

	userModel.getAll(userQuery, (err, users) => {
		if (err) throw err;

		postModel.getAllPosts(postQuery, (err, posts) => {
			if (err) throw err;

			res.render('search', {
				users: users,
				posts: posts,
				search: searchBox,
				sessionID: req.session.user,
				session: req.session.username,
                url: req.session.url,
                img: req.session.img,
			});
		});
	});

	/*
	commentModel.getAllComments(commentQuery, (err, comments) => {
		if (err) throw err;

		comments.forEach(function(doc) {
			commentObjects.push(doc.toObject());
		});
		console.log(commentObjects);
	});
	*/

}
exports.isPrivate = (req, res, next) => {
  // Must be authenticated to go to the next function
  if (req.session.user) {
    return next();
  } 
  else {
    res.redirect('/login');
  }
};

exports.isPublic = (req, res, next) => {
  // If authenticated, go to home page
  if (req.session.user) {
    res.render('home', {
      session: req.session.username,
      name: req.session.name
    });
  } 
  else {
    return next();
  }
}

exports.isPrivatePost = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  else {
    res.render('post', {

    });
  }
};

exports.isPublicPost = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  else {
    res.redirect('post');
  }
};

exports.isPrivateProfile = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  else {
    res.render('overview', {

    });
  }
};

exports.isPublicProfile = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  else {
    res.redirect('xxxxxxxx');
  }
};
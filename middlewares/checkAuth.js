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
      name: req.session.name,
      img: req.session.img,
      url: req.session.url
    });
  } 
  else {
    return next();
  }
}
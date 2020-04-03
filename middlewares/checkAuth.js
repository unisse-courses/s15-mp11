exports.isPrivate = (req, res, next) => {
  // Must be authenticated to go to the next function
  if (req.session.user) {
    return next()
  } else {
    res.redirect('/login');
  }
};

exports.isPublic = (req, res, next) => {
  // If authenticated, go to home page
  if (req.session.user) {
    res.render('home', {
      session: 'admin'
    });
     console.log('2');
  } else {
    return next();
    console.log('1');
  }
}
function isSignedIn(req, res, next) {
    if (req.session.user) return next(); // if they are logged in, proceed as normal
    res.redirect("/auth/sign-in");
  }
  
  module.exports = isSignedIn;
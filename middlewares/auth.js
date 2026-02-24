/** Redirect til /login hvis bruker ikke er innlogget – brukes på beskyttede ruter */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }
  next();
}

module.exports = { requireAuth };

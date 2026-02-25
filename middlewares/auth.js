/** Redirect til /login hvis bruker ikke er innlogget – brukes på beskyttede ruter */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }
  next();
}

/** Redirect til / hvis bruker ikke er admin – brukes på admin-ruter */
function requireAdmin(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }
  if (req.session.user.role !== 'admin') {
    return res.redirect('/');
  }
  next();
}

module.exports = { requireAuth, requireAdmin };

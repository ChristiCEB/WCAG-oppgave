// Sender deg til innlogging hvis du ikke er logget inn
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }
  next();
}

// Kun for admin – andre sendes til forsiden
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

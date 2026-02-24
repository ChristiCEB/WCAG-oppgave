const bcrypt = require('bcryptjs');
const User = require('../models/User');

/** Vis registreringsskjema (kun for uinnloggede) */
function getRegister(req, res) {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('register', { title: 'Registrer deg', feil: null });
}

async function postRegister(req, res) {
  if (req.session.user) {
    return res.redirect('/');
  }
  const { username, password, bekreftPassord } = req.body;
  const feil = [];

  // Servervalidering – obligatoriske felt og regler
  if (!username || typeof username !== 'string' || !username.trim()) {
    feil.push('Brukernavn er påkrevd.');
  }
  if (!password) {
    feil.push('Passord er påkrevd.');
  } else if (password.length < 6) {
    feil.push('Passord må være minst 6 tegn.');
  }
  if (password !== bekreftPassord) {
    feil.push('Passordene stemmer ikke overens.');
  }

  if (feil.length > 0) {
    return res.render('register', { title: 'Registrer deg', feil, username: username ? username.trim() : '' });
  }

  try {
    const finnes = await User.findOne({ username: username.trim().toLowerCase() });
    if (finnes) {
      feil.push('Brukernavnet er allerede tatt.');
      return res.render('register', { title: 'Registrer deg', feil, username: username.trim() });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username.trim().toLowerCase(),
      passwordHash,
      role: 'user'
    });

    req.session.user = { id: user._id, username: user.username, role: user.role };
    req.session.save((err) => {
      if (err) {
        console.error(err);
        return res.redirect('/register');
      }
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    feil.push('Noe gikk galt. Prøv igjen.');
    res.render('register', { title: 'Registrer deg', feil, username: username ? username.trim() : '' });
  }
}

function getLogin(req, res) {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('login', { title: 'Logg inn', feil: null });
}

async function postLogin(req, res) {
  if (req.session.user) {
    return res.redirect('/');
  }
  const { username, password } = req.body;
  const feil = [];

  if (!username || typeof username !== 'string' || !username.trim()) {
    feil.push('Brukernavn er påkrevd.');
  }
  if (!password) {
    feil.push('Passord er påkrevd.');
  }

  if (feil.length > 0) {
    return res.render('login', { title: 'Logg inn', feil });
  }

  try {
    const user = await User.findOne({ username: username.trim().toLowerCase() });
    if (!user || !(await user.sjekkPassord(password))) {
      feil.push('Ugyldig brukernavn eller passord.');
      return res.render('login', { title: 'Logg inn', feil });
    }

    req.session.user = { id: user._id, username: user.username, role: user.role };
    req.session.save((err) => {
      if (err) {
        console.error(err);
        return res.redirect('/login');
      }
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    feil.push('Noe gikk galt. Prøv igjen.');
    res.render('login', { title: 'Logg inn', feil });
  }
}

function postLogout(req, res) {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect('/');
  });
}

module.exports = {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  postLogout
};

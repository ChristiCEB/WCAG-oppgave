const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const { requireAuth } = require('../middlewares/auth');

router.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('register', { title: 'Registrer deg', feil: null });
});

router.post('/register', async (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  const { username, password, bekreftPassord } = req.body;
  const feil = [];

  if (!username || !username.trim()) {
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
});

router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('login', { title: 'Logg inn', feil: null });
});

router.post('/login', async (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  const { username, password } = req.body;
  const feil = [];

  if (!username || !username.trim()) {
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
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect('/');
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Site = require('../models/Site');
const Review = require('../models/Review');

router.get('/', async (req, res) => {
  try {
    const sites = await Site.find().sort({ createdAt: -1 });
    res.render('index', { title: 'Nettsteder', sites });
  } catch (err) {
    console.error(err);
    res.status(500).send('Noe gikk galt ved henting av nettsteder.');
  }
});

router.get('/sites/:id', async (req, res) => {
  try {
    const site = await Site.findById(req.params.id);
    if (!site) {
      return res.status(404).send('Nettstedet ble ikke funnet.');
    }
    const reviews = await Review.find({ site: site._id }).populate('user', 'username').sort({ createdAt: -1 });
    const scores = reviews.map(r => r.wcagScore);
    const averageScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
    res.render('site-details', { title: site.title, site, reviews, averageScore });
  } catch (err) {
    console.error(err);
    res.status(500).send('Noe gikk galt.');
  }
});

module.exports = router;

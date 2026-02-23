const express = require('express');
const router = express.Router();
const Site = require('../models/Site');

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
    res.render('site-details', { title: site.title, site });
  } catch (err) {
    console.error(err);
    res.status(500).send('Noe gikk galt.');
  }
});

module.exports = router;

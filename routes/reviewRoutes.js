const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Site = require('../models/Site');
const { requireAuth } = require('../middlewares/auth');

router.post('/sites/:siteId/reviews', requireAuth, async (req, res) => {
  const { siteId } = req.params;
  const { wcagScore, summary, details } = req.body;
  const feil = [];

  if (!wcagScore || wcagScore < 1 || wcagScore > 5) {
    feil.push('Vurdering må være mellom 1 og 5.');
  }
  if (!summary || !summary.trim()) {
    feil.push('Kort oppsummering er påkrevd.');
  }

  try {
    const site = await Site.findById(siteId);
    if (!site) {
      return res.status(404).send('Nettstedet ble ikke funnet.');
    }

    if (feil.length > 0) {
      const reviews = await Review.find({ site: siteId }).populate('user', 'username').sort({ createdAt: -1 });
      const scores = reviews.map(r => r.wcagScore);
      const averageScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
      return res.render('site-details', {
        title: site.title,
        site,
        reviews,
        averageScore,
        feil,
        formData: { wcagScore, summary, details: details || '' }
      });
    }

    await Review.create({
      site: siteId,
      user: req.session.user.id,
      wcagScore: Number(wcagScore),
      summary: summary.trim(),
      details: (details || '').trim()
    });

    res.redirect(`/sites/${siteId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Noe gikk galt ved lagring av vurdering.');
  }
});

module.exports = router;

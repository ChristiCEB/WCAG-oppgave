const Review = require('../models/Review');
const ReviewVote = require('../models/ReviewVote');
const Site = require('../models/Site');
const { buildVoteData } = require('./siteController');

async function postCreateReview(req, res) {
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
      const reviews = await Review.find({ site: siteId }).populate('user', 'username');
      const scores = reviews.map(r => r.wcagScore);
      const averageScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
      const voteData = await buildVoteData(reviews.map(r => r._id), req.session?.user?.id);
      reviews.sort((a, b) => {
        const sumA = (voteData[a._id.toString()]?.sum ?? 0);
        const sumB = (voteData[b._id.toString()]?.sum ?? 0);
        if (sumB !== sumA) return sumB - sumA;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      return res.render('site-details', {
        title: site.title,
        site,
        reviews,
        averageScore,
        voteData,
        reviewSort: 'nyttighet',
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
}

async function postVote(req, res) {
  const { reviewId } = req.params;
  const vote = Number(req.body.vote);
  const userId = req.session.user.id;

  if (vote !== 1 && vote !== -1) {
    return res.redirect('back');
  }

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).send('Vurderingen ble ikke funnet.');
    }
    if (review.user.toString() === userId.toString()) {
      return res.redirect(`/sites/${review.site}`);
    }

    await ReviewVote.findOneAndUpdate(
      { review: reviewId, user: userId },
      { vote, createdAt: new Date() },
      { upsert: true, new: true }
    );
    res.redirect(`/sites/${review.site}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Noe gikk galt.');
  }
}

module.exports = {
  postCreateReview,
  postVote
};

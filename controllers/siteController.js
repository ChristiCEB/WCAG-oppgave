const Site = require('../models/Site');
const Review = require('../models/Review');
const ReviewVote = require('../models/ReviewVote');

async function buildVoteData(reviewIds, currentUserId) {
  if (!reviewIds.length) return {};
  const votes = await ReviewVote.find({ review: { $in: reviewIds } });
  const byReview = {};
  for (const id of reviewIds) {
    const idStr = id.toString();
    const revVotes = votes.filter(v => v.review.toString() === idStr);
    byReview[idStr] = {
      sum: revVotes.reduce((a, v) => a + v.vote, 0),
      userVote: currentUserId
        ? (revVotes.find(v => v.user.toString() === currentUserId.toString())?.vote ?? null)
        : null
    };
  }
  return byReview;
}

/** Forside: liste over nettsteder med antall vurderinger og snitt, sortert */
async function getIndex(req, res) {
  try {
    const sites = await Site.find();
    const stats = await Review.aggregate([
      { $group: { _id: '$site', count: { $sum: 1 }, avgScore: { $avg: '$wcagScore' } } }
    ]);
    const statsMap = {};
    stats.forEach(s => {
      statsMap[s._id.toString()] = { reviewCount: s.count, averageScore: (s.avgScore).toFixed(1) };
    });
    const sitesWithStats = sites.map(s => ({
      ...s.toObject(),
      reviewCount: statsMap[s._id.toString()]?.reviewCount ?? 0,
      averageScore: statsMap[s._id.toString()]?.averageScore ?? null
    }));
    const sortBy = req.query.sort === 'antall' ? 'antall' : 'score';
    if (sortBy === 'antall') {
      sitesWithStats.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else {
      sitesWithStats.sort((a, b) => (parseFloat(b.averageScore) || 0) - (parseFloat(a.averageScore) || 0));
    }
    res.render('index', { title: 'Nettsteder', sites: sitesWithStats, siteSort: sortBy });
  } catch (err) {
    console.error(err);
    res.status(500).send('Noe gikk galt ved henting av nettsteder.');
  }
}

/** Detaljside for ett nettsted: vurderinger, stemmer, sortering */
async function getSiteDetails(req, res) {
  try {
    const site = await Site.findById(req.params.id);
    if (!site) {
      return res.status(404).send('Nettstedet ble ikke funnet.');
    }
    const reviews = await Review.find({ site: site._id }).populate('user', 'username');
    const scores = reviews.map(r => r.wcagScore);
    const averageScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
    const voteData = await buildVoteData(reviews.map(r => r._id), req.session?.user?.id);
    const reviewSort = req.query.sort === 'nyeste' ? 'nyeste' : 'nyttighet';
    if (reviewSort === 'nyeste') {
      reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      reviews.sort((a, b) => {
        const sumA = (voteData[a._id.toString()]?.sum ?? 0);
        const sumB = (voteData[b._id.toString()]?.sum ?? 0);
        if (sumB !== sumA) return sumB - sumA;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }
    res.render('site-details', { title: site.title, site, reviews, averageScore, voteData, reviewSort });
  } catch (err) {
    console.error(err);
    res.status(500).send('Noe gikk galt.');
  }
}

/** Hjelpeside (FAQ) – forklarer bruk av løsningen */
function getFaq(req, res) {
  res.render('help', { title: 'Hjelp' });
}

module.exports = {
  getIndex,
  getSiteDetails,
  getFaq,
  buildVoteData
};

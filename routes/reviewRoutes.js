const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const reviewController = require('../controllers/reviewController');

router.post('/sites/:siteId/reviews', requireAuth, reviewController.postCreateReview);
router.post('/reviews/:reviewId/vote', requireAuth, reviewController.postVote);

module.exports = router;

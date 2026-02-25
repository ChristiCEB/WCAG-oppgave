const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const reviewController = require('../controllers/reviewController');

router.post('/sites/:siteId/reviews', requireAuth, reviewController.postCreateReview);
router.post('/reviews/:reviewId/vote', requireAuth, reviewController.postVote);
router.get('/reviews/:reviewId/report', reviewController.getReportForm);
router.post('/reviews/:reviewId/report', reviewController.postReport);

module.exports = router;

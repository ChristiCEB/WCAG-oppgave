const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');

router.get('/', siteController.getIndex);
router.get('/faq', siteController.getFaq);
router.get('/sites/:id', siteController.getSiteDetails);

module.exports = router;

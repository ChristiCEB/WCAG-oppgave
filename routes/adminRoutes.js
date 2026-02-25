const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middlewares/auth');
const adminController = require('../controllers/adminController');

router.get('/admin/reports', requireAdmin, adminController.getReports);

module.exports = router;

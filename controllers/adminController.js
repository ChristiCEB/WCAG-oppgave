const Report = require('../models/Report');

/** Admin-side: liste over rapporterte vurderinger */
async function getReports(req, res) {
  try {
    const reports = await Report.find()
      .populate({
        path: 'review',
        populate: [
          { path: 'site', select: 'title url' },
          { path: 'user', select: 'username' }
        ]
      })
      .populate('reportedBy', 'username')
      .sort({ createdAt: -1 });
    res.render('admin/reports', { title: 'Rapporter', reports });
  } catch (err) {
    console.error(err);
    res.status(500).send('Noe gikk galt.');
  }
}

module.exports = {
  getReports
};

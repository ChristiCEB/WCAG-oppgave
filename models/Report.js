const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  comment: { type: String, required: true, trim: true },
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);

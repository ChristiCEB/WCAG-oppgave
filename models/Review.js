const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wcagScore: { type: Number, required: true, min: 1, max: 5 },
  summary: { type: String, required: true, trim: true },
  details: { type: String, trim: true, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);

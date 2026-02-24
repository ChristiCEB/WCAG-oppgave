const mongoose = require('mongoose');

const reviewVoteSchema = new mongoose.Schema({
  review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vote: { type: Number, required: true, enum: [1, -1] },
  createdAt: { type: Date, default: Date.now }
});

reviewVoteSchema.index({ review: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('ReviewVote', reviewVoteSchema);

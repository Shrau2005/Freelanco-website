const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  aptitudeScore: {
    type: Number,
    default: 0
  },
  codingScore: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Score', scoreSchema); 
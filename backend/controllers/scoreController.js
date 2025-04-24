const Score = require('../models/Score');

// Get all scores
exports.getAllScores = async (req, res) => {
  try {
    const scores = await Score.find().sort({ totalScore: -1 });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get score by username
exports.getScoreByUsername = async (req, res) => {
  try {
    const score = await Score.findOne({ username: req.params.username });
    if (!score) {
      return res.status(404).json({ message: 'Score not found' });
    }
    res.json(score);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update scores
exports.updateScores = async (req, res) => {
  try {
    const { username, aptitudeScore, codingScore } = req.body;
    const totalScore = aptitudeScore + codingScore;

    const score = await Score.findOneAndUpdate(
      { username },
      { aptitudeScore, codingScore, totalScore },
      { new: true, upsert: true }
    );

    res.json(score);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 
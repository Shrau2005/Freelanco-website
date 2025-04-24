const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all freelancers
router.get('/freelancers', async (req, res) => {
  try {
    const freelancers = await User.find({ userType: 'freelancer' })
      .select('-password -__v');
    res.json(freelancers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching freelancers', error: error.message });
  }
});

// Get all companies
router.get('/companies', async (req, res) => {
  try {
    const companies = await User.find({ userType: 'company' })
      .select('-password -__v');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching companies', error: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { skills, requiredSkills, location } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.userType === 'freelancer') {
      user.skills = skills ? skills.split(',').map(skill => skill.trim()) : user.skills;
    } else {
      user.requiredSkills = requiredSkills ? requiredSkills.split(',').map(skill => skill.trim()) : user.requiredSkills;
      user.location = location || user.location;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

module.exports = router; 
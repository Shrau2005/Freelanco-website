const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

// Company routes
router.post('/assign', auth, projectController.assignProject);
router.get('/company', auth, projectController.getCompanyProjects);

// Freelancer routes
router.get('/freelancer', auth, projectController.getFreelancerProjects);

// Shared routes
router.put('/:projectId/status', auth, projectController.updateProjectStatus);
router.put('/:projectId/milestones/:milestoneIndex', auth, projectController.updateMilestoneStatus);

module.exports = router; 
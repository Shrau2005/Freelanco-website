const Project = require('../models/Project');
const User = require('../models/User');

// Assign a project to a freelancer
exports.assignProject = async (req, res) => {
  try {
    const { title, description, freelancerUsername, totalAmount, milestones, startDate, deadline } = req.body;
    const companyId = req.user._id;

    // Validate required fields
    if (!title || !description || !freelancerUsername || !totalAmount || !milestones || !startDate || !deadline) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find the freelancer
    const freelancer = await User.findOne({ username: freelancerUsername, userType: 'freelancer' });
    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    // Create the project
    const project = new Project({
      title,
      description,
      companyId,
      freelancerId: freelancer._id,
      freelancerUsername,
      totalAmount,
      amountPaid: 0,
      amountRemaining: totalAmount,
      milestones,
      startDate,
      deadline,
      status: 'pending'
    });

    await project.save();
    res.status(201).json({
      message: 'Project assigned successfully',
      project
    });
  } catch (error) {
    console.error('Error assigning project:', error);
    res.status(500).json({ message: error.message || 'Failed to assign project. Please try again.' });
  }
};

// Get all projects for a company
exports.getCompanyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ companyId: req.user._id })
      .populate('freelancerId', 'username email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all projects for a freelancer
exports.getFreelancerProjects = async (req, res) => {
  try {
    const projects = await Project.find({ freelancerId: req.user._id })
      .populate('companyId', 'username email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update project status
exports.updateProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has permission to update status
    if (project.companyId.toString() !== req.user._id.toString() && 
        project.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    project.status = status;
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update milestone status
exports.updateMilestoneStatus = async (req, res) => {
  try {
    const { projectId, milestoneIndex } = req.params;
    const { isCompleted } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has permission to update milestone
    if (project.companyId.toString() !== req.user._id.toString() && 
        project.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this milestone' });
    }

    if (milestoneIndex >= project.milestones.length) {
      return res.status(400).json({ message: 'Invalid milestone index' });
    }

    const milestone = project.milestones[milestoneIndex];
    milestone.isCompleted = isCompleted;

    // Update amount remaining
    if (isCompleted) {
      project.amountRemaining -= milestone.amount;
    } else {
      project.amountRemaining += milestone.amount;
    }

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 
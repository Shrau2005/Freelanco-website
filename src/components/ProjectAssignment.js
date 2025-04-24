import React, { useState } from 'react';
import './ProjectAssignment.css';

function ProjectAssignment({ freelancer, onClose, onAssign }) {
  const [projectDetails, setProjectDetails] = useState({
    title: '',
    description: '',
    totalAmount: '',
    milestones: [
      { name: 'Planning & Design', percentage: 25, completed: false },
      { name: 'Development', percentage: 25, completed: false },
      { name: 'Testing', percentage: 25, completed: false },
      { name: 'Deployment', percentage: 25, completed: false }
    ],
    startDate: '',
    deadline: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in again. Your session has expired.');
      return;
    }
    
    // Calculate total amount for each milestone
    const totalAmount = parseFloat(projectDetails.totalAmount);
    const milestonesWithAmount = projectDetails.milestones.map(milestone => ({
      description: milestone.name,
      amount: (totalAmount * milestone.percentage) / 100,
      isCompleted: false
    }));

    const projectData = {
      title: projectDetails.title,
      description: projectDetails.description,
      freelancerUsername: freelancer.username,
      totalAmount: totalAmount,
      milestones: milestonesWithAmount,
      startDate: projectDetails.startDate,
      deadline: projectDetails.deadline
    };

    try {
      // Save project to database
      const response = await fetch('http://localhost:5000/api/projects/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error response:', data);
        throw new Error(data.message || 'Failed to assign project');
      }

      // Show success message
      alert(`Project "${data.project.title}" has been assigned to ${freelancer.username}`);
      
      // Close the modal and notify parent
      onAssign(data.project);
      onClose();
    } catch (error) {
      console.error('Error assigning project:', error);
      alert(error.message || 'Failed to assign project. Please try again.');
    }
  };

  return (
    <div className="project-assignment-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Assign Project to {freelancer.username}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Project Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={projectDetails.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Project Description</label>
            <textarea
              id="description"
              name="description"
              value={projectDetails.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="totalAmount">Total Project Amount ($)</label>
            <input
              type="number"
              id="totalAmount"
              name="totalAmount"
              value={projectDetails.totalAmount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="milestones-section">
            <h3>Project Milestones</h3>
            <div className="milestones-list">
              {projectDetails.milestones.map((milestone, index) => (
                <div key={index} className="milestone-item">
                  <span className="milestone-name">{milestone.name}</span>
                  <span className="milestone-percentage">{milestone.percentage}%</span>
                  <span className="milestone-amount">
                    ${(parseFloat(projectDetails.totalAmount || 0) * milestone.percentage / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={projectDetails.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Deadline</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={projectDetails.deadline}
              onChange={handleChange}
              required
            />
          </div>

          <div className="payment-info">
            <h3>Payment Information</h3>
            <p>Total amount will be held by the website and released to the freelancer based on milestone completion.</p>
            <p>Uncompleted milestone amounts will be refunded to the company.</p>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="assign-button">Assign Project</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectAssignment; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectAssignment from './ProjectAssignment';
import './CompanyDashboard.css';

function CompanyDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [activeTab, setActiveTab] = useState('freelancers'); // 'freelancers' or 'projects'
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('score'); // 'score', 'name', 'date'

  // Separate the fetch function from useEffect
  const fetchFreelancers = async (token) => {
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/scores', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch freelancer data');
      }
      
      const data = await response.json();
      // Sort freelancers by total score in descending order
      const sortedFreelancers = data.sort((a, b) => b.totalScore - a.totalScore);
      setFreelancers(sortedFreelancers);
    } catch (error) {
      console.error('Error fetching freelancers:', error);
      setError(error.message || 'Failed to load freelancer data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/projects/company', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects. Please try again later.');
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!userData || !token || userData.userType !== 'company') {
      navigate('/login', { replace: true });
      return;
    }

    setUser(userData);
    setLoading(true);
    setError('');
    fetchFreelancers(token);
    fetchProjects(token);

    // Refresh data every 5 minutes
    const interval = setInterval(() => {
      fetchFreelancers(token);
      fetchProjects(token);
    }, 300000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    try {
      // Clear all localStorage items
      localStorage.clear();
      // Force a hard redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback to navigate if window.location fails
      navigate('/login', { replace: true });
    }
  };

  const handleAssignProject = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setShowProjectModal(true);
  };

  const handleProjectAssigned = (projectData) => {
    setShowProjectModal(false);
    setSelectedFreelancer(null);
    // Refresh projects list
    fetchProjects(localStorage.getItem('token'));
  };

  const handleViewProfile = (freelancerId) => {
    // Find the freelancer from the list
    const freelancer = freelancers.find(f => f._id === freelancerId);
    if (freelancer) {
      // Navigate to the freelancer's profile page
      navigate(`/freelancer-profile/${freelancerId}`, {
        state: { freelancer }
      });
    }
  };

  const filteredFreelancers = freelancers
    .filter(freelancer => 
      freelancer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.skills?.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.username.localeCompare(b.username);
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return b.totalScore - a.totalScore;
      }
    });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="company-dashboard">
      <header className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome, {user.username}!</h1>
          <p className="subtitle">Manage your projects and find top talent</p>
        </div>
        <div className="header-actions">
          <div className="stats-card">
            <h2>Total Freelancers</h2>
            <div className="stats-value">{freelancers.length}</div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'freelancers' ? 'active' : ''}`}
          onClick={() => setActiveTab('freelancers')}
        >
          Freelancers
        </button>
        <button 
          className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
      </div>

      {activeTab === 'freelancers' && (
        <div className="freelancers-section">
          <div className="search-sort-container">
            <input
              type="text"
              placeholder="Search freelancers by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="score">Sort by Score</option>
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>

          <div className="freelancers-grid">
            {filteredFreelancers.map((freelancer) => (
              <div key={freelancer._id} className="freelancer-card">
                <div className="freelancer-header">
                  <h3>{freelancer.username}</h3>
                  <span className={`status-badge ${freelancer.status}`}>
                    {freelancer.status}
                  </span>
                </div>
                <div className="freelancer-details">
                  <div className="detail-item">
                    <span>Email</span>
                    <span>{freelancer.email}</span>
                  </div>
                  <div className="detail-item">
                    <span>Total Score</span>
                    <span>{freelancer.totalScore || 0}</span>
                  </div>
                  <div className="detail-item">
                    <span>Aptitude Score</span>
                    <span>{freelancer.aptitudeScore || 0}</span>
                  </div>
                  <div className="detail-item">
                    <span>Coding Score</span>
                    <span>{freelancer.codingScore || 0}</span>
                  </div>
                </div>
                <div className="freelancer-actions">
                  <button
                    className="action-button assign"
                    onClick={() => handleAssignProject(freelancer._id)}
                  >
                    Assign Project
                  </button>
                  <button
                    className="action-button view"
                    onClick={() => handleViewProfile(freelancer._id)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="projects-section">
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project._id} className="project-card">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <span className={`status-badge ${project.status}`}>
                    {project.status}
                  </span>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-details">
                  <div className="detail-item">
                    <span>Assigned to:</span>
                    <span>{project.freelancerUsername}</span>
                  </div>
                  <div className="detail-item">
                    <span>Budget:</span>
                    <span>${project.totalAmount}</span>
                  </div>
                  <div className="detail-item">
                    <span>Deadline:</span>
                    <span>{new Date(project.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="milestones-section">
                  <h4>Milestones</h4>
                  <div className="milestones-list">
                    {project.milestones.map((milestone, index) => (
                      <div key={index} className="milestone-item">
                        <div className="milestone-info">
                          <span>Milestone {index + 1}</span>
                          <span>${milestone.amount}</span>
                        </div>
                        <div className={`milestone-status ${milestone.isCompleted ? 'completed' : 'pending'}`}>
                          {milestone.isCompleted ? 'Completed' : 'Pending'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showProjectModal && (
        <ProjectAssignment
          freelancer={selectedFreelancer}
          onClose={() => {
            setShowProjectModal(false);
            setSelectedFreelancer(null);
          }}
          onAssign={handleProjectAssigned}
        />
      )}
    </div>
  );
}

export default CompanyDashboard; 
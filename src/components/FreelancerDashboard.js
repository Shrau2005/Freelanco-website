import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FreelancerDashboard.css';

function FreelancerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [aptitudeScore, setAptitudeScore] = useState(0);
  const [codingScore, setCodingScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('deadline');

  useEffect(() => {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.userType !== 'freelancer') {
      navigate('/login');
      return;
    }
    setUser(userData);

    // Fetch user's scores
    const fetchScores = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/scores/${userData.username}`);
        if (response.ok) {
          const data = await response.json();
          setAptitudeScore(data.aptitudeScore);
          setCodingScore(data.codingScore);
          setTotalScore(data.totalScore);
        }
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    // Fetch user's projects
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/projects/freelancer', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
    fetchProjects();
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

  const handleAptitudeSubmit = async (score) => {
    try {
      const response = await fetch('http://localhost:5000/api/scores/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          username: user.username,
          aptitudeScore: score,
          codingScore: codingScore
        }),
      });

      if (response.ok) {
        setAptitudeScore(score);
        setTotalScore(score + codingScore);
      }
    } catch (error) {
      console.error('Error updating aptitude score:', error);
    }
  };

  const handleCodingSubmit = async (score) => {
    try {
      const response = await fetch('http://localhost:5000/api/scores/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          username: user.username,
          aptitudeScore: aptitudeScore,
          codingScore: score
        }),
      });

      if (response.ok) {
        setCodingScore(score);
        setTotalScore(aptitudeScore + score);
      }
    } catch (error) {
      console.error('Error updating coding score:', error);
    }
  };

  const handleMilestoneUpdate = async (projectId, milestoneIndex) => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}/milestones/${milestoneIndex}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          isCompleted: true
        }),
      });

      if (response.ok) {
        // Refresh projects list
        const updatedProjects = await fetch('http://localhost:5000/api/projects/freelancer', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (updatedProjects.ok) {
          const data = await updatedProjects.json();
          setProjects(data);
        }
      }
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  const filteredProjects = projects
    .filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.deadline) - new Date(b.deadline);
        case 'amount':
          return b.totalAmount - a.totalAmount;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return new Date(a.deadline) - new Date(b.deadline);
      }
    });

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="freelancer-dashboard">
      <header className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome, {user.username}!</h1>
          <p className="subtitle">Your Freelancer Dashboard</p>
        </div>
        <div className="header-actions">
          <div className="score-card">
            <h2>Total Score</h2>
            <div className="score-value">{totalScore}</div>
            <div className="score-breakdown">
              <span>Aptitude: {aptitudeScore}</span>
              <span>Coding: {codingScore}</span>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          My Projects
        </button>
        <button 
          className={`tab ${activeTab === 'round1' ? 'active' : ''}`}
          onClick={() => setActiveTab('round1')}
        >
          Round 1: Aptitude
        </button>
        <button 
          className={`tab ${activeTab === 'round2' ? 'active' : ''}`}
          onClick={() => setActiveTab('round2')}
        >
          Round 2: Coding
        </button>
      </div>

      {activeTab === 'projects' && (
        <div className="projects-section">
          <div className="search-sort-container">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="amount">Sort by Amount</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="no-projects">
              <div className="empty-state">
                <h2>No Projects Found</h2>
                <p>You haven't been assigned any projects yet. Keep working on your skills!</p>
              </div>
            </div>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map((project) => (
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
                      <span>Budget</span>
                      <span>${project.totalAmount}</span>
                    </div>
                    <div className="detail-item">
                      <span>Remaining</span>
                      <span>${project.amountRemaining}</span>
                    </div>
                    <div className="detail-item">
                      <span>Deadline</span>
                      <span>{new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-label">Project Progress</div>
                    <div className="progress-track">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${(project.milestones.filter(m => m.isCompleted).length / project.milestones.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="progress-value">
                      {Math.round((project.milestones.filter(m => m.isCompleted).length / project.milestones.length) * 100)}%
                    </div>
                  </div>
                  <div className="milestones-section">
                    <h4>Project Milestones</h4>
                    <div className="milestones-list">
                      {project.milestones.map((milestone, index) => (
                        <div key={index} className="milestone-item">
                          <div className="milestone-info">
                            <span className="milestone-name">Milestone {index + 1}</span>
                            <span className="milestone-amount">${milestone.amount}</span>
                          </div>
                          <div className="milestone-status">
                            {milestone.isCompleted ? (
                              <span className="completed">Completed</span>
                            ) : (
                              <button
                                className="complete-button"
                                onClick={() => handleMilestoneUpdate(project._id, index)}
                              >
                                Mark as Complete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'round1' && (
        <div className="round-container">
          <div className="round-header">
            <h2>Round 1: Aptitude Test</h2>
            <p>Complete the aptitude test to showcase your problem-solving skills</p>
          </div>
          <div className="test-container">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSc83So5TTi4c3lPCu-ZXwAESgon961ryZ_V9DDn4ZxiA652wg/viewform?embedded=true"
              width="100%"
              height="500"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              title="Aptitude Test"
            >
              Loading...
            </iframe>
            <div className="score-input">
              <input
                type="number"
                placeholder="Enter your aptitude score"
                onChange={(e) => handleAptitudeSubmit(parseInt(e.target.value))}
              />
              <button className="submit-score">Submit Score</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'round2' && (
        <div className="round-container">
          <div className="round-header">
            <h2>Round 2: Coding Test</h2>
            <p>Solve coding challenges to demonstrate your technical skills</p>
          </div>
          <div className="test-container">
            <a 
              href="https://www.hackerrank.com/contests/coding-round-1745126852/challenges"
              target="_blank"
              rel="noopener noreferrer"
              className="hackerrank-link"
            >
              Go to HackerRank Contest
            </a>
            <div className="score-input">
              <input
                type="number"
                placeholder="Enter your HackerRank score"
                onChange={(e) => handleCodingSubmit(parseInt(e.target.value))}
              />
              <button className="submit-score">Submit Score</button>
            </div>
          </div>
        </div>
      )}

      <div className="progress-section">
        <h2>Your Progress</h2>
        <div className="progress-bars">
          <div className="progress-bar">
            <div className="progress-label">Aptitude Test</div>
            <div className="progress-track">
              <div 
                className="progress-fill" 
                style={{ width: `${(aptitudeScore / 100) * 100}%` }}
              ></div>
            </div>
            <div className="progress-value">{aptitudeScore}%</div>
          </div>
          <div className="progress-bar">
            <div className="progress-label">Coding Test</div>
            <div className="progress-track">
              <div 
                className="progress-fill" 
                style={{ width: `${(codingScore / 100) * 100}%` }}
              ></div>
            </div>
            <div className="progress-value">{codingScore}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreelancerDashboard; 
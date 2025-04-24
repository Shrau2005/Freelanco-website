import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FreelancerSignup.css';

function FreelancerSignup() {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, email } = location.state || {};
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    skills: '',
    resume: null
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const userData = {
        username,
        email,
        password: formData.password,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        userType: 'freelancer'
      };

      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sign up');
      }

      const data = await response.json();

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data));

      // Redirect to freelancer dashboard
      navigate('/dashboard/freelancer', { state: { username: data.username } });
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="freelancer-signup-container">
      <div className="freelancer-signup-form">
        <h2>Complete Your Freelancer Profile</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="skills">Skills (comma separated)</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, Python"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="resume">Upload Resume (PDF)</label>
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf"
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FreelancerSignup; 
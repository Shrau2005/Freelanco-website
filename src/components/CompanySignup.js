import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CompanySignup.css';

function CompanySignup() {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, email } = location.state || {};
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    requiredSkills: '',
    location: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const companyData = {
        username,
        email,
        password: formData.password,
        requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()),
        location: formData.location,
        userType: 'company'
      };

      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data));

      // Redirect to company dashboard
      navigate('/dashboard/company', { state: { username: data.username } });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="company-signup-container">
      <div className="company-signup-form">
        <h2>Complete Your Company Profile</h2>
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
            <label htmlFor="requiredSkills">Required Skills (comma separated)</label>
            <input
              type="text"
              id="requiredSkills"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, Python"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., New York, USA"
              required
            />
          </div>

          <button type="submit" className="submit-button">Complete Registration</button>
        </form>
      </div>
    </div>
  );
}

export default CompanySignup; 
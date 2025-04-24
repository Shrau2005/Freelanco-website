import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    userType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.userType === 'freelancer') {
      navigate('/signup/freelancer', { state: formData });
    } else if (formData.userType === 'company') {
      navigate('/signup/company', { state: formData });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>I am a</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="freelancer"
                  checked={formData.userType === 'freelancer'}
                  onChange={handleChange}
                  required
                />
                Freelancer
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="company"
                  checked={formData.userType === 'company'}
                  onChange={handleChange}
                  required
                />
                Company
              </label>
            </div>
          </div>
          
          <button type="submit" className="submit-button">Continue</button>
        </form>
      </div>
    </div>
  );
}

export default Signup; 
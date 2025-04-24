import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Freelanco</h1>
          <p>Connecting talented freelancers with innovative companies</p>
          <div className="cta-buttons">
            <Link to="/signup" className="cta-button primary-cta">Get Started</Link>
            <Link to="/login" className="cta-button secondary-cta">Login</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3>Secure Platform</h3>
            <p>Your data and transactions are protected with industry-leading security measures.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3>Fast Matching</h3>
            <p>Find the perfect match for your project or skills in minutes, not days.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3>Real-time Analytics</h3>
            <p>Track your progress and performance with detailed analytics and insights.</p>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              "Freelanco has transformed how we find and work with freelancers. The platform is intuitive and the quality of talent is exceptional."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="John Doe" />
              </div>
              <div className="author-info">
                <h4>John Doe</h4>
                <p>CTO, TechCorp</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              "As a freelancer, I've found amazing opportunities through Freelanco. The platform makes it easy to showcase my skills and connect with clients."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="Jane Smith" />
              </div>
              <div className="author-info">
                <h4>Jane Smith</h4>
                <p>Senior Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h3>About Us</h3>
            <ul>
              <li><a href="#">Our Story</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Resources</h3>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Community</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Legal</h3>
            <ul>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Freelanco. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home; 
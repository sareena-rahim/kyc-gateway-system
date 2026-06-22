import "./Home.css";

import { Link } from "react-router-dom";

import {
  FaShieldAlt,
  FaUserCheck,
  FaLock,
  FaChartLine,
  FaIdCard,
  FaFileAlt,
  FaUniversity,
  FaArrowRight,
  FaUserPlus,
  FaCogs,
  FaCheckCircle,
} from "react-icons/fa";

function Home() {
  return (
    <div className="home-page">
      <nav className="navbar">
        <Link to="/" className="brand">
          <FaShieldAlt />
          <h2>KYC Gateway</h2>
        </Link>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#services">Services</a>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Trusted KYC Infrastructure</span>

          <h1>
            Unified Identity Verification for Banks, NBFCs & Fintechs
          </h1>

          <p>
            Verify customer identities through a secure API ecosystem with
            PAN, Aadhaar and document verification services.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="primary-btn">
              Get Started
            </Link>

            <a href="#services" className="secondary-btn">
              Explore Services
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-card aadhaar-card">
            <FaIdCard />
            <div>
              <h4>Aadhaar Verification</h4>
              <span>Verified ✓</span>
            </div>
          </div>

          <div className="floating-card pan-card">
            <FaUserCheck />
            <div>
              <h4>PAN Verification</h4>
              <span>Verified ✓</span>
            </div>
          </div>

          <div className="shield-circle">
            <FaShieldAlt />
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="section-heading">
          <h2>Why Choose US?</h2>
          <p>
            Everything you need to build secure and compliant identity
            verification workflows.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <FaLock />
            <h3>Enterprise Security</h3>
            <p>End-to-end encryption with role-based access control.</p>
          </div>

          <div className="feature-card">
            <FaChartLine />
            <h3>Real-Time Verification</h3>
            <p>Instant API responses with high availability and uptime.</p>
          </div>

          <div className="feature-card">
            <FaFileAlt />
            <h3>Audit Logs</h3>
            <p>Track every request with centralized compliance reporting.</p>
          </div>

          <div className="feature-card">
            <FaUniversity />
            <h3>Multi-Vendor Support</h3>
            <p>Integrate multiple verification providers through one API.</p>
          </div>
        </div>
      </section>

      <section className="section how-it-works">
        <div className="section-heading">
            <h2>How It Works</h2>

            <p>
            A simple, secure, and scalable identity verification workflow.
            </p>
        </div>

        <div className="steps-container">
            <div className="step-card">
            <div className="step-icon">
                <FaUserPlus />
            </div>

            <h3>1. Customer Submits Details</h3>

            <p>
                Users provide PAN, Aadhaar, and other required information through
                your application.
            </p>
            </div>

            <div className="step-arrow">
            <FaArrowRight />
            </div>

            <div className="step-card">
            <div className="step-icon">
                <FaCogs />
            </div>

            <h3>2. APIs Verify Information</h3>

            <p>
                KYC Gateway securely routes requests to multiple verification
                providers through a unified API layer.
            </p>
            </div>

            <div className="step-arrow">
            <FaArrowRight />
            </div>

            <div className="step-card">
            <div className="step-icon">
                <FaCheckCircle />
            </div>

            <h3>3. Instant Results</h3>

            <p>
                Verification results are returned in real time with detailed audit
                logs and compliance tracking.
            </p>
            </div>
        </div>
    </section>

      <section id="services" className="section">
        <div className="section-heading">
          <h2>Verification Services</h2>
        </div>

        <div className="service-grid">
          <div className="service-card">PAN Verification</div>
          <div className="service-card">Aadhaar Verification</div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-card">
          <h3>10M+</h3>
          <p>Verifications Processed</p>
        </div>

        <div className="stat-card">
          <h3>99.9%</h3>
          <p>Platform Uptime</p>
        </div>

        <div className="stat-card">
          <h3>500+</h3>
          <p>Enterprise Clients</p>
        </div>

        <div className="stat-card">
          <h3>50+</h3>
          <p>Verification APIs</p>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Simplify KYC Verification?</h2>

        <Link to="/login" className="primary-btn">
          Get Started <FaArrowRight />
        </Link>
      </section>
    </div>
  );
}

export default Home;
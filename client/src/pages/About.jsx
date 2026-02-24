import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        {/* HERO */}
        <section className="about-hero card">
          <div className="about-hero-text">
            <h1>About HealthEase</h1>
            <p>
              We are a multi-specialty healthcare platform helping patients find
              doctors, book appointments, and manage care easily.
            </p>

            <div className="about-hero-buttons">
              <Link to="/find-doctors" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/contact" className="btn">
                Contact Us
              </Link>
            </div>
          </div>

          <div className="about-hero-image">
            <img
              src="https://images.unsplash.com/photo-1580281658223-9b93f18ae9ae?w=1200&h=800&fit=crop"
              alt="Healthcare team"
            />
          </div>
        </section>

        {/* MISSION */}
        <section className="about-mission card">
          <div className="about-mission-image">
            <img
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&h=900&fit=crop"
              alt="Doctor"
            />
          </div>

          <div className="about-mission-text">
            <h2>Making Healthcare Accessible for Everyone</h2>
            <p>
              HealthEase connects patients with verified specialists and
              simplifies appointment booking in just a few clicks.
            </p>

            <ul>
              <li>Patient-centered care</li>
              <li>Trusted specialists</li>
              <li>Easy online booking</li>
            </ul>
          </div>
        </section>

        {/* WHY CHOOSE */}
        <section className="about-section">
          <h2>Why Choose HealthEase</h2>
          <div className="about-grid">
            <Feature title="Easy Booking" icon="📅" />
            <Feature title="Expert Doctors" icon="🧑‍⚕️" />
            <Feature title="Secure Access" icon="🔒" />
            <Feature title="Quality Care" icon="💙" />
          </div>
        </section>

        {/* VALUES */}
        <section className="about-section">
          <h2>What We Stand For</h2>
          <div className="about-grid">
            <Feature title="Trust" icon="🛡️" />
            <Feature title="Care" icon="🤝" />
            <Feature title="Accessibility" icon="♿" />
            <Feature title="Innovation" icon="💡" />
          </div>
        </section>

        {/* STATS */}
        <section className="about-stats">
          <div className="stats-grid">
            <Stat value="500+" label="Expert Doctors" />
            <Stat value="50K+" label="Happy Patients" />
            <Stat value="100K+" label="Appointments" />
            <Stat value="98%" label="Satisfaction Rate" />
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta card">
          <h2>Ready to Experience Better Healthcare?</h2>
          <p>Browse doctors and book your first appointment today.</p>
          <Link to="/find-doctors" className="btn btn-primary">
            Book Appointment
          </Link>
        </section>
      </div>
    </div>
  );
}

function Feature({ title, icon }) {
  return (
    <div className="feature-card card">
      <div className="feature-icon">{icon}</div>
      <h4>{title}</h4>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="stat-item">
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  );
}
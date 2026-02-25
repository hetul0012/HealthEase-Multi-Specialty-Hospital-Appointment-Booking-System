import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="about-page">
      <div className="container about-wrap">

        {/* HERO SECTION */}
        <section className="about-hero">
          <div className="about-hero-text">
            <p className="about-pill">About Us</p>
            <h1 className="about-title">About HealthEase</h1>
            <p className="about-subtitle">
              We’re revolutionizing healthcare access by making it simple,
              convenient, and accessible for everyone. Our mission is to connect
              patients with trusted healthcare professionals seamlessly.
            </p>

            <div className="about-hero-buttons">
              <Link to="/register" className="btn btn-primary">
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
              alt="Healthcare Team"
            />
          </div>
        </section>

        {/* MISSION SECTION */}
        <section className="about-mission">
          <div className="about-mission-image">
            <img
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&h=900&fit=crop"
              alt="Doctor"
            />
          </div>

          <div className="about-mission-text">
            <p className="about-pill">Our Mission</p>
            <h2>Making Healthcare Accessible for Everyone</h2>
            <p className="about-subtitle">
              At HealthEase, we believe quality healthcare should be easy to
              access. Our platform connects you with experienced healthcare
              professionals, allowing you to book appointments effortlessly and
              manage your health on your terms.
            </p>

            <div className="about-checks">

              <div className="about-check">
                <span className="check-icon">
                  <i className="fa-solid fa-circle-check"></i>
                </span>
                <div>
                  <b>Patient-Centered Care</b>
                  <p>Your health and convenience are our top priorities.</p>
                </div>
              </div>

              <div className="about-check">
                <span className="check-icon">
                  <i className="fa-solid fa-user-doctor"></i>
                </span>
                <div>
                  <b>Verified Specialists</b>
                  <p>Connect with trusted providers across specialties.</p>
                </div>
              </div>

              <div className="about-check">
                <span className="check-icon">
                  <i className="fa-solid fa-calendar-check"></i>
                </span>
                <div>
                  <b>Easy Online Booking</b>
                  <p>Book appointments in seconds with a smooth flow.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* WHY CHOOSE */}
        <section className="about-section">
          <p className="about-pill center">Why Choose Us</p>
          <h2 className="center">Why Choose HealthEase</h2>
          <p className="about-subtitle center">
            Experience healthcare booking designed around your needs.
          </p>

          <div className="about-grid">
            <Feature
              icon="fa-solid fa-calendar-days"
              title="Easy Booking"
              text="Book appointments anytime with a few clicks."
            />
            <Feature
              icon="fa-solid fa-user-doctor"
              title="Expert Doctors"
              text="Find specialists with verified experience."
            />
            <Feature
              icon="fa-solid fa-shield-halved"
              title="Secure Access"
              text="Your data is safe and protected."
            />
            <Feature
              icon="fa-solid fa-heart-pulse"
              title="Quality Care"
              text="Reliable and patient-focused healthcare."
            />
          </div>
        </section>

        {/* VALUES */}
        <section className="about-section">
          <p className="about-pill center">Our Values</p>
          <h2 className="center">What We Stand For</h2>
          <p className="about-subtitle center">
            Our core values guide everything we do.
          </p>

          <div className="about-grid">
            <Feature
              icon="fa-solid fa-handshake"
              title="Trust"
              text="Transparency and honesty in every interaction."
            />
            <Feature
              icon="fa-solid fa-hand-holding-heart"
              title="Care"
              text="Compassionate care for every patient."
            />
            <Feature
              icon="fa-solid fa-universal-access"
              title="Accessibility"
              text="Healthcare available to everyone."
            />
            <Feature
              icon="fa-solid fa-lightbulb"
              title="Innovation"
              text="Improving healthcare with modern solutions."
            />
          </div>
        </section>

      </div>

      {/* STATS STRIP */}
      <section className="about-stats-strip">
        <div className="container">
          <h3 className="stats-title">HealthEase by the Numbers</h3>
          <p className="stats-sub">
            Trusted by thousands for their healthcare needs
          </p>

          <div className="stats-grid">
            <Stat value="500+" label="Expert Doctors" />
            <Stat value="50K+" label="Happy Patients" />
            <Stat value="100K+" label="Appointments" />
            <Stat value="98%" label="Satisfaction Rate" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <h2>Ready to Experience Better Healthcare?</h2>
          <p>
            Join thousands of satisfied patients who trust HealthEase.
          </p>
          <Link to="/find-doctors" className="btn btn-primary">
            Book an Appointment
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">

            <div>
              <div className="brand" style={{ color: "white" }}>
                <span className="brand-badge">
                  <i className="fa-solid fa-heart-pulse"></i>
                </span>
                HealthEase
              </div>
              <p>
                Providing exceptional healthcare services with compassion and expertise.
              </p>
            </div>

            <div>
              <h4>Quick Links</h4>
              <Link to="/about">About Us</Link>
              <Link to="/find-doctors">Our Doctors</Link>
              <Link to="/appointments">Services</Link>
              <Link to="/contact">Contact</Link>
            </div>

            <div>
              <h4>Services</h4>
              <a href="#">Cardiology</a>
              <a href="#">Dental Care</a>
              <a href="#">Surgery</a>
              <a href="#">Eye Care</a>
            </div>

            <div>
              <h4>Newsletter</h4>
              <p>Stay updated with our latest health tips.</p>
              <div className="news-row">
                <input placeholder="Your email" />
                <button title="Send">
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </div>

          </div>

          <div className="footer-bottom">
            © 2026 HealthEase. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* FEATURE COMPONENT */
function Feature({ icon, title, text }) {
  return (
    <div className="about-feature">
      <div className="feature-icon">
        <i className={icon}></i>
      </div>
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  );
}

/* STAT COMPONENT */
function Stat({ value, label }) {
  return (
    <div className="stat-item">
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}
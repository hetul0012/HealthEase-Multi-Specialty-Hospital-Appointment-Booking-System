import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
    agree: false,
  });

  const [status, setStatus] = useState(""); // success / error message

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setStatus("");

    // Simple validation (no backend needed)
    if (!form.fullName.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setStatus("Please fill in all required fields.");
      return;
    }
    if (!form.agree) {
      setStatus("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    // Demo behavior (you can connect backend later)
    setStatus(" Message sent! We’ll get back to you soon.");

    setForm({
      fullName: "",
      email: "",
      subject: "",
      message: "",
      agree: false,
    });
  };

  return (
    <div className="contact-page">
      <div className="container" style={{ padding: "28px 18px" }}>
        <div className="contact-hero">
          <h1 className="page-title" style={{ textAlign: "center" }}>
            Get in Touch
          </h1>
          <p className="page-subtitle" style={{ textAlign: "center" }}>
            Have questions about our healthcare services? We’re here to help. Reach out to our team and we’ll get back to
            you as soon as possible.
          </p>
        </div>

        <div className="contact-layout">
          {/* LEFT - CONTACT INFO */}
          <div className="card contact-info">
            <h3>Contact Information</h3>
            <p className="muted">
              We’re committed to providing exceptional healthcare services. Connect with us through any of the following
              channels.
            </p>

            <div className="contact-info-list">
              <div className="contact-row">
                <div className="contact-ico">📞</div>
                <div>
                  <div className="contact-label">Phone</div>
                  <div className="contact-value">+1 (555) 123-4567</div>
                  <div className="contact-sub">Available 24/7 for emergencies</div>
                </div>
              </div>

              <div className="contact-row">
                <div className="contact-ico">✉️</div>
                <div>
                  <div className="contact-label">Email</div>
                  <div className="contact-value">contact@healthease.com</div>
                  <div className="contact-sub">We’ll respond within 24 hours</div>
                </div>
              </div>

              <div className="contact-row">
                <div className="contact-ico">📍</div>
                <div>
                  <div className="contact-label">Address</div>
                  <div className="contact-value">123 Healthcare Ave</div>
                  <div className="contact-sub">Medical District, NY 10001</div>
                  <div className="contact-sub">Open Mon–Fri 8AM–6PM</div>
                </div>
              </div>
            </div>

            <div className="follow-us">
              <div className="follow-title">Follow Us</div>
              <div className="follow-icons">
                <a href="#" aria-label="Facebook" className="social-ico">
                  f
                </a>
                <a href="#" aria-label="Twitter" className="social-ico">
                  x
                </a>
                <a href="#" aria-label="LinkedIn" className="social-ico">
                  in
                </a>
               
              </div>
            </div>
          </div>

          {/* RIGHT - FORM */}
          <div className="card contact-form">
            <h3>Send us a Message</h3>

            <form onSubmit={onSubmit}>
              <div className="field">
                <label>Full Name *</label>
                <input
                  className="input"
                  name="fullName"
                  value={form.fullName}
                  onChange={onChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="field">
                <label>Email Address *</label>
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Enter your email address"
                />
              </div>

              <div className="field">
                <label>Subject *</label>
                <input
                  className="input"
                  name="subject"
                  value={form.subject}
                  onChange={onChange}
                  placeholder="What is this about?"
                />
              </div>

              <div className="field">
                <label>Message *</label>
                <textarea
                  className="textarea"
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <div className="contact-check">
                <input type="checkbox" name="agree" checked={form.agree} onChange={onChange} />
                <span>
                  I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                </span>
              </div>

              {status && <div className="contact-status">{status}</div>}

              <button className="btn btn-primary contact-submit" type="submit">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
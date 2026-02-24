import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setErr("Please fill all fields.");
      return;
    }
    if (!agree) {
      setErr("Please agree to Terms & Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        name,
        email,
        phone,
        password,
      });

      // If backend returns token+user, auto login:
      if (res?.data?.token && res?.data?.user) {
        login(res.data);
        nav("/appointments");
      } else {
        nav("/login");
      }
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrap">
        <div className="auth-illustration">
          <div className="auth-illu-inner">
            <img
              src="https://illustrations.popsy.co/blue/doctors.svg"
              alt="Healthcare Illustration"
              className="auth-illu-img"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        </div>

        <div className="auth-formSide">
          <div className="auth-card">
            <h2 className="auth-title">Create account</h2>

            <form onSubmit={onSubmit}>
              <div className="auth-field">
                <label>Full Name</label>
                <div className="auth-inputWrap">
                  <span className="auth-icon">👤</span>
                  <input
                    className="auth-input"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>Email Address</label>
                <div className="auth-inputWrap">
                  <span className="auth-icon">✉️</span>
                  <input
                    className="auth-input"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>Phone Number</label>
                <div className="auth-inputWrap">
                  <span className="auth-icon">📞</span>
                  <input
                    className="auth-input"
                    type="text"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>Password</label>
                <div className="auth-inputWrap">
                  <span className="auth-icon">🔒</span>
                  <input
                    className="auth-input"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-row">
                <label className="auth-check">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                  <span>
                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                  </span>
                </label>
              </div>

              {err && <div className="auth-error">{err}</div>}

              <button className="auth-primaryBtn" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </button>

              <div className="auth-alt">
                Already have an account?{" "}
                <Link to="/login" className="auth-link">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(true);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email.trim() || !password.trim()) {
      setErr("Please enter email and password.");
      return;
    }

    if (!agree) {
      setErr("Please agree to Terms & Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", { email, password });

      login(res.data);

      const role = res.data?.user?.role;
      if (role === "admin") nav("/admin");
      else if (role === "doctor") nav("/doctor");
      else nav("/appointments");

    } catch (e2) {
      setErr(e2?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-center">
        <div className="auth-card">
          <h2 className="auth-title">Sign In</h2>

          <form onSubmit={onSubmit}>
         
            <div className="auth-field">
              <label>Email Address</label>
              <div className="auth-inputWrap">
                <i className="fa-solid fa-envelope auth-fa-icon"></i>
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
              <label>Password</label>
              <div className="auth-inputWrap">
                <i className="fa-solid fa-lock auth-fa-icon"></i>
                <input
                  className="auth-input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

          
            <div className="auth-row">
              <label className="auth-check">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span>
                  I agree to the <a href="#">Terms of Service</a> and{" "}
                  <a href="#">Privacy Policy</a>
                </span>
              </label>
            </div>

            {err && <div className="auth-error">{err}</div>}

            <button className="auth-primaryBtn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="auth-alt">
              Don’t have an account?{" "}
              <Link to="/register" className="auth-link">
                Create one
              </Link>
            </div>

            <div className="auth-demo">
              Admin demo: <b>admin@healthease.com</b> / <b>admin123</b>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api/api";
import { saveAuth } from "../auth";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const from = loc.state?.from || "/appointments";

  const onLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await api.post("/api/auth/login", { email, password });
      saveAuth(res.data.token, res.data.user);

      // redirect based on role
      if (res.data.user.role === "admin") return nav("/admin", { replace: true });
      if (res.data.user.role === "doctor") return nav("/doctor", { replace: true });

      nav(from, { replace: true });
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ padding: "26px 18px" }}>
        <div className="card" style={{ maxWidth: 520, margin: "0 auto", padding: 18 }}>
          <h2 style={{ margin: 0, fontWeight: 900 }}>Sign In</h2>

          <form onSubmit={onLogin} style={{ marginTop: 12 }}>
            <div className="field">
              <label>Email</label>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {msg && (
              <div className="card" style={{ padding: 10, background: "#f8fafc", marginTop: 10 }}>
                {msg}
              </div>
            )}

            <button className="btn btn-primary" style={{ marginTop: 12, height: 40 }}>
              Login
            </button>
          </form>

          <p style={{ marginTop: 10, color: "#64748b" }}>
            Don’t have an account? <Link to="/register">Create one</Link>
          </p>

          <p style={{ marginTop: 10, color: "#64748b" }}>
            Admin demo: <b>admin@healthease.com</b> / <b>admin123</b>
          </p>
        </div>
      </div>
    </div>
  );
}

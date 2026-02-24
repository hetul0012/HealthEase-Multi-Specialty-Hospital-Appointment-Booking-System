import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { saveAuth } from "../auth";

export default function Register() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onRegister = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await api.post("/api/auth/register", { name, email, password });
      saveAuth(res.data.token, res.data.user);
      nav("/appointments");
    } catch (err) {
      setMsg(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ padding: "26px 18px" }}>
        <div className="card" style={{ maxWidth: 520, margin: "0 auto", padding: 18 }}>
          <h2 style={{ margin: 0, fontWeight: 900 }}>Create Account</h2>

          <form onSubmit={onRegister} style={{ marginTop: 12 }}>
            <div className="field">
              <label>Full Name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

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
              Register
            </button>
          </form>

          <p style={{ marginTop: 10, color: "#64748b" }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

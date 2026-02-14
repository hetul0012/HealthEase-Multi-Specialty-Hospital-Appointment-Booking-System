import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const u = await login(email, password);
      nav(u.role === "admin" ? "/admin" : "/patient");
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
        <h2>Sign In</h2>
        {err && <p style={{ color: "red" }}>{err}</p>}
        <form className="grid" onSubmit={submit}>
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn btn-primary">Login</button>
        </form>

        <p style={{ color: "var(--muted)", marginTop: 10 }}>
          Admin demo: <b>admin@healthease.com</b> / <b>admin123</b>
        </p>
      </div>
    </div>
  );
}

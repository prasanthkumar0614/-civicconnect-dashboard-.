import { useState } from "react";
import { api, setToken } from "../api.js";

export default function Login({ onLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await api.login(username.trim(), password);
      setToken(data.access);
      onLoggedIn();
    } catch {
      setError("Couldn't sign you in. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="brand" style={{ color: "var(--ink)" }}>
          <span className="brand-mark">CC</span>
          CivicConnect
        </div>
        <div>
          <p className="eyebrow">Authority dashboard</p>
          <h1 style={{ fontSize: 20, marginTop: 6 }}>Sign in</h1>
        </div>
        <div className="field">
          <label htmlFor="username">Username</label>
          <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="hint">Officer, department admin, and super admin accounts only.</p>
      </form>
    </div>
  );
}

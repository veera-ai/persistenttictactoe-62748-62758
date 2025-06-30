import React, { useState } from "react";

// PUBLIC_INTERFACE
export default function AuthPage({ apiBaseUrl, onLogin, theme }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // PUBLIC_INTERFACE
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (isRegister && password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const endpoint = isRegister ? "/users/register" : "/users/login";
      const res = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Error occurred.");
        setLoading(false);
        return;
      }
      // { "user": {...}, "access_token": "..." }
      onLogin(data.user, data.access_token);
    } catch {
      setError("Network error.");
    }
    setLoading(false);
  }

  return (
    <div style={{
      maxWidth: 340, margin: "48px auto", background: "var(--bg-secondary)",
      borderRadius: 14, padding: 32, boxShadow: "0 2px 18px #0002"
    }}>
      <h2 style={{
        marginBottom: 14,
        color: "var(--primary-color, #1976d2)"
      }}>
        {isRegister ? "Register" : "Login"}
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="input"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          placeholder="Username"
          style={{
            width: "100%", marginBottom: 15,
            fontSize: 16, padding: 8, borderRadius: 6, border: "1px solid var(--border-color)"
          }}
        />
        <input
          type="password"
          className="input"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder="Password"
          style={{
            width: "100%", marginBottom: 15,
            fontSize: 16, padding: 8, borderRadius: 6, border: "1px solid var(--border-color)"
          }}
        />
        {isRegister && (
          <input
            type="password"
            className="input"
            value={repeatPassword}
            onChange={e => setRepeatPassword(e.target.value)}
            required
            placeholder="Repeat Password"
            style={{
              width: "100%", marginBottom: 15,
              fontSize: 16, padding: 8, borderRadius: 6, border: "1px solid var(--border-color)"
            }}
          />
        )}
        {error && (
          <div style={{ color: "#e87a41", marginBottom: 12, minHeight: 24 }}>
            {error}
          </div>
        )}
        <button
          className="btn btn-large"
          style={{
            background: "var(--primary-color, #1976d2)",
            color: "#fff",
            width: "100%", padding: "12px", fontSize: 16, borderRadius: 6,
            marginBottom: 8, fontWeight: 600
          }}
          type="submit"
          disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>
      </form>
      <div style={{ marginTop: 8, fontSize: 14 }}>
        {!isRegister ? (
          <>Don't have an account?{" "}
            <button
              className="btn"
              style={{ color: "#1976d2", background: "none", boxShadow: "none", padding: 0 }}
              onClick={() => setIsRegister(true)}>Register</button>
          </>
        ) : (
          <>Already have an account?{" "}
            <button
              className="btn"
              style={{ color: "#1976d2", background: "none", boxShadow: "none", padding: 0 }}
              onClick={() => setIsRegister(false)}>Login</button>
          </>
        )}
      </div>
    </div>
  );
}

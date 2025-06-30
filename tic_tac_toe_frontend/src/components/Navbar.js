import React from "react";

// PUBLIC_INTERFACE
export default function Navbar({ page, setPage, user, logout, toggleTheme, theme }) {
  return (
    <nav
      className="navbar"
      style={{
        width: "100%",
        background: "var(--bg-secondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 32px",
        borderBottom: "1px solid var(--border-color)"
      }}
    >
      <div>
        <span style={{
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: 1,
          color: "var(--text-primary)"
        }}>
          Tic Tac Toe
        </span>
        <span style={{ marginLeft: 16, color: "#43a047", fontWeight: 600 }}>Online</span>
      </div>
      <div>
        {user && (
          <span style={{ marginRight: 16, color: "#888", fontSize: 16 }}>
            Hi, <b>{user.username}</b>
          </span>
        )}
        {user && (
          <>
            <button
              className="btn"
              style={{ marginRight: 8 }}
              onClick={() => setPage("lobby")}
            >Lobby</button>
            <button
              className="btn"
              style={{ marginRight: 8 }}
              onClick={() => setPage("history")}
            >History</button>
            <button
              className="btn"
              onClick={logout}
            >Logout</button>
          </>
        )}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
}

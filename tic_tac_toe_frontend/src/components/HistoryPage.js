import React, { useEffect, useState } from "react";

// PUBLIC_INTERFACE
export default function HistoryPage({ apiBaseUrl, jwt, user, onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, []);

  // PUBLIC_INTERFACE
  async function fetchHistory() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/history/`, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      maxWidth: 450,
      margin: "36px auto",
      background: "var(--bg-secondary)",
      borderRadius: 10,
      boxShadow: "0 3px 16px #0001",
      padding: 30,
    }}>
      <h2 style={{ marginBottom: 12 }}>Match History</h2>
      <button 
        className="btn"
        style={{ marginBottom: 18, background: "#43a047", color: "#fff", borderRadius: 6 }}
        onClick={onBack}
      >Back to Lobby</button>
      {loading ? <div>Loading...</div> :
        <div style={{ minHeight: 48 }}>
        {(history && history.length > 0) ? (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {history.map((h, i) => (
              <li key={i} style={{
                background: "#e9ecef10",
                borderRadius: 6,
                marginBottom: 7,
                padding: "7px 0"
              }}>
                <span>
                  Game #{h.game_id}: {h.host_username} vs {h.guest_username || "?"}, 
                  <b> Result:</b> <span style={{color: h.result === user.username ? "#43a047" : "#e87a41"}}>
                    {h.result === user.username ? "Win" : (h.result === "draw" ? "Draw":"Loss")}
                  </span>
                  <span style={{marginLeft:8, color:"#aaa", fontSize:13}}>
                    {new Date(h.completed_at).toLocaleDateString()} {new Date(h.completed_at).toLocaleTimeString()}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <span style={{ color: "#aaa" }}>No games played yet.</span>
        )}
        </div>
      }
    </div>
  );
}

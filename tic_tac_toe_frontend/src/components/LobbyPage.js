import React from "react";

// PUBLIC_INTERFACE
export default function LobbyPage({
  user,
  gameList,
  loading,
  onCreateGame,
  onJoinGame,
  onShowHistory
}) {
  return (
    <div className="container" style={{
      maxWidth: 480,
      margin: "32px auto",
      background: "var(--bg-secondary)",
      borderRadius: 16,
      boxShadow: "0 3px 16px #0001",
      padding: 28,
    }}>
      <h2 style={{ marginBottom: 12 }}>Game Lobby</h2>
      <div className="actions" style={{ marginBottom: 16 }}>
        <button className="btn btn-large" style={{
          marginRight: 12,
          background: "#43a047",
          color: "#fff",
          border: "none",
          borderRadius: 6,
        }} onClick={onCreateGame}>Create new game</button>
        <button className="btn btn-large" style={{
          background: "#ffca28",
          color: "#282c34",
          border: "none",
          borderRadius: 6,
        }} onClick={onShowHistory}>Match History</button>
      </div>
      <div style={{ minHeight: 50, margin: "12px 0" }}>
        {loading ? (
          <span>Loading games...</span>
        ) : (
          <>
            <b>Available Games</b>
            {(gameList && gameList.length > 0) ? (
              <ul style={{ marginTop: 8, listStyle: "none", padding: 0 }}>
                {gameList.map(g => (
                  <li key={g.id} style={{
                    borderBottom: "1px solid var(--border-color)",
                    padding: "6px 0"
                  }}>
                    <span>#{g.id} - {g.status} - Host: <b>{g.host_username}</b>
                      {g.status === "waiting" && g.guest_username && " (guest joined)"}
                    </span>
                    <button
                      className="btn"
                      style={{
                        marginLeft: 12,
                        background: "#1976d2",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4
                      }}
                      onClick={() => onJoinGame(g.id)}
                      disabled={g.status !== "waiting" || user.username === g.host_username}
                    >Join</button>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ color: "#aaa", margin: "14px 0" }}>
                No games available. Create one!
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

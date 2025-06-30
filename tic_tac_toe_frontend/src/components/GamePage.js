import React, { useEffect, useState } from "react";

// PUBLIC_INTERFACE
function Board({ board, onPlay, enabled }) {
  return (
    <div style={{
      display: "grid", gridTemplateRows: "repeat(3, 1fr)", gridTemplateColumns: "repeat(3, 1fr)",
      gap: 6, background: "#282c34", maxWidth: 300, margin: "0 auto", borderRadius: 10, boxShadow: "0 3px 16px #0002"
    }}>
      {board.flat().map((cell, i) => (
        <button
          key={i}
          className="btn"
          style={{
            width: 100, height: 100, fontSize: 40, fontWeight: "700", background: "#fff", color: "#1976d2",
            border: "2px solid #ffca28", borderRadius: 8, margin: 0,
            pointerEvents: enabled && !cell ? "auto" : "none",
            opacity: cell || !enabled ? 0.8 : 1,
            transition: "background 0.15s"
          }}
          aria-label={`Cell ${i + 1}, value: ${cell || "empty"}`}
          onClick={() => onPlay(Math.floor(i / 3), i % 3)}
          disabled={!enabled || !!cell}
        >
          {cell || ""}
        </button>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
export default function GamePage({ apiBaseUrl, jwt, user, game, onLeaveGame, onGameOver }) {
  const [state, setState] = useState(game);
  const [error, setError] = useState(null);
  const [polling, setPolling] = useState(null);
  const [makingMove, setMakingMove] = useState(false);

  // Refresh game state every 2 seconds for real-time effect (simple polling)
  useEffect(() => {
    setState(game);
    if (polling) clearInterval(polling);
    const pid = setInterval(fetchGame, 2000);
    setPolling(pid);
    return () => clearInterval(pid);
    // eslint-disable-next-line
  }, [game]);

  // Stop polling on unmount
  useEffect(() => () => polling && clearInterval(polling), [polling]);

  // PUBLIC_INTERFACE
  async function fetchGame() {
    try {
      const res = await fetch(`${apiBaseUrl}/games/${game.id}`, {
        headers: { Authorization: `Bearer ${jwt}`}
      });
      if (res.ok) {
        const next = await res.json();
        setState(next);
        // If game status changed to completed, handle and exit.
        if (next.status === "completed" && next.winner) {
          setTimeout(onGameOver, 2000); // Show result brief moment, then return.
        }
      }
    } catch {
      // ignore
    }
  }

  // PUBLIC_INTERFACE
  async function handlePlay(row, col) {
    if (makingMove) return;
    setMakingMove(true); setError(null);
    try {
      const res = await fetch(`${apiBaseUrl}/games/${game.id}/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({ row, col })
      });
      const next = await res.json();
      if (res.ok) {
        setState(next);
        if (next.status === "completed" && next.winner) {
          setTimeout(onGameOver, 2100);
        }
      } else {
        setError(next.detail || "Invalid move.");
      }
    } catch {
      setError("Network error.");
    }
    setMakingMove(false);
  }

  if (!state) return <div>Loading game...</div>;
  const youAre = state.host_username === user.username ? "X" : "O";
  const turnUser = state.turn === "X" ? state.host_username : state.guest_username;
  const isYourTurn = user.username === turnUser && state.status === "playing";
  const youAreHost = state.host_username === user.username;
  const guestWaiting = state.status === "waiting";

  let footer = "";
  if (state.status === "waiting") {
    footer = "Waiting for another player to join...";
  }
  else if (state.status === "playing") {
    footer = isYourTurn ? "Your turn!" : (`${turnUser}'s turn`);
  }
  else if (state.status === "completed") {
    if (state.winner === "draw")
      footer = "Game ended in a draw!";
    else if (state.winner === user.username || (state.winner === "X" && youAre === "X") || (state.winner === "O" && youAre === "O"))
      footer = "You won!";
    else
      footer = "You lost!";
  }

  return (
    <div className="container" style={{
      maxWidth: 470,
      margin: "36px auto",
      background: "var(--bg-secondary)",
      borderRadius: 16,
      boxShadow: "0 3px 16px #0001",
      padding: 32
    }}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Tic Tac Toe: Game #{state.id}</h2>
        <button 
          className="btn"
          style={{ background: "#e87a41", color: "#fff", borderRadius: 6 }}
          onClick={onLeaveGame}
        >Back To Lobby</button>
      </div>
      <div style={{ fontSize: 16, color: "#888", marginBottom: 8 }}>
        You are <b>{youAre}</b> ({user.username})<br />
        Host: <b>{state.host_username}</b> vs Guest: <b>{state.guest_username || "?"}</b>
      </div>
      <Board
        board={state.board || [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""],
        ]}
        onPlay={handlePlay}
        enabled={isYourTurn && !guestWaiting && state.status === "playing"}
      />
      {error && (
        <div style={{
          color: "#e87a41",
          fontSize: 16,
          marginTop: 15,
          minHeight: 24
        }}>{error}</div>
      )}
      <div style={{ marginTop: 18, fontWeight: 600, fontSize: 19, color: "#43a047", minHeight: 28 }}>
        {footer}
      </div>
    </div>
  );
}

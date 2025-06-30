import React, { useEffect, useState } from "react";
import AuthPage from "./components/AuthPage";
import LobbyPage from "./components/LobbyPage";
import GamePage from "./components/GamePage";
import HistoryPage from "./components/HistoryPage";
import Navbar from "./components/Navbar";
import "./App.css";

// Backend API URL (update this as needed)
const API_BASE_URL = "https://vscode-internal-8924-dev.dev01.cloud.kavia.ai:3001";

// App routes
const PAGES = {
  AUTH: "auth",
  LOBBY: "lobby",
  GAME: "game",
  HISTORY: "history"
};

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const [page, setPage] = useState(PAGES.AUTH);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [activeGame, setActiveGame] = useState(null);
  const [gameList, setGameList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Theme support
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Restore user from localStorage if present
  useEffect(() => {
    const userStored = window.localStorage.getItem("user");
    const jwtStored = window.localStorage.getItem("jwt");
    if (userStored && jwtStored) {
      setUser(JSON.parse(userStored));
      setJwt(jwtStored);
      setPage(PAGES.LOBBY);
    }
  }, []);

  // Fetch available games when entering lobby
  useEffect(() => {
    if (page === PAGES.LOBBY && jwt) {
      fetchGames();
    }
    // eslint-disable-next-line
  }, [page, jwt]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  };

  // PUBLIC_INTERFACE
  const handleLogin = (userObj, jwtToken) => {
    setUser(userObj);
    setJwt(jwtToken);
    window.localStorage.setItem("user", JSON.stringify(userObj));
    window.localStorage.setItem("jwt", jwtToken);
    setPage(PAGES.LOBBY);
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    setUser(null);
    setJwt(null);
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("jwt");
    setActiveGame(null);
    setPage(PAGES.AUTH);
  };

  // PUBLIC_INTERFACE
  async function fetchGames() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/games/`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setGameList(data.games || []);
      }
    } catch {
      // ignore for now
    }
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  const handleCreateGame = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/games/create`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}` 
        },
      });
      if (res.ok) {
        const data = await res.json();
        setActiveGame(data);
        setPage(PAGES.GAME);
        await fetchGames();
      }
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleJoinGame = async (gameId) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/games/${gameId}/join`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}` 
        },
      });
      if (res.ok) {
        const data = await res.json();
        setActiveGame(data);
        setPage(PAGES.GAME);
        await fetchGames();
      }
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleLeaveGame = () => {
    setActiveGame(null);
    setPage(PAGES.LOBBY);
    fetchGames();
  };

  // PUBLIC_INTERFACE
  const handleShowHistory = () => {
    setPage(PAGES.HISTORY);
  };

  // PUBLIC_INTERFACE
  const handleBackToLobby = () => {
    setPage(PAGES.LOBBY);
    fetchGames();
  };

  // PUBLIC_INTERFACE
  const handleGameOver = () => {
    setActiveGame(null); // When a game ends, go back to the lobby and fetch games.
    setPage(PAGES.LOBBY);
    fetchGames();
  };

  return (
    <div className="App" style={{ minHeight: "100vh" }}>
      <Navbar
        page={page}
        setPage={setPage}
        user={user}
        logout={logout}
        toggleTheme={toggleTheme}
        theme={theme}
      />
      <main className="main-content" style={{ minHeight: "90vh" }}>
        {page === PAGES.AUTH && (
          <AuthPage
            apiBaseUrl={API_BASE_URL}
            onLogin={handleLogin}
            theme={theme}
          />
        )}
        {page === PAGES.LOBBY && user && (
          <LobbyPage
            user={user}
            gameList={gameList}
            loading={loading}
            onCreateGame={handleCreateGame}
            onJoinGame={handleJoinGame}
            onShowHistory={handleShowHistory}
          />
        )}
        {page === PAGES.GAME && activeGame && (
          <GamePage
            apiBaseUrl={API_BASE_URL}
            jwt={jwt}
            user={user}
            game={activeGame}
            onLeaveGame={handleLeaveGame}
            onGameOver={handleGameOver}
          />
        )}
        {page === PAGES.HISTORY && (
          <HistoryPage
            apiBaseUrl={API_BASE_URL}
            jwt={jwt}
            user={user}
            onBack={handleBackToLobby}
          />
        )}
      </main>
      <footer className="footer" style={{
        background: "var(--bg-secondary)", color: "var(--text-primary)",
        textAlign: "center", padding: 12
      }}>
        Built with <span style={{color:"#ffca28"}}>♥</span> using React | Tic Tac Toe | Persistent Multiplayer
      </footer>
    </div>
  );
}

export default App;

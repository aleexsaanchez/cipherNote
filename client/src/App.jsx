import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import CreateNotePage from "./pages/CreateNotePage";
import EditNotePage from "./pages/EditNotePage";
import NotesListPage from "./pages/NotesListPage";
import Header from "./components/Header";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <div className="app-shell">
        <Header token={token} logout={logout} />
        <main className="app-main">
          <Routes>
            <Route path="/auth" element={<AuthPage setToken={setToken} />} />
            <Route
              path="/notes"
              element={token ? <NotesListPage token={token} /> : <Navigate to="/auth" />}
            />
            <Route
              path="/notes/create"
              element={token ? <CreateNotePage token={token} /> : <Navigate to="/auth" />}
            />
            <Route
              path="/notes/edit/:id"
              element={token ? <EditNotePage token={token} /> : <Navigate to="/auth" />}
            />
            <Route path="*" element={<Navigate to="/notes" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
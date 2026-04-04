import React from "react";
import { useNavigate } from "react-router-dom";

function Header({ token, logout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <header className="header">
      <div className="header-inner">
        <button className="brand" type="button" onClick={() => navigate(token ? "/notes" : "/auth")}>
          <span className="brand-mark">C</span>
          <span className="brand-copy">
            <strong>CipherNote</strong>
            <small>Cyber notes vault</small>
          </span>
        </button>
        {token && (
          <button className="button button-ghost" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
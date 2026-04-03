// src/pages/AuthPage.jsx
import { useState } from "react";
import { login, register } from "../api";
import { useNavigate } from "react-router-dom";

function AuthPage({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = isRegister
        ? await register({ email, password })
        : await login({ email, password });

      setToken(res.token);
      localStorage.setItem("token", res.token);
      navigate("/notes");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{isRegister ? "Register" : "Login"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <br />
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Switch to Login" : "Switch to Register"}
      </button>
    </div>
  );
}

export default AuthPage;
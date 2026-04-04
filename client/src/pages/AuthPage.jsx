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
    setError("");

    try {
      const res = isRegister
        ? await register({ email, password })
        : await login({ email, password });

      if (!res.token) {
        throw new Error(res.message || "Authentication failed");
      }

      setToken(res.token);
      localStorage.setItem("token", res.token);
      navigate("/notes");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-panel auth-copy">
        <div>
          <p className="eyebrow">Secure student vault</p>
          <h1>{isRegister ? "Build your cyber notes archive" : "Welcome back"}</h1>
          <p className="lead">
            Organize attack paths, defense steps, tooling, and lab writeups in one structured place.
          </p>
        </div>

        <div className="feature-list">
          <span>Threat intel</span>
          <span>Mitigations</span>
          <span>Lab tags</span>
        </div>
      </section>

      <section className="auth-panel auth-form-card">
        <div className="auth-form-header">
          <p className="eyebrow">{isRegister ? "Create account" : "Sign in"}</p>
          <h2>{isRegister ? "Set up your secure workspace" : "Resume your study session"}</h2>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input"
              type="email"
              placeholder="student@lab.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input"
              type="password"
              placeholder="Enter your credential"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="button button-primary button-full" type="submit">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        {error && <p className="form-error">{error}</p>}

        <button
          className="button button-secondary button-full"
          type="button"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Already have an account?" : "Create an account"}
        </button>
      </section>
    </div>
  );
}

export default AuthPage;
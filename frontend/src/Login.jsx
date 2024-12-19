import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (result.success) {
        window.location.href = result.redirect; // Redirect to bookmarks
      } else {
        setErrorMessage(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Login</h1>
        <form id="login" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="notification is-danger">{errorMessage}</div>
          )}
          <div className="field">
            <label className="label" htmlFor="username">
              Username
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="password">
              Password
            </label>
            <div className="control">
              <input
                className="input"
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="control">
            <button className="button is-primary" type="submit">
              Login
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;

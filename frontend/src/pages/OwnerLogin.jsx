
import React, { useState } from "react";
import { api } from "../services/api";
import "./OwnerLogin.css";

export default function OwnerLogin() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.username.trim() || !form.password.trim()) {
      setError("Enter your owner username and password.");
      return;
    }

    setLoading(true);

    try {
      await api.login({
        username: form.username.trim(),
        password: form.password,
      });

      const user = await api.getCurrentUser();

      if (!user.is_staff) {
        await api.logout();
        setError("Access denied. This account is not an owner account.");
        return;
      }

      window.location.hash = "owner";
    } catch (err) {
      setError(err.message || "Owner login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="owner-login-page">
      <div className="owner-login-decoration owner-login-decoration-one" />
      <div className="owner-login-decoration owner-login-decoration-two" />

      <section className="owner-login-card">
        <a href="#home" className="owner-login-brand">
          HOTEL <span>IN KONKAN</span>
        </a>

        <div className="owner-login-icon">
          <span>✦</span>
        </div>

        <p className="owner-login-eyebrow">PRIVATE MANAGEMENT PORTAL</p>

        <h1>
          Owner <i>Login.</i>
        </h1>

        <p className="owner-login-description">
          Sign in to manage reservations, customers and hotel operations.
        </p>

        {error && (
          <div className="owner-login-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="owner-username">Owner Username</label>
          <input
            id="owner-username"
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter owner username"
            autoComplete="username"
            required
          />

          <label htmlFor="owner-password">Password</label>

          <div className="owner-login-password">
            <input
              id="owner-password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            className="owner-login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Access Owner Dashboard"}
            <span>→</span>
          </button>
        </form>

        <div className="owner-login-footer">
          <span>Authorized owner access only</span>
          <a href="#login">Customer Login</a>
        </div>
      </section>
    </main>
  );
}

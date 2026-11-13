
import React, { useState } from "react";
import { api } from "../services/api";
import "./OwnerLogin.css";

export default function Login() {
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
      setError("Enter your username and password.");
      return;
    }

    setLoading(true);

    try {
      await api.login({
        username: form.username.trim(),
        password: form.password,
      });

      const user = await api.getCurrentUser();

      if (user.is_staff) {
        await api.logout();
        setError("Owner accounts must use the Owner Login page.");
        return;
      }

      window.location.hash = "dashboard";
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials.");
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

        <p className="owner-login-eyebrow">CUSTOMER ACCOUNT PORTAL</p>

        <h1>
          Welcome <i>Back.</i>
        </h1>

        <p className="owner-login-description">
          Sign in to manage your bookings and explore your Konkan stays.
        </p>

        {error && (
          <div className="owner-login-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="customer-username">Username</label>
          <input
            id="customer-username"
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
            autoComplete="username"
            required
          />

          <label htmlFor="customer-password">Password</label>

          <div className="owner-login-password">
            <input
              id="customer-password"
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
            {loading ? "Signing In..." : "Login to Your Account"}
            <span>→</span>
          </button>
        </form>

        <div className="owner-login-footer">
          <a href="#register">Create Account</a>
          <a href="#owner-login">Owner Login</a>
        </div>
      </section>
    </main>
  );
}

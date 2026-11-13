
import React, { useState } from "react";
import { api } from "../services/api";
import "./OwnerLogin.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    setSuccess("");

    const username = form.username.trim();
    const email = form.email.trim();
    const phone = form.phone_number.trim();
    const password = form.password;

    if (username.length < 3) {
      setError("Username must contain at least 3 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must include an uppercase letter and a number.");
      return;
    }

    setLoading(true);

    try {
      await api.register({
        username,
        email,
        phone_number: phone,
        password,
      });

      setSuccess("Your account has been created successfully!");

      setForm({
        username: "",
        email: "",
        phone_number: "",
        password: "",
      });

      setTimeout(() => {
        window.location.hash = "login";
      }, 1800);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="owner-login-page register-page">
      <div className="owner-login-decoration owner-login-decoration-one" />
      <div className="owner-login-decoration owner-login-decoration-two" />

      <section className="owner-login-card register-card">
        <a href="#home" className="owner-login-brand">
          HOTEL <span>IN KONKAN</span>
        </a>

        <div className="owner-login-icon">
          <span>✦</span>
        </div>

        <p className="owner-login-eyebrow">JOIN OUR COMMUNITY</p>

        <h1>
          Create your <i>Account.</i>
        </h1>

        <p className="owner-login-description">
          Register to book beautiful stays and manage your Konkan journeys.
        </p>

        {success && (
          <div className="owner-login-success" role="status">
            {success}
          </div>
        )}

        {error && (
          <div className="owner-login-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="register-username">Username</label>
          <input
            id="register-username"
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Choose a username"
            autoComplete="username"
            minLength={3}
            required
          />

          <label htmlFor="register-email">Email Address</label>
          <input
            id="register-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />

          <label htmlFor="register-phone">Phone Number</label>
          <input
            id="register-phone"
            type="tel"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            autoComplete="tel"
            maxLength={10}
          />

          <label htmlFor="register-password">Password</label>

          <div className="owner-login-password">
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={8}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <p className="register-password-hint">
            At least 8 characters, one uppercase letter and one number.
          </p>

          <button
            className="owner-login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create My Account"}
            <span>→</span>
          </button>
        </form>

        <div className="owner-login-footer">
          <a href="#login">Already registered? Login</a>
          <a href="#owner-login">Owner Login</a>
        </div>
      </section>
    </main>
  );
}

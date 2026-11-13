
import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [currentUser, bookingData] = await Promise.all([
          api.getCurrentUser(),
          api.getBookings()
        ]);

        setUser(currentUser);
        setBookings(bookingData.results || bookingData);
      } catch (err) {
        setError(err.message || "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    setError("");

    try {
      await api.logout();
      window.location.hash = "home";
    } catch (err) {
      setError(err.message || "Unable to logout.");
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <main className="dashboard-loading">
        Loading your dashboard...
      </main>
    );
  }

  if (error && !user) {
    return (
      <main className="dashboard-loading">
        <div className="dashboard-error">{error}</div>
        <a href="#login" className="dashboard-primary-button">
          Login
        </a>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        <div className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">YOUR PERSONAL SPACE</p>
            <h1>Welcome back, <i>{user?.username}</i></h1>
            <p>Manage your account and explore your Konkan journeys.</p>
          </div>

          <button
            className="dashboard-logout"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        {error && <div className="dashboard-error">{error}</div>}

        <div className="dashboard-stats">
          <div className="dashboard-stat">
            <span>Total Bookings</span>
            <strong>{bookings.length}</strong>
          </div>

          <div className="dashboard-stat">
            <span>Pending Bookings</span>
            <strong>
              {bookings.filter(x => x.status === "pending").length}
            </strong>
          </div>

          <div className="dashboard-stat">
            <span>Confirmed Bookings</span>
            <strong>
              {bookings.filter(x => x.status === "confirmed").length}
            </strong>
          </div>
        </div>

        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <p className="dashboard-eyebrow">ACCOUNT INFORMATION</p>
              <h2>My Profile</h2>
            </div>
          </div>

          <div className="dashboard-profile">
            <div className="dashboard-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3>{user?.username}</h3>
              <p>{user?.email}</p>
              <p>{user?.phone_number || "Phone number not provided"}</p>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <p className="dashboard-eyebrow">YOUR TRAVEL HISTORY</p>
              <h2>My Bookings</h2>
            </div>

            <a href="#booking" className="dashboard-primary-button">
              + New Booking
            </a>
          </div>

          {bookings.length === 0 ? (
            <div className="dashboard-empty">
              <h3>No bookings yet</h3>
              <p>Your next Konkan adventure starts here.</p>
              <a href="#booking" className="dashboard-primary-button">
                Explore Booking
              </a>
            </div>
          ) : (
            <div className="dashboard-bookings">
              {bookings.map(booking => (
                <article
                  className="dashboard-booking-card"
                  key={booking.id}
                >
                  <div className="dashboard-booking-top">
                    <div>
                      <span>BOOKING #{booking.id}</span>
                      <h3>{booking.hotel_name}</h3>
                    </div>

                    <span className={`dashboard-status ${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="dashboard-booking-details">
                    <div>
                      <span>CHECK-IN</span>
                      <strong>{booking.check_in}</strong>
                    </div>

                    <div>
                      <span>CHECK-OUT</span>
                      <strong>{booking.check_out}</strong>
                    </div>

                    <div>
                      <span>GUESTS</span>
                      <strong>{booking.guests}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="dashboard-footer">
          <p>Discover more. Travel slower. Love Konkan.</p>
          <a href="#home">Back to Home ↗</a>
        </div>

      </div>
    </main>
  );
}


import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import "./OwnerDashboard.css";

export default function OwnerDashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [filter, setFilter] = useState("all");

  async function loadBookings() {
    const bookingData = await api.getBookings();
    setBookings(bookingData.results || bookingData);
  }

  useEffect(() => {
    async function loadDashboard() {
      try {
        const currentUser = await api.getCurrentUser();

        if (!currentUser.is_staff) {
          window.location.hash = "dashboard";
          return;
        }

        setUser(currentUser);
        await loadBookings();
      } catch (err) {
        setError(err.message || "Unable to load owner dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    setError("");
    setMessage("");

    try {
      await loadBookings();
      setMessage("Bookings updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to refresh bookings.");
    } finally {
      setRefreshing(false);
    }
  }

  async function handleBookingAction(id, action) {
    setProcessingId(id);
    setError("");
    setMessage("");

    try {
      if (action === "confirm") {
        await api.confirmBooking(id);
        setMessage(`Booking #${id} confirmed successfully.`);
      } else {
        if (!window.confirm(`Cancel booking #${id}?`)) {
          return;
        }

        await api.cancelBooking(id);
        setMessage(`Booking #${id} cancelled successfully.`);
      }

      await loadBookings();
    } catch (err) {
      setError(err.message || "Unable to update booking.");
    } finally {
      setProcessingId(null);
    }
  }

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

  const total = bookings.length;
  const pending = bookings.filter(b => b.status === "pending").length;
  const confirmed = bookings.filter(b => b.status === "confirmed").length;
  const cancelled = bookings.filter(b => b.status === "cancelled").length;

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter(b => b.status === filter);

  if (loading) {
    return (
      <main className="owner-loading">
        <div className="owner-loader"></div>
        <p>Preparing your management dashboard...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="owner-loading">
        <div className="owner-access-card">
          <div className="owner-access-icon">✦</div>
          <h2>Owner Access Required</h2>
          <p>{error || "Please sign in with an authorized owner account."}</p>
          <a href="#owner-login" className="owner-primary-button">
            Owner Login
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="owner-page">
      <div className="owner-container">

        <header className="owner-header">
          <a href="#home" className="owner-brand">
            HOTEL <span>IN KONKAN</span>
            <small>MANAGEMENT PORTAL</small>
          </a>

          <div className="owner-header-right">
            <div className="owner-profile">
              <div className="owner-avatar">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong>{user.username}</strong>
                <span>Administrator</span>
              </div>
            </div>

            <button
              className="owner-logout"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? "Logging out..." : "Logout"}
              <span>↗</span>
            </button>
          </div>
        </header>

        <section className="owner-welcome">
          <div>
            <p className="owner-eyebrow">OVERVIEW / MANAGEMENT</p>
            <h1>
              Welcome back, <i>{user.username}.</i>
            </h1>
            <p className="owner-welcome-description">
              Here's what's happening with your hotel reservations.
            </p>
          </div>

          <div className="owner-date">
            <span>YOUR MANAGEMENT PANEL</span>
            <strong>Hotel Operations</strong>
            <small>Reservations & Guest Management</small>
          </div>
        </section>

        {error && (
          <div className="owner-alert owner-alert-error">
            <span>!</span>
            {error}
          </div>
        )}

        {message && (
          <div className="owner-alert owner-alert-success">
            <span>✓</span>
            {message}
          </div>
        )}

        <section className="owner-stats">
          <article className="owner-stat-card owner-stat-total">
            <div className="owner-stat-top">
              <span>TOTAL BOOKINGS</span>
              <div className="owner-stat-icon">▤</div>
            </div>
            <strong>{total}</strong>
            <p>All reservations</p>
          </article>

          <article className="owner-stat-card owner-stat-pending">
            <div className="owner-stat-top">
              <span>PENDING</span>
              <div className="owner-stat-icon">◷</div>
            </div>
            <strong>{pending}</strong>
            <p>Awaiting confirmation</p>
          </article>

          <article className="owner-stat-card owner-stat-confirmed">
            <div className="owner-stat-top">
              <span>CONFIRMED</span>
              <div className="owner-stat-icon">✓</div>
            </div>
            <strong>{confirmed}</strong>
            <p>Confirmed reservations</p>
          </article>

          <article className="owner-stat-card owner-stat-cancelled">
            <div className="owner-stat-top">
              <span>CANCELLED</span>
              <div className="owner-stat-icon">×</div>
            </div>
            <strong>{cancelled}</strong>
            <p>Cancelled reservations</p>
          </article>
        </section>

        <section className="owner-bookings-section">
          <div className="owner-section-heading">
            <div>
              <p className="owner-eyebrow">GUEST SERVICES</p>
              <h2>Reservation Management</h2>
              <p className="owner-section-description">
                Review guest information and manage hotel reservations.
              </p>
            </div>

            <button
              className="owner-refresh"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <span>{refreshing ? "↻" : "⟳"}</span>
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="owner-filter-bar">
            {[
              ["all", "All Bookings", total],
              ["pending", "Pending", pending],
              ["confirmed", "Confirmed", confirmed],
              ["cancelled", "Cancelled", cancelled],
            ].map(([value, label, count]) => (
              <button
                key={value}
                className={filter === value ? "owner-filter active" : "owner-filter"}
                onClick={() => setFilter(value)}
              >
                {label}
                <span>{count}</span>
              </button>
            ))}
          </div>

          {filteredBookings.length === 0 ? (
            <div className="owner-empty">
              <div className="owner-empty-icon">▤</div>
              <h3>No reservations found</h3>
              <p>
                {bookings.length === 0
                  ? "New customer reservations will appear here."
                  : "There are no bookings in this category."}
              </p>
            </div>
          ) : (
            <div className="owner-booking-list">
              {filteredBookings.map(booking => (
                <article className="owner-booking-card" key={booking.id}>

                  <div className="owner-booking-top">
                    <div>
                      <span className="owner-booking-number">
                        RESERVATION #{booking.id}
                      </span>
                      <h3>{booking.hotel_name || "Hotel Reservation"}</h3>
                      {booking.room_name && (
                        <p className="owner-room-name">
                          {booking.room_name}
                        </p>
                      )}
                    </div>

                    <span className={`owner-status ${booking.status}`}>
                      <span></span>
                      {booking.status}
                    </span>
                  </div>

                  <div className="owner-card-divider"></div>

                  <div className="owner-booking-content">
                    <div className="owner-customer">
                      <span className="owner-detail-label">
                        GUEST INFORMATION
                      </span>

                      <h4>{booking.customer_name || "Not provided"}</h4>

                      <p>
                        <span>Email</span>
                        {booking.customer_email || "Not provided"}
                      </p>

                      <p>
                        <span>Phone</span>
                        {booking.customer_phone || "Not provided"}
                      </p>
                    </div>

                    <div className="owner-booking-details">
                      <div>
                        <span>CHECK-IN</span>
                        <strong>{booking.check_in || "—"}</strong>
                      </div>

                      <div>
                        <span>CHECK-OUT</span>
                        <strong>{booking.check_out || "—"}</strong>
                      </div>

                      <div>
                        <span>GUESTS</span>
                        <strong>{booking.guests ?? "—"}</strong>
                      </div>
                    </div>
                  </div>

                  {booking.customer_note && (
                    <div className="owner-note">
                      <span>GUEST NOTE</span>
                      <p>{booking.customer_note}</p>
                    </div>
                  )}

                  {booking.status === "pending" && (
                    <div className="owner-actions">
                      <button
                        className="owner-confirm"
                        onClick={() => handleBookingAction(booking.id, "confirm")}
                        disabled={processingId === booking.id}
                      >
                        {processingId === booking.id
                          ? "Processing..."
                          : "✓ Confirm Reservation"}
                      </button>

                      <button
                        className="owner-cancel"
                        onClick={() => handleBookingAction(booking.id, "cancel")}
                        disabled={processingId === booking.id}
                      >
                        Cancel Reservation
                      </button>
                    </div>
                  )}

                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="owner-footer">
          <div>
            <strong>HOTEL <span>IN KONKAN</span></strong>
            <p>Premium Hospitality Management</p>
          </div>

          <a href="#home">Back to Website ↗</a>
        </footer>

      </div>
    </main>
  );
}

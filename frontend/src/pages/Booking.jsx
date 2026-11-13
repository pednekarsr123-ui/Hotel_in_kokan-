
import React, { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import "./OwnerLogin.css";
import "./Booking.css";

function getToday() {
  const date = new Date();
  const offset = date.getTimezoneOffset();

  return new Date(date.getTime() - offset * 60000)
    .toISOString()
    .split("T")[0];
}

function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);

  return Math.max(0, Math.round((end - start) / 86400000));
}

function getBookingParams() {
  return new URLSearchParams(window.location.hash.split("?")[1] || "");
}

export default function Booking() {
  const [hotels, setHotels] = useState([]);

  const [form, setForm] = useState({
    hotel: getBookingParams().get("hotel") || "",
    room: getBookingParams().get("room") || "",
    check_in: "",
    check_out: "",
    guests: 1,
    customer_note: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.getHotels()
      .then(data => setHotels(data.results || data))
      .catch(() => setError("Unable to load hotels."));
  }, []);

  const selectedHotel = hotels.find(
    hotel => String(hotel.id) === String(form.hotel)
  );

  const rooms = selectedHotel?.rooms || [];

  const selectedRoom = rooms.find(
    room => String(room.id) === String(form.room)
  );

  const nights = calculateNights(form.check_in, form.check_out);

  const pricePerNight = selectedRoom
    ? Number(selectedRoom.price_per_night)
    : 0;

  const totalPrice = useMemo(
    () => pricePerNight * nights,
    [pricePerNight, nights]
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setForm(previous => {
      if (name === "hotel") {
        return { ...previous, hotel: value, room: "", guests: 1 };
      }

      if (name === "room") {
        return { ...previous, room: value, guests: 1 };
      }

      return { ...previous, [name]: value };
    });

    setMessage("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!form.hotel) {
      setError("Please select a hotel.");
      return;
    }

    if (!form.room || !selectedRoom) {
      setError("Please select a room.");
      return;
    }

    if (!form.check_in || !form.check_out) {
      setError("Please select both check-in and check-out dates.");
      return;
    }

    if (form.check_in < getToday()) {
      setError("Check-in cannot be in the past.");
      return;
    }

    if (form.check_out <= form.check_in) {
      setError("Check-out must be after check-in.");
      return;
    }

    if (
      Number(form.guests) < 1 ||
      Number(form.guests) > selectedRoom.max_guests
    ) {
      setError(`This room allows a maximum of ${selectedRoom.max_guests} guests.`);
      return;
    }

    setLoading(true);

    try {
      await api.createBooking({
        ...form,
        hotel: Number(form.hotel),
        room: Number(form.room),
        guests: Number(form.guests),
      });

      setMessage(
        "Your booking request has been submitted successfully. You can track its status in My Dashboard."
      );

      setForm({
        hotel: "",
        room: "",
        check_in: "",
        check_out: "",
        guests: 1,
        customer_note: "",
      });
    } catch (err) {
      setError(err.message || "Please log in before submitting your booking.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="owner-login-page booking-auth-page">
      <div className="owner-login-decoration owner-login-decoration-one" />
      <div className="owner-login-decoration owner-login-decoration-two" />

      <section className="owner-login-card booking-auth-card">
        <a href="#home" className="owner-login-brand">
          HOTEL <span>IN KONKAN</span>
        </a>

        <div className="owner-login-icon">
          <span>✦</span>
        </div>

        <p className="owner-login-eyebrow">YOUR KONKAN JOURNEY</p>

        <h1>
          Plan your <i>stay.</i>
        </h1>

        <p className="owner-login-description">
          Choose your preferred hotel and room, then send us your booking request.
        </p>

        {message && (
          <div className="owner-login-success" role="status">
            {message}
          </div>
        )}

        {error && (
          <div className="owner-login-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="booking-hotel">Select your hotel</label>
          <select
            id="booking-hotel"
            name="hotel"
            value={form.hotel}
            onChange={handleChange}
            required
          >
            <option value="">Choose a hotel</option>
            {hotels.map(hotel => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name} - {hotel.location}
              </option>
            ))}
          </select>

          {selectedHotel && (
            <div className="booking-hotel-preview">
              {selectedHotel.image_url && (
                <img src={selectedHotel.image_url} alt={selectedHotel.name} />
              )}
              <div>
                <h3>{selectedHotel.name}</h3>
                <p>{selectedHotel.location}</p>
                <strong>{rooms.length} room options available</strong>
              </div>
            </div>
          )}

          {selectedHotel && (
            <>
              <label htmlFor="booking-room">Select your room</label>
              <select
                id="booking-room"
                name="room"
                value={form.room}
                onChange={handleChange}
                required
              >
                <option value="">Choose a room</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.name} - ₹{room.price_per_night} / night
                    (Maximum {room.max_guests} guests)
                  </option>
                ))}
              </select>
            </>
          )}

          {selectedHotel && rooms.length === 0 && (
            <div className="booking-inline-error">
              No active rooms are currently available for this hotel.
              Please contact the hotel team.
            </div>
          )}

          {selectedRoom && (
            <div className="booking-hotel-preview booking-room-preview">
              <div>
                <h3>{selectedRoom.name}</h3>
                <p>{selectedRoom.description}</p>
                <strong>₹{selectedRoom.price_per_night} / night</strong>
                <p>Maximum guests: {selectedRoom.max_guests}</p>
                {selectedRoom.amenities?.length > 0 && (
                  <p>Amenities: {selectedRoom.amenities.join(", ")}</p>
                )}
              </div>
            </div>
          )}

          <div className="booking-auth-grid">
            <div>
              <label htmlFor="booking-check-in">Check-in</label>
              <input
                id="booking-check-in"
                type="date"
                name="check_in"
                value={form.check_in}
                onChange={handleChange}
                min={getToday()}
                required
              />
            </div>

            <div>
              <label htmlFor="booking-check-out">Check-out</label>
              <input
                id="booking-check-out"
                type="date"
                name="check_out"
                value={form.check_out}
                onChange={handleChange}
                min={form.check_in || getToday()}
                required
              />
            </div>
          </div>

          <label htmlFor="booking-guests">Number of guests</label>
          <input
            id="booking-guests"
            type="number"
            name="guests"
            min="1"
            max={selectedRoom?.max_guests || 1}
            value={form.guests}
            onChange={handleChange}
            required
            disabled={!selectedRoom}
          />

          {selectedRoom && (
            <p className="booking-field-hint">
              This room allows up to {selectedRoom.max_guests} guests.
            </p>
          )}

          <label htmlFor="booking-note">Special requests</label>
          <textarea
            id="booking-note"
            name="customer_note"
            value={form.customer_note}
            onChange={handleChange}
            placeholder="Tell us about any special requirements..."
            rows="4"
          />

          {selectedRoom && nights > 0 && (
            <div className="booking-price-summary">
              <h3>Booking Summary</h3>
              <div><span>Hotel</span><strong>{selectedHotel.name}</strong></div>
              <div><span>Room</span><strong>{selectedRoom.name}</strong></div>
              <div>
                <span>Price per night</span>
                <strong>₹{pricePerNight.toLocaleString("en-IN")}</strong>
              </div>
              <div><span>Number of nights</span><strong>{nights}</strong></div>
              <div><span>Guests</span><strong>{form.guests}</strong></div>
              <div className="booking-total">
                <span>Estimated total</span>
                <strong>₹{totalPrice.toLocaleString("en-IN")}</strong>
              </div>
              <p>
                This is an estimate based on the selected room's listed nightly
                rate. Final charges and availability must be confirmed by the hotel.
              </p>
            </div>
          )}

          <button
            className="owner-login-submit"
            type="submit"
            disabled={loading || !selectedRoom}
          >
            {loading ? "Submitting..." : "Submit Booking Request"}
            <span>→</span>
          </button>
        </form>

        <div className="owner-login-footer">
          <a href="#dashboard">My Dashboard</a>
          <a href="#home">Back to Home</a>
        </div>

        <p className="booking-auth-footnote">
          Your request remains pending until reviewed by the hotel team.
        </p>
      </section>
    </main>
  );
}


import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import "./HotelDetails.css";

const kokanKinaraImages = {
  exterior: "/hotels/IMG-20261112-WA0026.jpg",
  rooms: {
    1: "/hotels/IMG-20261112-WA0030.jpg",
    2: "/hotels/IMG-20261112-WA0033.jpg",
    3: "/hotels/IMG-20261112-WA0027.jpg",
    4: "/hotels/IMG-20261112-WA0037.jpg"
  },
  restaurant: "/hotels/IMG-20261112-WA0032.jpg",
  package: "/hotels/IMG-20261112-WA0035.jpg"
};

const hotelGalleries = {
  "rajgad-resort": [
    {
      url: "/rajgad/photo1.jpg",
      title: "Resort exterior and swimming pool",
      type: "RESORT VIEW"
    },
    {
      url: "/rajgad/photo2.jpg",
      title: "Resort at night",
      type: "NIGHT VIEW"
    },
    {
      url: "/rajgad/photo3.jpg",
      title: "Rajgad Resort entrance",
      type: "ENTRANCE"
    },
    {
      url: "/rajgad/photo4.jpg",
      title: "Standard room",
      type: "STANDARD ROOM"
    },
    {
      url: "/rajgad/photo5.jpg",
      title: "Twin bedroom",
      type: "TWIN ROOM"
    },
    {
      url: "/rajgad/photo6.jpg",
      title: "Swimming pool",
      type: "SWIMMING POOL"
    },
    {
      url: "/rajgad/photo7.jpg",
      title: "Deluxe bedroom",
      type: "DELUXE ROOM"
    }
  ]
};

export default function HotelDetails({ hotelId }) {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    async function loadHotel() {
      setLoading(true);
      setError("");
      setSelectedImage("");

      try {
        const data = await api.getHotels();
        const hotels = data.results || data;

        const selectedHotel = hotels.find(
          item => String(item.id) === String(hotelId)
        );

        if (!selectedHotel) {
          setError("Hotel not found.");
        } else {
          setHotel(selectedHotel);
        }
      } catch {
        setError("Unable to load hotel details.");
      } finally {
        setLoading(false);
      }
    }

    if (hotelId) {
      loadHotel();
    } else {
      setError("No hotel was selected.");
      setLoading(false);
    }
  }, [hotelId]);

  if (loading) {
    return (
      <main className="hotel-details-loading">
        Loading hotel details...
      </main>
    );
  }

  if (error || !hotel) {
    return (
      <main className="hotel-details-loading">
        <h2>{error || "Hotel not found."}</h2>
        <a href="#home">Back to Home</a>
      </main>
    );
  }

  const isRajgad = hotel.slug === "rajgad-resort";

  const amenities = Array.isArray(hotel.amenities)
    ? hotel.amenities
    : [];

  const rooms = Array.isArray(hotel.rooms)
    ? hotel.rooms
    : [];

  const galleryImages = isRajgad
    ? hotelGalleries["rajgad-resort"]
    : [
        {
          url: kokanKinaraImages.exterior,
          title: "Hotel exterior",
          type: "HOTEL VIEW"
        },
        {
          url: kokanKinaraImages.rooms[4],
          title: "AC Room",
          type: "AC ROOM"
        },
        {
          url: kokanKinaraImages.rooms[3],
          title: "Room interior",
          type: "ROOM INTERIOR"
        },
        {
          url: kokanKinaraImages.restaurant,
          title: "Restaurant and dining area",
          type: "DINING"
        },
        {
          url: kokanKinaraImages.package,
          title: "Full day package",
          type: "SPECIAL PACKAGE"
        }
      ];

  const gallerySlots = Array.from(
    { length: Math.max(4, galleryImages.length) },
    (_, index) => galleryImages[index] || null
  );

  return (
    <main className="hotel-details-page">
      <div className="hotel-details-container">
        <a href="#home" className="hotel-back-link">
          ← Back to all stays
        </a>

        <section className="hotel-gallery-section">
          <div className="hotel-gallery-heading">
            <div>
              <p className="hotel-details-eyebrow">
                EXPLORE THE PROPERTY
              </p>
              <h2>{hotel.name} Photo Gallery</h2>
            </div>
            <span>Discover your stay</span>
          </div>

          <div className="hotel-photo-gallery">
            {gallerySlots.map((item, index) => (
              <button
                type="button"
                key={index}
                className={`hotel-gallery-item hotel-gallery-item-${index + 1}`}
                onClick={() => {
                  if (item?.url) {
                    setSelectedImage(item.url);
                  }
                }}
                disabled={!item?.url}
                aria-label={item?.title || "Photograph coming soon"}
              >
                {item?.url ? (
                  <>
                    <img src={item.url} alt={item.title} />
                    <span className="hotel-gallery-image-label">
                      {item.type}
                    </span>
                    <span className="hotel-gallery-zoom">
                      View photo ↗
                    </span>
                  </>
                ) : (
                  <span className="hotel-gallery-placeholder">
                    <span className="hotel-gallery-placeholder-icon">
                      ◇
                    </span>
                    <strong>Photograph coming soon</strong>
                    <small>
                      {hotel.name} photographs will appear here
                    </small>
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {selectedImage && (
          <div
            className="hotel-gallery-lightbox"
            onClick={() => setSelectedImage("")}
          >
            <button
              type="button"
              className="hotel-gallery-close"
              onClick={() => setSelectedImage("")}
              aria-label="Close photograph"
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt={`${hotel.name} enlarged photograph`}
              onClick={event => event.stopPropagation()}
            />
          </div>
        )}

        <div className="hotel-details-content">
          <div className="hotel-details-main">
            <p className="hotel-details-eyebrow">
              DISCOVER YOUR STAY
            </p>

            <h1>{hotel.name}</h1>

            <p className="hotel-details-location">
              Location: {hotel.location}
            </p>

            <div className="hotel-details-description">
              <h2>About this stay</h2>
              <p>{hotel.description}</p>
            </div>

            <div className="hotel-details-amenities">
              <h2>Stay amenities</h2>

              {amenities.length ? (
                <div className="hotel-amenities-list">
                  {amenities.map((item, index) => (
                    <span key={index}>{String(item)}</span>
                  ))}
                </div>
              ) : (
                <p>
                  Amenities information will be updated soon.
                </p>
              )}
            </div>

            {hotel.address && (
              <div className="hotel-details-address">
                <h2>Location details</h2>
                <p>{hotel.address}</p>
              </div>
            )}

            {hotel.phone_number && (
              <div className="hotel-details-address">
                <h2>Contact the hotel</h2>
                <p>{hotel.phone_number}</p>
              </div>
            )}
          </div>

          <aside className="hotel-booking-card">
            <p>YOUR STAY STARTS HERE</p>

            <h2>
              {hotel.price_per_night != null
                ? `₹${Number(hotel.price_per_night).toLocaleString("en-IN")}`
                : "Contact for price"}
              {hotel.price_per_night != null && (
                <small> / night</small>
              )}
            </h2>

            <p>
              {hotel.price_per_night != null
                ? "Listed hotel starting price. Room prices may differ depending on your selection."
                : "Contact the hotel for current room rates and availability."}
            </p>

            <a
              href={`#booking?hotel=${hotel.id}`}
              className="hotel-book-button"
            >
              View booking options →
            </a>
          </aside>
        </div>

        <section className="hotel-rooms-section">
          <div className="hotel-rooms-heading">
            <p className="hotel-details-eyebrow">
              FIND YOUR PERFECT ROOM
            </p>

            <h2>Rooms & Accommodation</h2>

            <p>
              Explore available room categories and choose
              the option that suits your stay.
            </p>
          </div>

          {rooms.length > 0 ? (
            <div className="hotel-rooms-grid">
              {rooms.map(room => {
                const roomAmenities = Array.isArray(room.amenities)
                  ? room.amenities
                  : [];

                const roomImage = isRajgad
                  ? room.image_url
                  : kokanKinaraImages.rooms[room.id] || room.image_url;

                return (
                  <article
                    className="hotel-room-card"
                    key={room.id}
                  >
                    <div className="hotel-room-image">
                      {roomImage ? (
                        <img
                          src={roomImage}
                          alt={`${hotel.name} ${room.name}`}
                          loading="lazy"
                        />
                      ) : (
                        <div className="hotel-room-placeholder">
                          <span>ROOM PHOTOGRAPH</span>
                          <strong>{room.name}</strong>
                        </div>
                      )}
                    </div>

                    <div className="hotel-room-content">
                      <p className="hotel-details-eyebrow">
                        ROOM CATEGORY
                      </p>

                      <h3>{room.name}</h3>

                      <p className="hotel-room-description">
                        {room.description ||
                          "Comfortable accommodation for your stay."}
                      </p>

                      <div className="hotel-room-capacity">
                        <span>Maximum guests</span>
                        <strong>{room.max_guests}</strong>
                      </div>

                      {roomAmenities.length > 0 && (
                        <div className="hotel-room-amenities">
                          {roomAmenities.map((item, index) => (
                            <span key={index}>{String(item)}</span>
                          ))}
                        </div>
                      )}

                      <div className="hotel-room-bottom">
                        <div>
                          <strong>
                            ₹{Number(
                              room.price_per_night
                            ).toLocaleString("en-IN")}
                          </strong>
                          <small> / night</small>
                        </div>

                        <a
                          href={`#booking?hotel=${hotel.id}&room=${room.id}`}
                          className="hotel-room-book-button"
                        >
                          Book this room →
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="hotel-rooms-empty">
              Room information will be updated soon.
              Please contact the hotel team for details.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

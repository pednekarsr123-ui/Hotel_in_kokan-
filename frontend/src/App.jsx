
import React, { useEffect, useState } from "react";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import OwnerLogin from "./pages/OwnerLogin";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import HotelDetails from "./pages/HotelDetails";

const API = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api"
).replace(/\/$/, "");

async function get(path) {
  const response = await fetch(`${API}/${path}/`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }

  return response.json();
}

function readNavigation() {
  const [currentPage, query] = window.location.hash
    .replace(/^#/, "")
    .split("?");

  const params = new URLSearchParams(query || "");

  return {
    page: currentPage || "home",
    hotelId: params.get("id"),
  };
}

export default function App() {
  const [hotels, setHotels] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState("");
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [navigation, setNavigation] = useState(readNavigation);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function handleNavigation() {
      setNavigation(readNavigation());
      setMobileMenuOpen(false);
      setSelectedGalleryImage(null);
    }

    window.addEventListener("hashchange", handleNavigation);

    return () => window.removeEventListener("hashchange", handleNavigation);
  }, []);

  useEffect(() => {
    function handleGalleryKeys(event) {
      if (!selectedGalleryImage) return;

      if (event.key === "ArrowRight") {
        setSelectedGalleryImage((current) => ({
          ...current,
          index: (current.index + 1) % current.images.length,
        }));
      }

      if (event.key === "ArrowLeft") {
        setSelectedGalleryImage((current) => ({
          ...current,
          index:
            (current.index - 1 + current.images.length) %
            current.images.length,
        }));
      }

      if (event.key === "Escape") {
        setSelectedGalleryImage(null);
      }
    }

    window.addEventListener("keydown", handleGalleryKeys);

    return () => window.removeEventListener("keydown", handleGalleryKeys);
  }, [selectedGalleryImage]);

  useEffect(() => {
    let active = true;

    async function loadHomepageData() {
      try {
        const [hotelData, destinationData] = await Promise.all([
          get("hotels"),
          get("destinations"),
        ]);

        if (!active) return;

        setHotels(hotelData.results || hotelData);
        setDestinations(destinationData.results || destinationData);
        setError("");
      } catch {
        if (active) {
          setError(
            "Unable to load listings. Please check that the Django backend is running and listings are available."
          );
        }
      }
    }

    loadHomepageData();

    return () => {
      active = false;
    };
  }, []);

  const validPages = [
    "home",
    "booking",
    "login",
    "owner-login",
    "register",
    "dashboard",
    "owner",
    "hotel",
  ];

  const currentPage = validPages.includes(navigation.page)
    ? navigation.page
    : "home";

  const isPortalPage = [
    "login",
    "owner-login",
    "register",
    "dashboard",
    "owner",
  ].includes(currentPage);

  const galleryImages = [
    {
      src: "/hotels/IMG-20261112-WA0026.jpg",
      alt: "Hotel Kokan Kinara exterior",
      title: "Hotel Exterior",
    },
    {
      src: "/hotels/IMG-20261112-WA0027.jpg",
      alt: "AC room at Hotel Kokan Kinara",
      title: "AC Room",
    },
    {
      src: "/hotels/IMG-20261112-WA0037.jpg",
      alt: "Second AC room option",
      title: "Comfortable Rooms",
    },
    {
      src: "/hotels/IMG-20261112-WA0030.jpg",
      alt: "Non AC room at Hotel Kokan Kinara",
      title: "Non-AC Room",
    },
    {
      src: "/hotels/IMG-20261112-WA0033.jpg",
      alt: "Second non AC room option",
      title: "Room Interiors",
    },
    {
      src: "/hotels/IMG-20261112-WA0032.jpg",
      alt: "Hotel restaurant and dining",
      title: "Restaurant & Dining",
    },
  ];

  const rajgadGalleryImages = [
    {
      src: "/rajgad/photo1.jpg",
      alt: "Rajgad Resort exterior",
      title: "Resort Exterior",
    },
    {
      src: "/rajgad/photo2.jpg",
      alt: "Rajgad Resort night view",
      title: "Night View",
    },
    {
      src: "/rajgad/photo3.jpg",
      alt: "Rajgad Resort entrance",
      title: "Resort Entrance",
    },
    {
      src: "/rajgad/photo4.jpg",
      alt: "Rajgad Resort standard room",
      title: "Standard Room",
    },
    {
      src: "/rajgad/photo5.jpg",
      alt: "Rajgad Resort twin bedroom",
      title: "Twin Bedroom",
    },
    {
      src: "/rajgad/photo6.jpg",
      alt: "Rajgad Resort swimming pool",
      title: "Swimming Pool",
    },
    {
      src: "/rajgad/photo7.jpg",
      alt: "Rajgad Resort deluxe bedroom",
      title: "Deluxe Bedroom",
    },
  ];

  return (
    <div className={currentPage === "home" ? "home-page" : "app-shell"}>
      {!isPortalPage && (
        <nav className="site-nav">
          <a
            className="brand"
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
          >
            HOTEL <span>IN KONKAN</span>
          </a>

          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? "×" : "☰"}
          </button>

          <div className={`site-nav-links ${mobileMenuOpen ? "is-open" : ""}`}>
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#stays" onClick={() => setMobileMenuOpen(false)}>Stays</a>
            <a href="#packages" onClick={() => setMobileMenuOpen(false)}>Special Package</a>
            <a href="#location" onClick={() => setMobileMenuOpen(false)}>Destinations</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#booking" className="nav-book" onClick={() => setMobileMenuOpen(false)}>Book now</a>
            <a href="#login" onClick={() => setMobileMenuOpen(false)}>Login</a>
            <a href="#owner-login" className="nav-owner" onClick={() => setMobileMenuOpen(false)}>Owner</a>
          </div>
        </nav>
      )}

      {currentPage === "booking" && <Booking />}
      {currentPage === "login" && <Login />}
      {currentPage === "owner-login" && <OwnerLogin />}
      {currentPage === "register" && <Register />}
      {currentPage === "dashboard" && <Dashboard />}
      {currentPage === "owner" && <OwnerDashboard />}
      {currentPage === "hotel" && <HotelDetails hotelId={navigation.hotelId} />}

      {currentPage === "home" && (
        <>
          <header className="home-hero" id="home">
            <div className="home-hero-overlay" />

            <div className="home-hero-content">
              <span className="home-eyebrow">
                DISCOVER THE BEAUTY OF MAHARASHTRA
              </span>

              <h1>
                Find your own
                <br />
                piece of <i>Konkan.</i>
              </h1>

              <p>
                Where the sea meets simplicity. Discover beautiful stays,
                peaceful beaches and the warmth of Konkan hospitality.
              </p>

              <div className="home-hero-actions">
                <a href="#stays" className="home-primary-button">
                  Explore Stays <span>↗</span>
                </a>
                <a href="#packages" className="home-text-button">
                  Discover our package
                </a>
              </div>
            </div>

            <div className="home-hero-location">
              <span className="home-location-line" />
              KONKAN COAST · MAHARASHTRA · INDIA
            </div>

            <div className="home-hero-count">
              <span>01</span> / 05
            </div>
          </header>

          <main>
            <section className="home-stays section-padding" id="stays">
              <div className="home-section-heading">
                <div>
                  <span className="home-eyebrow home-eyebrow-dark">
                    STAY SOMEWHERE SPECIAL
                  </span>
                  <h2>
                    Places to stay.
                    <br />
                    <i>Memories to keep.</i>
                  </h2>
                </div>

                <p>
                  From peaceful homestays to welcoming coastal hotels,
                  find a place that feels like your own.
                </p>
              </div>

              {error && <div className="home-error">{error}</div>}

              <div className="home-hotel-grid">
                {hotels.length ? (
                  hotels.slice(0, 6).map((hotel, index) => (
                    <article className="home-hotel-card" key={hotel.id}>
                      <a
                        href={`#hotel?id=${hotel.id}`}
                        className="home-hotel-image"
                        style={{
                          backgroundImage: hotel.image_url
                            ? `url("${hotel.image_url}")`
                            : "linear-gradient(135deg, #244b3c, #9aab8b)",
                        }}
                      >
                        <span className="home-image-number">0{index + 1}</span>

                        <div className="home-hotel-info">
                          <span className="home-card-location">
                            {hotel.location || "Konkan, Maharashtra"}
                          </span>

                          <h3>{hotel.name}</h3>

                          <div className="home-hotel-bottom">
                            <p>
                              <strong>₹{hotel.price_per_night}</strong>
                              <span> / night</span>
                            </p>
                            <span className="home-hotel-arrow">↗</span>
                          </div>

                          <span className="home-image-view">
                            EXPLORE YOUR STAY ↗
                          </span>
                        </div>
                      </a>
                    </article>
                  ))
                ) : (
                  <div className="home-empty">No hotels available.</div>
                )}
              </div>
            </section>

            <section className="home-package section-padding" id="packages">
              <div className="package-heading">
                <span className="home-eyebrow home-eyebrow-dark">
                  YOUR KONKAN GETAWAY
                </span>

                <h2>
                  Escape the ordinary.
                  <br />
                  <i>Experience Kokan Kinara.</i>
                </h2>

                <p>
                  A refreshing beachside stay with comfortable accommodation,
                  delicious meals and unforgettable coastal experiences.
                </p>
              </div>

              <div className="package-showcase">
                <div className="package-visual">
                  <img
                    src="/hotels/IMG-20261112-WA0035.jpg"
                    alt="Kokan Kinara beachside package"
                  />

                  <div className="package-image-caption">
                    <span>YOUR COASTAL ESCAPE</span>
                    <strong>Shiroda, Sindhudurg</strong>
                  </div>

                  <div className="package-image-number">01 / 01</div>
                </div>

                <div className="package-information">
                  <div className="package-topline">
                    <span>HOTEL KOKAN KINARA</span>
                    <span className="package-status">SPECIAL PACKAGE</span>
                  </div>

                  <h3>
                    One day.
                    <br />
                    One night.
                    <br />
                    <i>Pure Konkan bliss.</i>
                  </h3>

                  <p className="package-intro">
                    Leave the everyday behind and enjoy a relaxing getaway
                    near the beautiful Shiroda Beach.
                  </p>

                  <div className="package-inclusions">
                    <div className="package-inclusion">
                      <span className="package-icon">01</span>
                      <div>
                        <h4>Stay</h4>
                        <p>
                          <span>• Comfortable accommodation</span>
                          <span>• Relaxing setting</span>
                        </p>
                      </div>
                    </div>

                    <div className="package-inclusion">
                      <span className="package-icon">02</span>
                      <div>
                        <h4>Food & Dining</h4>
                        <p>
                          <span>• Lunch: Veg, Chicken or Bangda Thali</span>
                          <span>• Dinner: Veg Fried Rice or Chicken</span>
                          <span>• Breakfast: Included</span>
                        </p>
                      </div>
                    </div>

                    <div className="package-inclusion">
                      <span className="package-icon">03</span>
                      <div>
                        <h4>Water Adventures</h4>
                        <p>
                          <span>• Boating</span>
                          <span>• Scuba diving</span>
                          <span>• Parasailing</span>
                          <span>• Banana ride</span>
                          <span>• Bumper ride</span>
                          <span>• Dolphin sightseeing</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="package-important-note">
                    <strong>GOOD TO KNOW</strong>
                    <p>
                      Water activities are at Shiroda Beach, approximately
                      1 km away. Watersports timing: 9 AM – 5 PM.
                    </p>
                  </div>

                  <div className="package-booking-area">
                    <a
                      className="package-whatsapp-button"
                      href="https://wa.me/919765841729?text=Hello%2C%20I%20am%20interested%20in%20the%20Hotel%20Kokan%20Kinara%201%20Day%201%20Night%20Full%20Package.%20Please%20share%20booking%20details."
                      target="_blank"
                      rel="noreferrer"
                    >
                      Enquire on WhatsApp <span>↗</span>
                    </a>

                    <a className="package-phone-link" href="tel:+919765841729">
                      Call +91 9765847129
                    </a>
                  </div>

                  <p className="package-alternate-contact">
                    Alternate contact: +91 9067008666
                  </p>
                </div>
              </div>
            </section>

            <section className="home-gallery section-padding" id="gallery">
              <div className="home-section-heading">
                <div>
                  <span className="home-eyebrow home-eyebrow-dark">
                    A GLIMPSE OF YOUR STAY
                  </span>
                  <h2>
                    Moments from
                    <br />
                    <i>Kokan Kinara.</i>
                  </h2>
                </div>

                <p>
                  Take a closer look at the rooms, spaces and experiences
                  waiting for you.
                </p>
              </div>

              <div className="home-gallery-grid">
                {galleryImages.map((image, index) => (
                  <button
                    type="button"
                    className={`home-gallery-item gallery-item-${index + 1}`}
                    key={image.src}
                    onClick={() =>
                      setSelectedGalleryImage({
                        images: galleryImages,
                        index,
                      })
                    }
                    aria-label={`View ${image.title}`}
                  >
                    <img src={image.src} alt={image.alt} loading="lazy" />
                    <span>{image.title}</span>
                    <b>↗</b>
                  </button>
                ))}
              </div>
            </section>

            <section className="home-gallery section-padding rajgad-gallery">
              <div className="home-section-heading">
                <div>
                  <span className="home-eyebrow home-eyebrow-dark">
                    A GLIMPSE OF YOUR STAY
                  </span>
                  <h2>
                    Moments at
                    <br />
                    <i>Rajgad Resort.</i>
                  </h2>
                </div>

                <p>
                  Discover the rooms, resort spaces and relaxing experiences
                  waiting for you at Rajgad Resort.
                </p>
              </div>

              <div className="home-gallery-grid">
                {rajgadGalleryImages.map((image, index) => (
                  <button
                    type="button"
                    className={`home-gallery-item gallery-item-${(index % 6) + 1}`}
                    key={image.src}
                    onClick={() =>
                      setSelectedGalleryImage({
                        images: rajgadGalleryImages,
                        index,
                      })
                    }
                    aria-label={`View ${image.title}`}
                  >
                    <img src={image.src} alt={image.alt} loading="lazy" />
                    <span>{image.title}</span>
                    <b>↗</b>
                  </button>
                ))}
              </div>
            </section>

            <section className="home-reviews section-padding" id="reviews">
              <span className="home-eyebrow home-eyebrow-dark">
                THE KONKAN EXPERIENCE
              </span>

              <h2>
                Simple moments.
                <br />
                <i>Lasting memories.</i>
              </h2>

              <p>
                Your time by the coast should feel easy, welcoming and
                unforgettable. We look forward to being part of your story.
              </p>

              <div className="home-review-note">
                <span>✦</span>
                <h3>We would love to hear about your stay.</h3>
                <p>Guest reviews will be featured here as they are shared.</p>
              </div>
            </section>

            <section className="home-location section-padding" id="location">
              <div className="home-section-heading">
                <div>
                  <span className="home-eyebrow home-eyebrow-dark">
                    YOUR KONKAN JOURNEY STARTS HERE
                  </span>
                  <h2>
                    Find us at
                    <br />
                    <i>Kokan Kinara.</i>
                  </h2>
                </div>

                <p>
                  Plan your visit to Hotel Kokan Kinara and enjoy the
                  peaceful coastal surroundings of Shiroda.
                </p>
              </div>

              <div className="home-location-layout">
                <div className="home-location-info">
                  <span className="home-package-label">HOTEL KOKAN KINARA</span>

                  <h3>Come experience Konkan hospitality.</h3>

                  <p>
                    1076 Shiroda Bagayatwadi, Shiroda Beach Road,
                    Vengurla, Maharashtra 416518.
                  </p>

                  <p>
                    <strong>Phone</strong>
                    <br />
                    +91 9765847129
                  </p>

                  <a
                    className="home-primary-button"
                    href="https://www.google.com/maps/place/Hotel+Kokan+Kinara+(SHIRODA)/@15.7633171,73.6537878,4683m/data=!3m1!1e3!4m14!1m3!2m2!1sHotel+Kokan+Kinara,+1076+Shiroda+Bagayatwadi,+Vengurla,+Maharashtra+416518!6e3!3m9!1s0x3bbff08affa12ab9:0x7734743b372892d0!5m2!4m1!1i2!8m2!3d15.7687844!4d73.6725816!15sCkpIb3RlbCBLb2thbiBLaW5hcmEsIDEwNzYgU2hpcm9kYSBCYWdheWF0d2FkaSwgVmVuZ3VybGEsIE1haGFyYXNodHJhIDQxNjUxOJIBBWhvdGVs4AEA!16s%2Fg%2F1tgfnk__?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Get Directions ↗
                  </a>
                </div>

                <div className="home-location-map">
                  <iframe
                    title="Hotel Kokan Kinara location"
                    src="https://maps.google.com/maps?q=Hotel%20Kokan%20Kinara%2C%201076%20Shiroda%20Bagayatwadi%2C%20Vengurla%2C%20Maharashtra%20416518&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>
            </section>

            <section className="home-location section-padding rajgad-location">
              <div className="home-section-heading">
                <div>
                  <span className="home-eyebrow home-eyebrow-dark">
                    YOUR NEXT KONKAN DESTINATION
                  </span>

                  <h2>
                    Find us at
                    <br />
                    <i>Rajgad Resort.</i>
                  </h2>
                </div>

                <p>
                  Visit Rajgad Resort in Malewad and experience a relaxing
                  stay in the beautiful Sindhudurg region.
                </p>
              </div>

              <div className="home-location-layout">
                <div className="home-location-info">
                  <span className="home-package-label">
                    RAJGAD RESORT
                  </span>

                  <h3>Discover a peaceful stay in Malewad.</h3>

                  <p>
                    H No. 1417, Redi–Belagavi Road,
                    Malewad, Sawantwadi,
                    Sindhudurg, Maharashtra 416510.
                  </p>

                  <p>
                    <strong>Phone</strong>
                    <br />
                    +91 74981 87320
                  </p>

                  <a
                    className="home-primary-button"
                    href="https://www.google.com/maps/search/?api=1&query=Rajgad+Resort%2C+Malewad%2C+Sawantwadi%2C+Sindhudurg%2C+Maharashtra+416510"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Get Directions ↗
                  </a>
                </div>

                <div className="home-location-map">
                  <iframe
                    title="Rajgad Resort location"
                    src="https://maps.google.com/maps?q=Rajgad%20Resort%2C%20Malewad%2C%20Sawantwadi%2C%20Sindhudurg%2C%20Maharashtra&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>
            </section>

          </main>

          {selectedGalleryImage && (
            <div
              className="home-lightbox"
              onClick={() => setSelectedGalleryImage(null)}
            >
              <button
                type="button"
                className="home-lightbox-close"
                onClick={() => setSelectedGalleryImage(null)}
                aria-label="Close gallery"
              >
                ×
              </button>

              <button
                type="button"
                className="home-lightbox-arrow home-lightbox-prev"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedGalleryImage((current) => ({
                    ...current,
                    index:
                      (current.index - 1 + current.images.length) %
                      current.images.length,
                  }));
                }}
                aria-label="Previous image"
              >
                ‹
              </button>

              <img
                src={selectedGalleryImage.images[selectedGalleryImage.index].src}
                alt={selectedGalleryImage.images[selectedGalleryImage.index].alt}
                onClick={(event) => event.stopPropagation()}
              />

              <button
                type="button"
                className="home-lightbox-arrow home-lightbox-next"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedGalleryImage((current) => ({
                    ...current,
                    index: (current.index + 1) % current.images.length,
                  }));
                }}
                aria-label="Next image"
              >
                ›
              </button>

              <span className="home-lightbox-count">
                {selectedGalleryImage.index + 1} / {selectedGalleryImage.images.length}
              </span>
            </div>
          )}

          <div className="home-floating-contact">
            <a
              href="https://wa.me/919765841729?text=Hello%2C%20I%20want%20to%20know%20more%20about%20Hotel%20Kokan%20Kinara."
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              WhatsApp
            </a>

            <a href="tel:+919765841729" aria-label="Call Hotel Kokan Kinara">
              Call Now
            </a>
          </div>

          <footer className="home-footer">
            <a className="home-footer-brand" href="#home">
              HOTEL <span>IN KONKAN</span>
            </a>

            <p>Discover more. Travel slower. Love Konkan.</p>

            <div className="home-footer-links">
              <a href="#stays">Stays</a>
              <a href="#packages">Special Package</a>
              <a href="#location">Destinations</a>
              <a href="#gallery">Gallery</a>
              <a href="#register">Create Account</a>
            </div>

            <small>
              © {new Date().getFullYear()} Hotel in Konkan. All rights reserved.
            </small>
          </footer>
        </>
      )}
    </div>
  );
}

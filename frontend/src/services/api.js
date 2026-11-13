
const API_URL = "/api";

async function getCsrfToken() {
  const response = await fetch(`${API_URL}/auth/csrf/`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unable to obtain CSRF token.");
  }

  const data = await response.json();
  return data.csrfToken;
}

async function request(endpoint, options = {}) {
  const method = (options.method || "GET").toUpperCase();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (!["GET", "HEAD", "OPTIONS", "TRACE"].includes(method)) {
    headers["X-CSRFToken"] = await getCsrfToken();
  }

  const response = await fetch(`${API_URL}/${endpoint}/`, {
    ...options,
    method,
    credentials: "include",
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail || JSON.stringify(data) || "Something went wrong"
    );
  }

  return data;
}

export const api = {
  getHotels: () => request("hotels"),
  getDestinations: () => request("destinations"),
  getPackages: () => request("packages"),
  getActivities: () => request("activities"),
  getBlogs: () => request("blogs"),

  getBookings: () => request("bookings"),

  createBooking: (booking) =>
    request("bookings", {
      method: "POST",
      body: JSON.stringify(booking),
    }),

  confirmBooking: (id) =>
    request(`bookings/${id}/confirm`, {
      method: "POST",
    }),

  cancelBooking: (id) =>
    request(`bookings/${id}/cancel`, {
      method: "POST",
    }),

  register: (user) =>
    request("auth/register", {
      method: "POST",
      body: JSON.stringify(user),
    }),

  login: (credentials) =>
    request("auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    request("auth/logout", {
      method: "POST",
    }),

  getCurrentUser: () => request("auth/me"),
};

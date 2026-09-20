const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(url, config);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Request failed. Please try again.');
  }
  return data;
}

export const api = {
  // Rooms & Beds
  getRooms: (status, type, beds) => {
    const params = new URLSearchParams();
    if (status && status !== 'ALL') params.append('status', status);
    if (type && type !== 'ALL') params.append('type', type);
    if (beds && beds > 0) params.append('beds', beds);
    const query = params.toString() ? `?${params.toString()}` : '';
    return request(`/rooms${query}`);
  },

  getStats: () => request('/rooms/stats'),

  updateRoomStatus: (id, status) =>
    request(`/rooms/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // Bookings
  createBooking: (bookingData) =>
    request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),

  getBookings: (email) => {
    const query = email ? `?email=${encodeURIComponent(email)}` : '';
    return request(`/bookings${query}`);
  },

  updateBookingStatus: (id, status) =>
    request(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // Auth & OTP
  sendOtp: (email, purpose = 'Verification') =>
    request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email, purpose }),
    }),

  verifyOtp: (email, otp) =>
    request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
};

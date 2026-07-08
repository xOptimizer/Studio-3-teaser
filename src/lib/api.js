/** In dev, default to Vite proxy (/api → localhost:3001) so ngrok HTTPS can reach the API without mixed-content blocks. */
import { normalizeCheckoutResponse } from './checkoutSession.js';

function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');
  if (import.meta.env.DEV) return '/api';
  return 'http://localhost:3001';
}

const API_URL = getApiBaseUrl();

const TOKEN_KEY = 'studio3_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        import.meta.env.DEV
          ? 'Could not reach the ticketing API. Start the Studio-3-event server on port 3001.'
          : 'Could not reach the ticketing API. Please try again in a moment.'
      );
    }
    throw error;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.error || data.message || 'Request failed';
    throw new Error(message);
  }

  return data;
}

export async function login(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchMe() {
  return apiFetch('/auth/me');
}

export async function fetchProfile() {
  return apiFetch('/profile');
}

export async function updateProfilePhone(phone) {
  return apiFetch('/profile', {
    method: 'PATCH',
    body: JSON.stringify({ phone }),
  });
}

export async function uploadProfilePhoto(file) {
  const token = getToken();
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch(`${API_URL}/profile/photo`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload photo');
  }
  return data;
}

export async function changePassword(currentPassword, newPassword) {
  return apiFetch('/profile/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function forgotPassword(email) {
  return apiFetch('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(email, otp, newPassword) {
  return apiFetch('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, otp, newPassword }),
  });
}

export async function setInitialPassword(newPassword) {
  return apiFetch('/auth/set-password', {
    method: 'POST',
    body: JSON.stringify({ newPassword }),
  });
}

export function resolveProfilePhotoUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_URL.replace(/\/$/, '')}${path}`;
}

export async function checkout(payload) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}/checkout`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        import.meta.env.DEV
          ? 'Could not reach the ticketing API. Start the Studio-3-event server on port 3001.'
          : 'Could not reach the ticketing API. Please try again in a moment.'
      );
    }
    throw error;
  }

  const data = await response.json().catch(() => ({}));

  if (data.success) {
    return data;
  }

  const normalized = normalizeCheckoutResponse(data, response.status);
  if (normalized) {
    return normalized;
  }

  throw new Error(data.message || data.error || 'Checkout failed');
}

export async function fetchCheckoutConfig() {
  return apiFetch('/checkout/config');
}

export async function createApplePaySession(payload) {
  return apiFetch('/checkout/apple-pay-session', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchTickets() {
  return apiFetch('/tickets');
}

export async function downloadTicketPdf(ticketId) {
  const token = getToken();
  const response = await fetch(`${API_URL}/tickets/${ticketId}/pdf`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error('Failed to download ticket');
  }

  return response.blob();
}

export async function fetchTicketQrBlob(ticketId) {
  const token = getToken();
  const response = await fetch(`${API_URL}/tickets/${ticketId}/qr`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error('Failed to load ticket QR code');
  }

  return response.blob();
}

export async function adminVerifyTicket(lookup) {
  return apiFetch('/admin/tickets/verify', {
    method: 'POST',
    body: JSON.stringify(lookup),
  });
}

export async function adminCheckInTicket(lookup) {
  return apiFetch('/admin/tickets/check-in', {
    method: 'POST',
    body: JSON.stringify(lookup),
  });
}

export async function adminFetchStats() {
  return apiFetch('/admin/stats');
}

export async function adminFetchCheckIns() {
  return apiFetch('/admin/check-ins');
}

export async function adminFetchOrders() {
  return apiFetch('/admin/orders');
}

export async function adminFetchFreePasses() {
  return apiFetch('/admin/free-passes');
}

export async function adminFetchEvents() {
  return apiFetch('/admin/events');
}

export async function adminIssueFreePasses({ eventId, guests }) {
  return apiFetch('/admin/free-passes', {
    method: 'POST',
    body: JSON.stringify({ eventId, guests }),
  });
}

export async function adminResendOrderTickets(orderId) {
  return apiFetch(`/admin/orders/${orderId}/resend`, { method: 'POST' });
}

export async function adminFetchTicketQrBlob(ticketId) {
  const token = getToken();
  const response = await fetch(`${API_URL}/admin/tickets/${ticketId}/qr`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error('Failed to load ticket QR code');
  }

  return response.blob();
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

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

export function resolveProfilePhotoUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_URL.replace(/\/$/, '')}${path}`;
}

export async function checkout(payload) {
  return apiFetch('/checkout', {
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

export async function adminVerifyTicket(qrToken) {
  return apiFetch('/admin/tickets/verify', {
    method: 'POST',
    body: JSON.stringify({ qrToken }),
  });
}

export async function adminCheckInTicket(qrToken) {
  return apiFetch('/admin/tickets/check-in', {
    method: 'POST',
    body: JSON.stringify({ qrToken }),
  });
}

export async function adminFetchOrders() {
  return apiFetch('/admin/orders');
}

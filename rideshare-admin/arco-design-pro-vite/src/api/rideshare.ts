import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || '';

// ---- Auth ----
export function adminLogin(phone: string, password: string) {
  return axios.post(`${BASE}/api/auth/login`, { phone, password });
}

// ---- Dashboard ----
export function getDashboard() {
  return axios.get(`${BASE}/api/admin/dashboard`);
}

// ---- Users ----
export function getUsers(page = 1, limit = 20) {
  return axios.get(`${BASE}/api/admin/users`, { params: { page, limit } });
}

export function toggleUser(id: string) {
  return axios.patch(`${BASE}/api/admin/users/${id}/toggle`);
}

// ---- Trips ----
export function getTrips(page = 1, status?: string) {
  return axios.get(`${BASE}/api/admin/trips`, { params: { page, status } });
}

export function cancelTripAdmin(id: string) {
  return axios.patch(`${BASE}/api/admin/trips/${id}/cancel`);
}

// ---- Drivers ----
export function getDrivers(page = 1) {
  return axios.get(`${BASE}/api/admin/drivers`, { params: { page } });
}

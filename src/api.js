/**
 * src/api.js — Authority dashboard API client.
 * Same backend as the citizen app (see civicconnect_backend/), but this
 * client exercises the officer/dept-admin-only endpoints: filtered queue,
 * assign, update_status.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";const MEDIA_ORIGIN = BASE_URL.replace(/\/api\/?$/, "");
export function mediaUrl(path) {
  if (!path) return null;
  return path.startsWith("http") ? path : `${MEDIA_ORIGIN}${path}`;
}

let accessToken = localStorage.getItem("cc_dash_token") || null;

export function setToken(token) {
  accessToken = token;
  if (token) localStorage.setItem("cc_dash_token", token);
  else localStorage.removeItem("cc_dash_token");
}

export function getToken() {
  return accessToken;
}

async function request(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      detail = data.detail || JSON.stringify(data);
    } catch {
      /* not JSON */
    }
    throw new Error(detail);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  login: (username, password) =>
    request("/auth/login/", { method: "POST", body: { username, password } }),
  me: () => request("/auth/me/"),

  queue: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/issues/${qs ? `?${qs}` : ""}`);
  },
  issueDetail: (id) => request(`/issues/${id}/`),
  assign: (id, officerId) =>
    request(`/issues/${id}/assign/`, { method: "POST", body: { officer_id: officerId } }),
  updateStatus: (id, status, note) =>
    request(`/issues/${id}/update_status/`, { method: "POST", body: { status, note } }),

   departments: () => request("/departments/"),
  areas: () => request("/areas/"),
  officers: () => request("/officers/"),

  notifications: () => request("/notifications/"),
  unreadCount: () => request("/notifications/unread_count/"),
  markNotificationRead: (id) => request(`/notifications/${id}/mark_read/`, { method: "POST" }),
  markAllNotificationsRead: () => request("/notifications/mark_all_read/", { method: "POST" }),
};
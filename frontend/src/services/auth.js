const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// MANDIR REPRESENTATIVE LOGIN

export async function loginMandir(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  sessionStorage.setItem("access_token", data.access_token);
  return data;
}

export async function getCurrentRepresentative() {
  const token = sessionStorage.getItem("access_token");

  if (!token) throw new Error("Session expired");

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Session expired");
  }

  return data;
}

export function logoutMandir() {
  sessionStorage.removeItem("access_token");
}

// ADMIN LOGIN

export async function loginAdmin(username, password) {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Admin login failed");
  }

  sessionStorage.setItem("admin_access_token", data.access_token);
  return data;
}

export async function getCurrentAdmin() {
  const token = sessionStorage.getItem("admin_access_token");

  if (!token) throw new Error("Admin session expired");

  const response = await fetch(`${API_BASE_URL}/admin/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    sessionStorage.removeItem("admin_access_token");
    throw new Error(data.detail || "Admin session expired");
  }

  return data;
}

export function logoutAdmin() {
  sessionStorage.removeItem("admin_access_token");
}
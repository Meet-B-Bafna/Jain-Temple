const API_BASE_URL = "http://127.0.0.1:8000";

export async function loginMandir(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
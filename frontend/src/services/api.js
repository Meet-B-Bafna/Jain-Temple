const API_BASE_URL = "http://127.0.0.1:8000";

export async function getTemples() {
  const response = await fetch(`${API_BASE_URL}/temples`);

  if (!response.ok) {
    throw new Error("Failed to fetch temples");
  }

  const data = await response.json();

  return data.temples;
}
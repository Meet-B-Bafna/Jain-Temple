const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";


export async function getTemples() {
  const response = await fetch(`${API_BASE_URL}/temples`);

  if (!response.ok) {
    throw new Error("Failed to fetch temples");
  }

  const data = await response.json();

  return data.temples;
}


export async function getTempleById(templeId) {
  const response = await fetch(`${API_BASE_URL}/temples/${templeId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch temple details");
  }

  return await response.json();
}


export async function updateMyTemple(updates) {
  const token = sessionStorage.getItem("access_token");

  const response = await fetch(`${API_BASE_URL}/mandir/temple`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to update temple information");
  }

  return data;
}

// frontend/src/services/darshan.js

const STORAGE_KEY = "jain_darshan_visits";

export function getVisitedTemples() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Call this when a visitor scans a temple's QR code.
export function recordVisit(templeId) {
  const visited = getVisitedTemples();

  if (!visited.includes(templeId)) {
    visited.push(templeId);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visited));
    } catch {
      /* Storage unavailable (private mode, full): ignore. */
    }
  }

  return visited;
}   
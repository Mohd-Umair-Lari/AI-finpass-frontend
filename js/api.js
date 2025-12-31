const API_BASE =
  location.hostname === "localhost"
    ? "http://127.0.0.1:5000"
    : "https://ai-finpass-backend.onrender.com"; // Render backend

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  return res.json();
}

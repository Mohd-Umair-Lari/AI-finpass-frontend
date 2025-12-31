const API_BASE =
  location.hostname === "localhost"
    ? "http://127.0.0.1:5000"
    : "https://ai-finpass-backend.onrender.com";

/* Core fetch */
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

/* 🔥 COMPATIBILITY LAYER — THIS SAVES YOUR APP */
export async function fetchJSON(path, options = {}) {
  return apiFetch(path, options);
}

/* Optional direct export if needed later */
export { apiFetch };

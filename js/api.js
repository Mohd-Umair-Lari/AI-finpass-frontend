// js/api.js
const API_BASE = "https://ai-finpass-backend.onrender.com";

export async function fetchJSON(path, options = {}) {
  const response = await fetch(API_BASE + path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

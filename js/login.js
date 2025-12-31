import { apiFetch } from "./api.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const result = await apiFetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (result.status === "success") {
    localStorage.setItem("user", JSON.stringify(result.user));
    window.location.href = "/dashboard.html";
  } else {
    alert(result.message);
  }
});

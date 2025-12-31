console.log("🔥 login.js loaded");

import { apiFetch } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) {
    console.warn("⚠️ loginForm not found on this page");
    return;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("🖱️ Login form submitted");

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (!emailInput || !passwordInput) {
      alert("Login inputs missing in HTML");
      return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const result = await apiFetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (result.status === "success") {
        localStorage.setItem("user", JSON.stringify(result.user));
        window.location.href = "/dashboard.html";
      } else {
        alert(result.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Unable to login. Check backend.");
    }
  });
});
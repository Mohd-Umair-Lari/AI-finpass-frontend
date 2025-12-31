import { fetchJSON } from "./api.js";

console.log("login.js loaded");

const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetchJSON("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    localStorage.setItem("user", JSON.stringify(res.user));
    window.location.href = "/dashboard.html";

  } catch (err) {
    alert(err.message || "Login failed");
    console.error(err);
  }
});

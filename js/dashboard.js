import { fetchJSON } from "./api.js";
console.log("dashboard.js loaded");

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  alert("Not logged in");
  window.location.href = "/";
}

async function loadGoal() {
  const data = await fetchJSON(`/api/goal-intelligence/${user.email}`);
  console.log("Goal data:", data);
}

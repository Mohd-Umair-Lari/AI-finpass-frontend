import { apiFetch } from "./api.js";

console.log("🔥 dashboard.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please login first");
    window.location.href = "/";
    return;
  }

  // -------------------------
  // BASIC PROFILE
  // -------------------------
  setText("profile-name", user.Name);
  setText("profile-email", user.email);
  setText("profile-age", user.Age);
  setText("profile-status", user["employement-status"]);

  // -------------------------
  // GOAL
  // -------------------------
  setText("goal-name", user.Goal?.goal);
  setText("goal-amount", extract(user.Goal?.["target-amt"]));
  setText("goal-time", extract(user.Goal?.["target-time"]));

  // -------------------------
  // FINANCIALS
  // -------------------------
  setText("income", extract(user.financials?.["monthly-income"]));
  setText("expenses", extract(user.financials?.["monthly-expenses"]));
  setText("savings", user.financials?.monthly_savings);
  setText("debt", extract(user.financials?.debt));
  setText("emergency", user.financials?.["em-fund-opted"] ? "Yes" : "No");

  // -------------------------
  // INVESTMENTS
  // -------------------------
  setText("risk", user.investments?.["risk-opt"]);
  setText("mode", user.investments?.["prefered-mode"]);
  setText("invest-amt", extract(user.investments?.["invest-amt"]));

  // -------------------------
  // PROGRESS
  // -------------------------
  setText("ror", extract(user.progress?.ROR) + "%");
  setText("tenure", extract(user.progress?.tenure));
  setText("start-date", user.progress?.start_date);
  setText("auto-adjust", user.progress?.["auto-adjust"] ? "Enabled" : "Disabled");

  // -------------------------
  // BUTTONS
  // -------------------------
  bindButtons(user.email);
});

// -----------------------------
// HELPERS
// -----------------------------
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "-";
}

function extract(v) {
  if (!v) return "-";
  if (typeof v === "object") return Object.values(v)[0];
  return v;
}

function bindButtons(email) {
  document.getElementById("btn-analytics")?.addEventListener("click", async () => {
    const data = await apiFetch(`/api/analytics/${email}`);
    alert(JSON.stringify(data.analytics, null, 2));
  });

  document.getElementById("btn-goal")?.addEventListener("click", async () => {
    const data = await apiFetch(`/api/goal-intelligence/${email}`);
    alert(JSON.stringify(data.goal_intelligence, null, 2));
  });

  document.getElementById("btn-agent")?.addEventListener("click", async () => {
    const data = await apiFetch(`/api/agent/${email}`);
    alert(JSON.stringify(data.agent, null, 2));
  });
}

window.logout = () => {
  localStorage.removeItem("user");
  window.location.href = "/";
};
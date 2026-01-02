import { apiFetch } from "./api.js";

console.log("🔥 dashboard.js loaded");

function openModal(html) {
  const backdrop = document.getElementById("modal-backdrop");
  const content = document.getElementById("modal-content");

  content.innerHTML = html;
  backdrop.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal-backdrop").classList.add("hidden");
}

async function loadGoalIntelligence(email) {
  const res = await fetch(`${API_BASE}/api/goal-intelligence/${email}`);
  const data = await res.json();

  const g = data.goal_intelligence;

  openModal(`
    <h2>Goal Intelligence</h2>
    <p><b>Goal Probability:</b> ${g.goal_probability}%</p>
    <p><b>Expected Corpus:</b> ₹${g.expected_corpus}</p>
    <p><b>Target Amount:</b> ₹${g.target_amount}</p>
    <p><b>Gap:</b> ₹${Math.abs(g.gap)}</p>
    <hr/>
    <p><b>Risk Level:</b> ${g.risk_level}</p>
    <p><b>Assumed ROI:</b> ${g.roi_assumed}%</p>
    <p class="decision-badge ${g.goal_probability >= 70 ? "good" : "bad"}">
      ${g.verdict}
    </p>
  `);
}

async function loadAgentDecision(email) {
  const res = await fetch(`${API_BASE}/api/agent/${email}`);
  const data = await res.json();

  const a = data.agent;
  const g = data.goal_intelligence;

  openModal(`
    <h2>AI Decision Advisor</h2>

    <span class="agent-badge ${a.action.toLowerCase()}">
      ${a.action}
    </span>

    <p class="agent-message">${a.message}</p>

    <hr/>
    <p><b>Reason:</b> ${g.verdict}</p>
    <p><b>Goal Probability:</b> ${g.goal_probability}%</p>
  `);
}


async function loadAnalytics(email) {
  const res = await fetch(`${API_BASE}/api/analytics/${email}`);
  const data = await res.json();
  const a = data.analytics;

  openModal(`
    <h2>Financial Analytics</h2>
    <p><b>Financial Health:</b> ${a.financial_health}</p>
    <p><b>Savings Ratio:</b> ${(a.savings_ratio * 100).toFixed(1)}%</p>
    <p><b>Expense Ratio:</b> ${(a.expense_ratio * 100).toFixed(1)}%</p>
    <p><b>Risk Score:</b> ${a.risk_score}</p>
  `);
}


document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("modal-close")?.addEventListener("click", closeModal);
  document.getElementById("modal-backdrop")?.addEventListener("click", (e) => {
    if (e.target.id === "modal-backdrop") closeModal();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

document.getElementById("btn-goal")
  ?.addEventListener("click", () => loadGoalIntelligence(user.email));

document.getElementById("btn-agent")
  ?.addEventListener("click", () => loadAgentDecision(user.email));

document.getElementById("btn-analytics")
  ?.addEventListener("click", () => loadAnalytics(user.email));

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
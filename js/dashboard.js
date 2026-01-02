import { apiFetch } from "./api.js";

/* ===== AUTH GUARD ===== */
const user = JSON.parse(localStorage.getItem("user"));
if (!user || !user.email) {
  window.location.href = "/login.html";
}

/* ===== DOM HELPERS ===== */
const qs = (id) => document.getElementById(id);
const setText = (id, val) => qs(id).textContent = val ?? "-";

/* ===== POPULATE USER ===== */
async function loadUserProfile() {
  const data = await apiFetch(`/api/user/${encodeURIComponent(user.email)}`);
  const u = data.user;

  setText("name", u.Name);
  setText("email", u.email);
  setText("age", u.Age);
  setText("status", u["employement-status"]);

  setText("goal-name", u.Goal?.goal);
  setText("goal-amount", u.Goal?.["target-amt"]);
  setText("goal-time", u.Goal?.["target-time"]);

  setText("income", u.financials?.["monthly-income"]);
  setText("expenses", u.financials?.["monthly-expenses"]);
  setText("savings", u.financials?.monthly_savings);
  setText("debt", u.financials?.debt);
  setText("emfund", u.financials?.["em-fund-opted"] ? "Yes" : "No");

  setText("risk", u.investments?.["risk-opt"]);
  setText("mode", u.investments?.["prefered-mode"]);
  setText("invest-amt", u.investments?.["invest-amt"]);

  setText("ror", u.progress?.ROR + "%");
  setText("tenure", u.progress?.tenure + " months");
  setText("start", u.progress?.start_date);
  setText("auto", u.progress?.["auto-adjust"] ? "Enabled" : "Disabled");
}

/* ===== GOAL INTELLIGENCE ===== */
async function loadGoalIntelligence() {
  const res = await apiFetch(`/api/goal-intelligence/${user.email}`);
  const g = res.goal_intelligence;

  qs("goal-modal-body").innerHTML = `
    <p><b>Goal Probability:</b> ${g.goal_probability}%</p>
    <p><b>Expected Corpus:</b> ₹${g.expected_corpus}</p>
    <p><b>Target Amount:</b> ₹${g.target_amount}</p>
    <p><b>Gap:</b> ₹${g.gap}</p>
    <p><b>Risk Level:</b> ${g.risk_level}</p>
    <p><b>Assumed ROI:</b> ${g.roi_assumed}%</p>
  `;
}

/* ===== AI AGENT ===== */
async function loadAgentDecision() {
  const res = await apiFetch(`/api/agent/${user.email}`);
  const { agent, goal_intelligence } = res;

  qs("agent-modal-body").innerHTML = `
    <span class="agent-badge ${agent.action.toLowerCase()}">
      ${agent.action}
    </span>
    <p>${agent.message}</p>
    <p><b>Goal Probability:</b> ${goal_intelligence.goal_probability}%</p>
  `;
}

/* ===== MODALS ===== */
qs("open-goal").onclick = async () => {
  qs("goal-modal").classList.remove("hidden");
  await loadGoalIntelligence();
};

qs("open-agent").onclick = async () => {
  qs("agent-modal").classList.remove("hidden");
  await loadAgentDecision();
};

document.querySelectorAll(".modal-close").forEach(btn =>
  btn.onclick = () =>
    btn.closest(".modal-backdrop").classList.add("hidden")
);

/* ===== LOGOUT ===== */
window.logout = () => {
  localStorage.removeItem("user");
  window.location.href = "/login.html";
};

/* ===== INIT ===== */
loadUserProfile();

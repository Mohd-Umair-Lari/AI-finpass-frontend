import { fetchJSON } from "./api.js";

const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "/index.html";
}

/* HELPERS */
function extractNum(v) {
  if (v == null) return "-";
  if (typeof v === "object") return Object.values(v)[0];
  return v;
}

/* LOAD DASHBOARD */
async function loadDashboard() {
  const dash = document.getElementById("dashboard-content");
  if (!dash) return;

  let analytics = null;
  try {
    const res = await fetchJSON(`/api/analytics/${encodeURIComponent(user.email)}`);
    analytics = res.analytics;
  } catch {}

  dash.innerHTML = `
    <div class="card">
      <h2>User Profile</h2>
      <p><b>Name:</b> ${user.Name}</p>
      <p><b>Email:</b> ${user.email}</p>
    </div>

    <div class="card">
      <button id="open-goal-btn">Goal Intelligence</button>
      <button id="open-agent-btn">AI Decision</button>
    </div>

    <div id="goal-content"></div>
    <div id="agent-content"></div>
  `;

  document.getElementById("open-goal-btn").onclick = loadGoal;
  document.getElementById("open-agent-btn").onclick = loadAgent;
}

/* GOAL INTELLIGENCE */
async function loadGoal() {
  const data = await fetchJSON(`/api/goal-intelligence/${encodeURIComponent(user.email)}`);
  const g = data.goal_intelligence;

  document.getElementById("goal-content").innerHTML = `
    <p><b>Probability:</b> ${g.goal_probability}%</p>
    <p><b>Expected:</b> ₹${g.expected_corpus.toLocaleString()}</p>
    <p><b>Gap:</b> ₹${Math.abs(g.gap).toLocaleString()}</p>
  `;
}

/* AGENT */
async function loadAgent() {
  const data = await fetchJSON(`/api/agent/${encodeURIComponent(user.email)}`);
  document.getElementById("agent-content").innerHTML =
    `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

/* LOGOUT */
window.logout = () => {
  localStorage.removeItem("user");
  window.location.href = "/index.html";
};

loadDashboard();

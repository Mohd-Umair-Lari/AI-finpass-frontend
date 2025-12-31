/*FETCH JSON HELPER*/
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}
async function loadGoalIntelligence(email) {
  try {
    const res = await fetch(`/api/goal-intelligence/${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error("Failed to fetch goal intelligence");

    const data = await res.json();
    return data.goal_intelligence;
  } catch (err) {
    console.error("Goal intelligence error:", err);
    return null;
  }
}
async function loadGoalIntelligenceUI(email) {
  try {
    const res = await fetch(`/api/goal-intelligence/${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error("Goal intelligence fetch failed");

    const data = await res.json();
    const g = data.goal_intelligence;

    document.getElementById("goal-content").innerHTML = `
      <p><b>Goal Probability:</b> ${g.goal_probability}%</p>
      <p><b>Expected Corpus:</b> ₹${g.expected_corpus.toLocaleString()}</p>
      <p><b>Target Amount:</b> ₹${g.target_amount.toLocaleString()}</p>
      <p><b>Gap:</b> ₹${Math.abs(g.gap).toLocaleString()}</p>

      <hr/>

      <p><b>Risk Level:</b> ${g.risk_level}</p>
      <p><b>Assumed ROI:</b> ${g.roi_assumed}%</p>

      <p class="verdict ${g.goal_probability >= 80 ? "good" : "bad"}">
        ${g.verdict}
      </p>
    `;
  } catch (err) {
    document.getElementById("goal-content").innerHTML =
      "<p>Unable to load goal intelligence.</p>";
    console.error(err);
  }
}

async function loadAgentDecisionUI(email) {
  try {
    const res = await fetch(`/api/agent/${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error("Agent fetch failed");

    const data = await res.json();

    const agent = data.agent;
    const g = data.goal_intelligence;

    const action = agent?.action || "UNKNOWN";
    const message = agent?.message || "No explanation available";
    const reason = g?.verdict || "";
    const probability = g?.goal_probability ?? 0;

    document.getElementById("agent-content").innerHTML = `
      <span class="agent-badge ${action.toLowerCase()}">
        ${action}
      </span>

      <p class="agent-message">${message}</p>

      ${reason ? `<p class="agent-reason"><b>Reason:</b> ${reason}</p>` : ""}

      <hr/>

      <p><b>Current Goal Probability:</b> ${probability.toFixed(2)}%</p>

      <hr/>

      <h4>Goal Analysis</h4>
      <p><b>Target Amount:</b> ₹${g.target_amount.toLocaleString()}</p>
      <p><b>Expected Corpus:</b> ₹${g.expected_corpus.toLocaleString()}</p>
      <p><b>Gap:</b> ₹${Math.abs(g.gap).toLocaleString()}</p>

      <h4>Risk & Assumptions</h4>
      <p><b>Risk Level:</b> ${g.risk_level}</p>
      <p><b>Assumed ROI:</b> ${g.roi_assumed}%</p>
      <p><b>Monthly Savings:</b> ₹${g.monthly_savings.toLocaleString()}</p>
    `;
  } catch (err) {
    document.getElementById("agent-content").innerHTML =
      "<p>Unable to load AI decision.</p>";
    console.error(err);
  }
}


/*DASHBOARD*/
async function renderDashboardIfPresent() {
  const dash = document.getElementById("dashboard-content");
  if (!dash) return;

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    dash.innerHTML = "<p>Please login first.</p>";
    return;
  }

  let analytics = null;
  try {
    const res = await fetch(`/api/analytics/${encodeURIComponent(user.email)}`);
    if (!res.ok) throw new Error("analytics fetch failed");
    const json = await res.json();
    analytics = json.analytics;
  } catch {
    analytics = null;
  }

  dash.innerHTML = `
    ${analytics ? `
    <!-- Analytics Modal Backdrop -->
    <div id="analytics-backdrop" class="modal-backdrop hidden">
      <div class="modal-card" id="analytics-card">
        <button class="modal-close" id="close-analytics">&times;</button>
        <h2>Financial Analytics</h2>

        <p><b>Financial Health:</b> ${analytics.financial_health}</p>
        <p><b>Savings Ratio:</b> ${(analytics.savings_ratio * 100).toFixed(1)}%</p>
        <p><b>Expense Ratio:</b> ${(analytics.expense_ratio * 100).toFixed(1)}%</p>
        <p><b>Risk Score:</b> ${analytics.risk_score}</p>
      </div>
    </div>
  ` : ""}

    <div class="card">
      <h2>User Profile</h2>
      <p><b>Name:</b> ${user.Name || "-"}</p>
      <p><b>Email:</b> ${user.email || "-"}</p>
      <p><b>Age:</b> ${user.Age || "-"}</p>
      <p><b>Status:</b> ${user["employement-status"] || "-"}</p>
    </div>

    <div class="card">
      <h2>Goal</h2>
      <p><b>Goal:</b> ${user.Goal?.goal || "-"}</p>
      <p><b>Target Amount:</b> ${extractNum(user.Goal?.["target-amt"])}</p>
      <p><b>Target Time:</b> ${extractNum(user.Goal?.["target-time"])} months</p>
    </div>

    <div class="card">
      <h2>Financials</h2>
      <p><b>Monthly Income:</b> ${extractNum(user.financials?.["monthly-income"])}</p>
      <p><b>Monthly Expenses:</b> ${extractNum(user.financials?.["monthly-expenses"])}</p>
      <p><b>Monthly Savings:</b> ${user.financials?.monthly_savings ?? "-"}</p>
      <p><b>Debt:</b> ${extractNum(user.financials?.debt)}</p>
      <p><b>Emergency Fund:</b> ${user.financials?.["em-fund-opted"] ? "Yes" : "No"}</p>
    </div>

    <div class="card">
      <h2>Investments</h2>
      <p><b>Risk:</b> ${user.investments?.["risk-opt"]}</p>
      <p><b>Mode:</b> ${user.investments?.["prefered-mode"]}</p>
      <p><b>Amount:</b> ${extractNum(user.investments?.["invest-amt"])}</p>
    </div>

    <div class="card">
      <h2>Progress</h2>
      <p><b>ROR:</b> ${extractNum(user.progress?.ROR)}%</p>
      <p><b>Tenure:</b> ${extractNum(user.progress?.tenure)} months</p>
      <p><b>Start Date:</b> ${user.progress?.start_date || "-"}</p>
      <p><b>Auto Adjust:</b> ${user.progress?.["auto-adjust"] ? "Enabled" : "Disabled"}</p>
    </div>
    ${analytics ? `
    <div class="card analytics-trigger-card">
      <button id="open-analytics-btn" class="toggle-btn">
        View Financial Analytics
      </button>
      <button id="open-goal-btn" class="toggle-btn">
        View Goal Intelligence
      </button>
      <button id="open-agent-btn" class="toggle-btn">
        AI Decision Advisor
      </button>
    </div>
  ` : ""}
    ${analytics ? `
      <div id="goal-backdrop" class="modal-backdrop hidden">
        <div class="modal-card" id="goal-card">
          <button class="modal-close" id="close-goal">&times;</button>
          <h2>Goal Intelligence</h2>
          <div id="goal-content">
            <p>Loading goal intelligence...</p>
          </div>
        </div>
      </div>
      <div id="agent-backdrop" class="modal-backdrop hidden">
        <div class="modal-card agent-card">
          <button class="modal-close" id="close-agent">&times;</button>

          <h2>AI Decision Advisor</h2>

          <div id="agent-content">
            <p>Loading AI decision...</p>
          </div>
        </div>
      </div>
` : ""}

  `;
  // Goal Intelligence Modal Logic
  const openGoalBtn = document.getElementById("open-goal-btn");
  const goalBackdrop = document.getElementById("goal-backdrop");
  const closeGoalBtn = document.getElementById("close-goal");

  if (openGoalBtn && goalBackdrop) {
    openGoalBtn.addEventListener("click", () => {
      goalBackdrop.classList.remove("hidden");
      loadGoalIntelligenceUI(user.email);
    });

    goalBackdrop.addEventListener("click", (e) => {
      if (e.target === goalBackdrop) {
        goalBackdrop.classList.add("hidden");
      }
    });
  }

  if (closeGoalBtn) {
    closeGoalBtn.addEventListener("click", () => {
      goalBackdrop.classList.add("hidden");
    });
  }
  //  Analytics Modal Logic
  const openBtn = document.getElementById("open-analytics-btn");
  const backdrop = document.getElementById("analytics-backdrop");
  const closeBtn = document.getElementById("close-analytics");

  if (openBtn && backdrop) {
    openBtn.addEventListener("click", () => {
      backdrop.classList.remove("hidden");
    });

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.classList.add("hidden");
      }
    });
  }

  if (closeBtn && backdrop) {
    closeBtn.addEventListener("click", () => {
      backdrop.classList.add("hidden");
    });
  }
  
  // AI Decision Advisor Modal Logic
  const openAgentBtn = document.getElementById("open-agent-btn");
  const agentBackdrop = document.getElementById("agent-backdrop");
  const closeAgentBtn = document.getElementById("close-agent");

  if (openAgentBtn && agentBackdrop) {
    openAgentBtn.addEventListener("click", () => {
      agentBackdrop.classList.remove("hidden");
      loadAgentDecisionUI(user.email);
    });

    agentBackdrop.addEventListener("click", (e) => {
      if (e.target === agentBackdrop) {
        agentBackdrop.classList.add("hidden");
      }
    });
  }

  if (closeAgentBtn) {
    closeAgentBtn.addEventListener("click", () => {
      agentBackdrop.classList.add("hidden");
    });
  }

}

/*WIZARD*/
function initRegisterWizardIfPresent() {
  if (window.location.pathname !== "/register") return;

  const steps = [...document.querySelectorAll(".step")];
  const dots = [...document.querySelectorAll("#progressDots .dot")];
  let current = 0;

  function show(i) {
    steps.forEach((s, idx) => s.classList.toggle("active", idx === i));
    dots.forEach((d, idx) => d.classList.toggle("active", idx <= i));
    current = i;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  window.nextStep = () => current < steps.length - 1 && show(current + 1);
  window.prevStep = () => current > 0 && show(current - 1);

  window.showReview = () => {
    const payload = buildRegistrationPayload();
    window.__reg_payload = payload;

    document.getElementById("review-area").innerHTML = `
      <h3>Review Your Details</h3>
      ${renderReview("User Profile", [
        ["Name", payload.Name],
        ["Age", payload.Age],
        ["Email", payload.email],
        ["Status", payload["employement-status"]]
      ])}
      ${renderReview("Goal", [
        ["Goal", payload.Goal.goal],
        ["Target Amount", payload.Goal["target-amt"]],
        ["Target Time", payload.Goal["target-time"] + " months"]
      ])}
      ${renderReview("Financials", [
        ["Income", payload.financials["monthly-income"]],
        ["Expenses", payload.financials["monthly-expenses"]],
        ["Savings", payload.financials["monthly_savings"]],
        ["Debt", payload.financials.debt]
      ])}
      ${renderReview("Investments", [
        ["Risk", payload.investments["risk-opt"]],
        ["Mode", payload.investments["prefered-mode"]],
        ["Amount", payload.investments["invest-amt"]]
      ])}
    `;
    show(steps.length - 1);
  };

  window.submitRegistration = async () => {
    try {
      const data = await fetchJSON("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(window.__reg_payload)
      });

      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.message || "Registration failed");
    }
  };

  show(0);
}

/*HELPERS*/
function buildRegistrationPayload() {
  return {
    Name: val("r-name"),
    Age: val("r-age"),
    email: val("r-email"),
    password: val("r-password"),
    "employement-status": val("r-status"),

    Goal: {
      goal: val("g-name"),
      "target-amt": num("g-amt"),
      "target-time": num("g-time")
    },
    financials: {
      "monthly-income": num("f-income"),
      "monthly-expenses": num("f-expenses"),
      "monthly_savings": num("f-savings"),
      debt: num("f-debt"),
      "em-fund-opted": checked("f-emfund")
    },
    investments: {
      "risk-opt": val("i-risk"),
      "prefered-mode": val("i-mode"),
      "invest-amt": num("i-amt")
    },
    progress: {
      start_date: val("p-start"),
      tenure: num("p-tenure"),
      ROR: num("p-ror"),
      "auto-adjust": checked("p-auto")
    }
  };
}

function extractNum(v) {
  if (v == null) return "-";
  if (typeof v === "object") return Object.values(v)[0];
  return v;
}

function val(id) { return document.getElementById(id)?.value || ""; }
function num(id) { return Number(val(id)) || 0; }
function checked(id) { return !!document.getElementById(id)?.checked; }

function renderReview(title, items) {
  return `
    <div class="review-section">
      <h4>${title}</h4>
      ${items.map(i => `<p><b>${i[0]}:</b> ${i[1]}</p>`).join("")}
    </div>`;
}

/*LOGOUT FXN*/
function logout() {
  localStorage.removeItem("user");
  window.location.href = "/";
}

/*LOGIN HANDLER*/
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");

  if (loginBtn) {
    loginBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const email = document.getElementById("login-email")?.value.trim();
      const password = document.getElementById("login-password")?.value.trim();

      if (!email || !password) {
        alert("Please enter email and password");
        return;
      }

      try {
        const data = await fetchJSON("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/dashboard";
      } catch (err) {
        alert(err.message || "Invalid credentials");
      }
    });
  }

  renderDashboardIfPresent();
  initRegisterWizardIfPresent();
});
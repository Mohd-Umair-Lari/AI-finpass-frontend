import { fetchJSON } from "./api.js";

/* HELPERS */
function val(id) { return document.getElementById(id)?.value || ""; }
function num(id) { return Number(val(id)) || 0; }
function checked(id) { return !!document.getElementById(id)?.checked; }

/* BUILD PAYLOAD */
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

/* SUBMIT */
window.submitRegistration = async () => {
  try {
    const payload = buildRegistrationPayload();
    const data = await fetchJSON("/api/signup", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "/dashboard.html";
  } catch (err) {
    alert(err.message || "Registration failed");
  }
};

import { apiFetch } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "/";
    return;
  }

  document.getElementById("user-name").textContent = user.Name;
  document.getElementById("user-email").textContent = user.email;

  document.getElementById("goal-btn").addEventListener("click", loadGoal);
  document.getElementById("agent-btn").addEventListener("click", loadAgent);
  document.getElementById("logout-btn").addEventListener("click", logout);
});

async function loadGoal() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const data = await apiFetch(`/api/goal-intelligence/${encodeURIComponent(user.email)}`);

    const g = data.goal_intelligence;

    alert(
      `Goal Probability: ${g.goal_probability}%\n` +
      `Expected Corpus: ₹${g.expected_corpus}\n` +
      `Gap: ₹${g.gap}`
    );
  } catch (err) {
    console.error(err);
    alert("Failed to load goal intelligence");
  }
}

async function loadAgent() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const data = await apiFetch(`/api/agent/${encodeURIComponent(user.email)}`);

    alert(
      `Decision: ${data.agent.action}\n\n${data.agent.message}`
    );
  } catch (err) {
    console.error(err);
    alert("Failed to load AI decision");
  }
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "/";
}

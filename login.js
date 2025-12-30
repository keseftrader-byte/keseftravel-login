// Change this to your Railway backend host (FastAPI)
const API_BASE = "https://car-rental-system-production-d3a0.up.railway.app";

const form = document.getElementById("loginForm");
const msg = document.getElementById("msg");
const btn = document.getElementById("btn");

function setMsg(text, kind) {
  msg.className = "msg " + (kind || "");
  msg.textContent = text || "";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg("");
  btn.disabled = true;

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const r = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // REQUIRED so cookie is set
      body: JSON.stringify({ email, password })
    });

    if (!r.ok) {
      const t = await r.text().catch(() => "");
      setMsg(`Login failed (${r.status}). ${t}`.trim(), "err");
      return;
    }

    
    setMsg("Logged in. Redirecting…", "ok");
    window.location.href = `${API_BASE}/`; // or https://app.keseftravel.com/cards
  } catch (err) {
    setMsg("Network error. Check API_BASE and that the backend is online.", "err");
  } finally {
    btn.disabled = false;
  }
});

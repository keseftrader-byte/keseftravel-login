// login.js (updated to handle 303 redirect as success)
const API_BASE = "https://app.keseftravel.com";  // your Cloudflare domain

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
      credentials: "include",
      body: JSON.stringify({ email, password })
    });

    // Success: 303 (redirect) or 200-299 range
    if (r.status >= 200 && r.status < 400) {  // covers 200-399 (including 303)
      setMsg("Logged in. Redirecting…", "ok");
      
      // Let browser follow the 303 redirect automatically
      window.location.href = r.url || `${API_BASE}/cards`;  // fallback to /cards
      return;
    }

    // Error handling
    let errorText = "";
    try {
      const errorJson = await r.json();
      errorText = errorJson.detail || (typeof errorJson === 'string' ? errorJson : JSON.stringify(errorJson));
    } catch {
      errorText = await r.text().catch(() => r.statusText || "");
    }

    setMsg(`Login failed (${r.status}). ${errorText}`.trim(), "err");
  } catch (err) {
    console.error("Fetch error:", err);
    setMsg("Network error. Check connection, API_BASE, or backend status.", "err");
  } finally {
    btn.disabled = false;
  }
});

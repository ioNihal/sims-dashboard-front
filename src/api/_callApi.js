
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function callApi(
  path,
  { method = "GET", body, requireAuth = true, signal } = {}
) {
  const headers = {};

  if (requireAuth) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token");
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (body != null) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { method, headers, body, signal });
  } catch (networkErr) {
    throw new Error(`Network error at ${path}: ${networkErr.message}`);
  }

  let payload = {};
  try {
    payload = await res.json();
  } catch {
    // ignore JSON parse errors
  }

  if (res.status === 401) {
    redirectToLogin();
    throw new Error("Access Denied: Unauthorized!");
  }
  if (!res.ok) {
    throw new Error(payload.error?.message || `API error ${res.status} at ${path}`);
  }
  return payload;
}

function redirectToLogin() {
  ["isLoggedIn", "adminEmail", "user", "token"].forEach((k) =>
    localStorage.removeItem(k)
  );
  window.location.href = "/login";
}


export default callApi;

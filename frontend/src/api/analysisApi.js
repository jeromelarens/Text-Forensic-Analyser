const API_BASE = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function handleResponse(res) {
  const data = await res.json();

  if (!res.ok) {
    console.error("Backend error:", data);
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
}

export async function analyzeText(text) {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE}/text/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  });

  return handleResponse(res);
}

export async function analyzeImage(file) {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/image/analyze`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  return handleResponse(res);
}

export async function analyzeVideo(file) {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("video", file);

  const res = await fetch(`${API_BASE}/video/analyze`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  return handleResponse(res);
}

export async function fetchHistory() {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE}/history`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return handleResponse(res);
}

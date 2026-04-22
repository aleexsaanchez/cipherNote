// src/api.js
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const parseJsonResponse = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

const request = async (path, options = {}) => {
  const res = await fetch(`${baseURL}${path}`, options);
  const payload = await parseJsonResponse(res);

  if (!res.ok) {
    const message = payload?.message || payload?.error || "Request failed";
    const error = new Error(message);
    error.status = res.status;
    error.data = payload;
    throw error;
  }

  return payload;
};

export const register = async (data) => {
  return request("/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const login = async (data) => {
  return request("/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

// Get all notes
export const getNotes = async (token) => {
  return request("/notes", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get note by ID
export const getNoteById = async (id, token) => {
  return request(`/notes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Create note
export const createNote = async (data, token) => {
  return request("/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

// Update note
export const updateNote = async (id, data, token) => {
  return request(`/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

// Delete note
export const deleteNote = async (id, token) => {
  return request(`/notes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};
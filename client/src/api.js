// src/api.js
const baseURL = "http://localhost:5000/api";

export const register = async (data) => {
  const res = await fetch(`${baseURL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const login = async (data) => {
  const res = await fetch(`${baseURL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Get all notes
export const getNotes = async (token) => {
  const res = await fetch(`${baseURL}/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// Get note by ID
export const getNoteById = async (id, token) => {
  const res = await fetch(`${baseURL}/notes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// Create note
export const createNote = async (data, token) => {
  const res = await fetch(`${baseURL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Update note
export const updateNote = async (id, data, token) => {
  const res = await fetch(`${baseURL}/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Delete note
export const deleteNote = async (id, token) => {
  const res = await fetch(`${baseURL}/notes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
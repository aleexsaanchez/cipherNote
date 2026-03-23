const API_URL = "http://localhost:5000/api/notes";

// GET all notes
export const getNotes = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

// CREATE note
export const createNote = async (note) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

  return response.json();
};
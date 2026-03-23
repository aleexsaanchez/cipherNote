import { useState, useEffect } from "react";
import { getNotes, createNote } from "./api";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Load notes from backend
  useEffect(() => {
    const fetchNotes = async () => {
      const data = await getNotes();
      setNotes(data);
    };

    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    const newNote = { title, content };

    const savedNote = await createNote(newNote);
    setNotes([...notes, savedNote]);

    setTitle("");
    setContent("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>CipherNotes</h1>

      <h2>Create Note</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <br /><br />
      <button onClick={handleAddNote}>Add Note</button>

      <h2>Your Notes</h2>
      {notes.map((note) => (
        <div key={note.id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
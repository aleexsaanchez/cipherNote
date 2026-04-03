import { useState, useEffect } from "react";
import { getNotes, deleteNote } from "../api";
import { useNavigate } from "react-router-dom";

function NotesListPage({ token }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      const allNotes = await getNotes(token);
      setNotes(allNotes);
    };
    fetchNotes();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await deleteNote(id, token);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete note");
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase()) ||
    (note.tags && note.tags.join(" ").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Notes</h1>
      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <br /><br />
      <button onClick={() => navigate("/notes/create")}>Create New Note</button>
      <br /><br />
      {filteredNotes.length === 0 && <p>No notes found.</p>}
      {filteredNotes.map(note => (
        <div key={note.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          {note.tags && note.tags.length > 0 && (
            <p><strong>Tags:</strong> {note.tags.join(", ")}</p>
          )}
          <button onClick={() => navigate(`/notes/edit/${note.id}`)}>Edit</button>{" "}
          <button onClick={() => handleDelete(note.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default NotesListPage;
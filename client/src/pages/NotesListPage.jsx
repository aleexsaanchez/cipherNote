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
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await deleteNote(id, token);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete note");
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase()) ||
      (note.tags && note.tags.join(" ").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page">
      <section className="page-hero page-hero-split">
        <div>
          <p className="eyebrow">Notes vault</p>
          <h1>Cybersecurity notes</h1>
          <p className="page-subtitle">
            Store techniques, indicators, hardening steps, and lab findings in a single security-focused workspace.
          </p>
        </div>

        <div className="hero-actions">
          <div className="search-wrap">
            <input
              className="input"
              type="text"
              placeholder="Search tags, tools, or tactics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="button button-primary" onClick={() => navigate("/notes/create")}>
            + Create Note
          </button>
        </div>
      </section>

      <div className="notes-meta">
        {filteredNotes.length} note{filteredNotes.length === 1 ? "" : "s"}
      </div>

      {filteredNotes.length === 0 && (
        <p className="empty-state">No notes found. Try a different search or create a new one.</p>
      )}

      <div className="notes-grid">
        {filteredNotes.map((note) => (
          <article key={note.id} className="card note-card">
            <div className="note-card-top">
              <h2>{note.title}</h2>
            </div>
            <p className="note-preview">{note.content}</p>
            {note.tags && note.tags.length > 0 && (
              <div className="tag-list">
                {note.tags.map((tag) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="card-actions">
              <button className="button button-secondary" onClick={() => navigate(`/notes/edit/${note.id}`)}>
                Edit
              </button>
              <button className="button button-danger" onClick={() => handleDelete(note.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default NotesListPage;
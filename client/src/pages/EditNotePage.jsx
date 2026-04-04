import { useState, useEffect } from "react";
import { getNoteById, updateNote } from "../api";
import { useParams, useNavigate } from "react-router-dom";

function EditNotePage({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      const note = await getNoteById(id, token);
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags ? note.tags.join(", ") : "");
    };
    fetchNote();
  }, [id, token]);

  const handleUpdate = async () => {
    try {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      await updateNote(id, { title, content, tags: tagsArray }, token);
      navigate("/notes");
    } catch (err) {
      console.error(err);
      alert("Failed to update note");
    }
  };

  return (
    <div className="page">
      <div className="page-hero">
        <p className="eyebrow">Update note</p>
        <h1>Edit Note</h1>
        <p className="page-subtitle">Refine the title, rewrite the content, or adjust the tags.</p>
      </div>

      <div className="card form-card">

        <div className="form-group">
          <label className="field-label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="input"
            type="text"
            placeholder="Short, searchable title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="field-label" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            className="input"
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
          />
        </div>

        <div className="form-group">
          <label className="field-label" htmlFor="tags">
            Tags
          </label>
          <input
            id="tags"
            className="input"
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <button className="button button-primary button-full" onClick={handleUpdate}>
          Update Note
        </button>
      </div>
    </div>
  );
}

export default EditNotePage;
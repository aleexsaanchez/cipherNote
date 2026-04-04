import { useState } from "react";
import { createNote } from "../api";
import { useNavigate } from "react-router-dom";

function CreateNotePage({ token }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  const handleAddNote = async () => {
    try {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      await createNote({ title, content, tags: tagsArray }, token);
      navigate("/notes");
    } catch (err) {
      console.error(err);
      alert("Failed to create note");
    }
  };

  return (
    <div className="page">
      <div className="page-hero">
        <p className="eyebrow">New note</p>
        <h1>Create Note</h1>
        <p className="page-subtitle">Capture an idea, a task, or a reminder in a clean writing surface.</p>
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
            placeholder="Ideas, work, personal"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <button className="button button-primary button-full" onClick={handleAddNote}>
          Add Note
        </button>
      </div>
    </div>
  );
}

export default CreateNotePage;
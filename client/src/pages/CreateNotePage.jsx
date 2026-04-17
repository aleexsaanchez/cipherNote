import { useState } from "react";
import { createNote } from "../api";
import { useNavigate } from "react-router-dom";
import MarkdownEditor from "../components/MarkdownEditor";

function CreateNotePage({ token }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAddNote = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      await createNote({ title, content, tags: tagsArray }, token);
      navigate("/notes");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create note");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="page-hero">
        <p className="eyebrow">New note</p>
        <h1>Create Note</h1>
        <p className="page-subtitle">
          Capture an idea, lab note, or study summary with simple formatting.
        </p>
      </div>

      <div className="card form-card">
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {isSubmitting && <p className="notes-meta">Saving note...</p>}
        <MarkdownEditor
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          tags={tags}
          setTags={setTags}
          onSubmit={handleAddNote}
          submitLabel={isSubmitting ? "Saving..." : "Add Note"}
          submitDisabled={isSubmitting}
          titlePlaceholder="Short, searchable title"
          tagPlaceholder="lab, mitre, cve-2024, blue-team"
        />
      </div>
    </div>
  );
}

export default CreateNotePage;
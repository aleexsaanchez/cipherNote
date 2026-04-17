import { useState, useEffect } from "react";
import { getNoteById, updateNote } from "../api";
import { useParams, useNavigate } from "react-router-dom";
import MarkdownEditor from "../components/MarkdownEditor";

function EditNotePage({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      setError("");
      setIsLoading(true);
      try {
        const note = await getNoteById(id, token);
        setTitle(note.title);
        setContent(note.content);
        setTags(note.tags ? note.tags.join(", ") : "");
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load note");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNote();
  }, [id, token]);

  const handleUpdate = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      await updateNote(id, { title, content, tags: tagsArray }, token);
      navigate("/notes");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update note");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="page-hero">
        <p className="eyebrow">Update note</p>
        <h1>Edit Note</h1>
        <p className="page-subtitle">
          Refine the title, update the formatting, or adjust the tags.
        </p>
      </div>

      <div className="card form-card">
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {isLoading && <p className="notes-meta">Loading note...</p>}
        {!isLoading && isSubmitting && <p className="notes-meta">Updating note...</p>}
        <MarkdownEditor
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          tags={tags}
          setTags={setTags}
          onSubmit={handleUpdate}
          submitLabel={isSubmitting ? "Updating..." : "Update Note"}
          submitDisabled={isLoading || isSubmitting}
          titlePlaceholder="Short, searchable title"
          tagPlaceholder="lab, mitre, cve-2024, blue-team"
        />
      </div>
    </div>
  );
}

export default EditNotePage;
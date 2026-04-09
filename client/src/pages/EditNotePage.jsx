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
        <p className="page-subtitle">
          Refine the title, update the formatting, or adjust the tags.
        </p>
      </div>

      <div className="card form-card">
        <MarkdownEditor
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          tags={tags}
          setTags={setTags}
          onSubmit={handleUpdate}
          submitLabel="Update Note"
          titlePlaceholder="Short, searchable title"
          tagPlaceholder="lab, mitre, cve-2024, blue-team"
        />
      </div>
    </div>
  );
}

export default EditNotePage;
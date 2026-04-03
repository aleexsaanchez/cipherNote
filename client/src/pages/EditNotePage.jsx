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
      const tagsArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag);
      await updateNote(id, { title, content, tags: tagsArray }, token);
      navigate("/notes");
    } catch (err) {
      console.error(err);
      alert("Failed to update note");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Note</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <br /><br />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <br /><br />
      <button onClick={handleUpdate}>Update Note</button>
    </div>
  );
}

export default EditNotePage;
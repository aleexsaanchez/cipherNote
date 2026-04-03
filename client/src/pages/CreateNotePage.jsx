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
      const tagsArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag);
      await createNote({ title, content, tags: tagsArray }, token);
      navigate("/notes");
    } catch (err) {
      console.error(err);
      alert("Failed to create note");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Note</h1>
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
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <br /><br />
      <button onClick={handleAddNote}>Add Note</button>
    </div>
  );
}

export default CreateNotePage;
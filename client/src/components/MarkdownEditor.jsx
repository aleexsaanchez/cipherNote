import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { sanitizeHtml } from "../utils/content";

function ToolbarButton({ editor, label, onClick, isActive = false }) {
  return (
    <button
      type="button"
      className={`toolbar-button ${isActive ? "is-active" : ""}`.trim()}
      onClick={onClick}
      disabled={!editor}
    >
      {label}
    </button>
  );
}

function MarkdownEditor({
  title,
  setTitle,
  content,
  setContent,
  tags,
  setTags,
  onSubmit,
  submitLabel,
  titlePlaceholder = "Short, searchable title",
  tagPlaceholder = "Ideas, work, personal",
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: "noreferrer noopener",
          target: "_blank",
        },
      }),
    ],
    content: content || "",
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-multiline": "true",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      setContent(sanitizeHtml(currentEditor.getHTML()));
    },
  });

  useEffect(() => {
    if (!editor || content == null) {
      return;
    }

    if (editor.getHTML() !== content) {
      editor.commands.setContent(content, false);
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  return (
    <div className="editor-shell">
      <form
        className="editor-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(event);
        }}
      >
        <div className="form-group">
          <label className="field-label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="input"
            type="text"
            placeholder={titlePlaceholder}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="editor-toolbar" aria-label="Formatting toolbar">
          <ToolbarButton
            editor={editor}
            label="H1"
            isActive={editor.isActive("heading", { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          />
          <ToolbarButton
            editor={editor}
            label="H2"
            isActive={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          />
          <ToolbarButton
            editor={editor}
            label="H3"
            isActive={editor.isActive("heading", { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          />
          <ToolbarButton
            editor={editor}
            label="Bold"
            isActive={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            editor={editor}
            label="Italic"
            isActive={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            editor={editor}
            label="Underline"
            isActive={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
          <ToolbarButton
            editor={editor}
            label="Bullet"
            isActive={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            editor={editor}
            label="List"
            isActive={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
          <ToolbarButton
            editor={editor}
            label="Quote"
            isActive={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
          <ToolbarButton
            editor={editor}
            label="Code"
            isActive={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          />
          <ToolbarButton
            editor={editor}
            label="Divider"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          />
          <ToolbarButton editor={editor} label="Undo" onClick={() => editor.chain().focus().undo().run()} />
          <ToolbarButton editor={editor} label="Redo" onClick={() => editor.chain().focus().redo().run()} />
        </div>

        <div className="form-group">
          <label className="field-label" htmlFor="content">
            Content
          </label>
          <div className="tiptap-editor-wrapper">
            <EditorContent editor={editor} id="content" className="tiptap-editor" />
          </div>
          <p className="editor-hint">Use the toolbar to format your note. All formatting is preserved when you save.</p>
        </div>

        <div className="form-group">
          <label className="field-label" htmlFor="tags">
            Tags
          </label>
          <input
            id="tags"
            className="input"
            type="text"
            placeholder={tagPlaceholder}
            value={tags}
            onChange={(event) => setTags(event.target.value)}
          />
        </div>

        <button className="button button-primary button-full" type="submit">
          {submitLabel}
        </button>
      </form>
    </div>
  );
}

export default MarkdownEditor;
import { useState } from "react";

export default function CommentForm({ onSubmit }: { onSubmit: (content: string) => Promise<void> }) {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const text = content.trim();
    if (!text) return;

    const ok = window.confirm("Post this comment?");
    if (!ok) return;

    setSaving(true);
    try {
      await onSubmit(text);
      setContent("");
      alert("Comment posted.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
      <textarea
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
      />

      <button
        className="btn btn-primary"
        onClick={submit}
        disabled={saving}
        style={{ width: "100%" }}
      >
        {saving ? "Posting..." : "Post comment"}
      </button>
    </div>
  );
}

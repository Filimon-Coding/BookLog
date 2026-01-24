import { useState } from "react";

export default function CommentForm({ onSubmit }: { onSubmit: (content: string) => Promise<void> }) {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const text = content.trim();
    if (!text) return;

    setSaving(true);
    try {
      await onSubmit(text);
      setContent("");
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
      <button onClick={submit} disabled={saving}>
        {saving ? "Posting..." : "Post comment"}
      </button>
    </div>
  );
}

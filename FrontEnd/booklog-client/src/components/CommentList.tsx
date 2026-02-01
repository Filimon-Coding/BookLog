import { useState } from "react";
import type { CommentDto } from "../types/models";

export default function CommentList({
  comments,
  currentUserId,
  canDeleteAny,
  onDelete,
  onUpdate,
}: {
  comments: CommentDto[];
  currentUserId?: number;
  canDeleteAny: boolean;
  onDelete: (commentId: number) => Promise<void> | void;
  onUpdate: (commentId: number, content: string) => Promise<void> | void;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const startEdit = (c: CommentDto) => {
    setEditingId(c.id);
    setDraft(c.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft("");
  };

  const saveEdit = async () => {
    if (editingId == null) return;

    const text = draft.trim();
    if (!text) return;

    setSaving(true);
    try {
      await onUpdate(editingId, text);
      setEditingId(null);
      setDraft("");
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async (id: number) => {
    const ok = window.confirm("Delete this comment?");
    if (!ok) return;
    await onDelete(id);
  };

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {comments.map((c) => {
        const isOwner = currentUserId != null && c.userId === currentUserId;
        const canEdit = isOwner;
        const canDelete = canDeleteAny || isOwner;
        const isEditing = editingId === c.id;

        return (
          <div
            key={c.id}
            style={{
              border: "1px solid var(--border)",
              background: "var(--panel)",
              padding: 10,
              borderRadius: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <b>{c.username}</b>{" "}
                <span style={{ color: "var(--muted)", fontSize: 12 }}>
                  {new Date(c.createdAt).toLocaleString()}
                </span>
                {isOwner && (
                  <span style={{ marginLeft: 8, fontSize: 12, color: "var(--muted-2)" }}>(you)</span>
                )}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                {canEdit && !isEditing && (
                  <button className="btn btn-ghost" onClick={() => startEdit(c)}>
                    Edit
                  </button>
                )}

                {canDelete && !isEditing && (
                  <button className="btn btn-ghost" onClick={() => doDelete(c.id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>

            {isEditing ? (
              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                <textarea rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} />
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn btn-primary" onClick={saveEdit} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button className="btn" onClick={cancelEdit} disabled={saving}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p style={{ margin: "8px 0 0 0", color: "var(--text-soft)" }}>{c.content}</p>
            )}
          </div>
        );
      })}

      {comments.length === 0 && <p style={{ color: "var(--muted)" }}>No comments yet.</p>}
    </div>
  );
}

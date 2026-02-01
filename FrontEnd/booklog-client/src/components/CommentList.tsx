import type { CommentDto } from "../types/models";

export default function CommentList({
  comments,
  canDeleteAny,
  onDelete,
}: {
  comments: CommentDto[];
  canDeleteAny: boolean;
  onDelete: (commentId: number) => void;
}) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {comments.map((c) => (
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
            </div>

            {canDeleteAny && <button className="btn btn-ghost" onClick={() => onDelete(c.id)}>Delete</button>}
          </div>

          <p style={{ margin: "8px 0 0 0", color: "var(--text-soft)" }}>{c.content}</p>
        </div>
      ))}

      {comments.length === 0 && <p style={{ color: "var(--muted)" }}>No comments yet.</p>}
    </div>
  );
}

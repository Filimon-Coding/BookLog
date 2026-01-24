import type { CommentDto, Role } from "../types/models";

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
        <div key={c.id} style={{ border: "1px solid #ddd", padding: 10, borderRadius: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div>
              <b>{c.username}</b> <span style={{ color: "#666" }}>{new Date(c.createdAt).toLocaleString()}</span>
            </div>
            {canDeleteAny && (
              <button onClick={() => onDelete(c.id)}>Delete</button>
            )}
          </div>
          <p style={{ margin: "8px 0 0 0" }}>{c.content}</p>
        </div>
      ))}
      {comments.length === 0 && <p>No comments yet.</p>}
    </div>
  );
}

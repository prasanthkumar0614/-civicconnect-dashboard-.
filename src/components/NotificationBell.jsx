import { useEffect, useRef, useState } from "react";
import { api } from "../api.js";

export default function NotificationBell({ onOpenIssue }) {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(null);
  const boxRef = useRef(null);

  function refreshCount() {
    api.unreadCount().then((d) => setCount(d.count)).catch(() => {});
  }

  useEffect(() => {
    refreshCount();
    const interval = setInterval(refreshCount, 20000); // poll every 20s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!open) return;
    api.notifications().then((d) => setItems(d.results || d)).catch(() => setItems([]));
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleItemClick(n) {
    if (!n.is_read) {
      await api.markNotificationRead(n.id).catch(() => {});
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
      refreshCount();
    }
    if (n.issue) onOpenIssue?.(n.issue);
    setOpen(false);
  }

  async function handleMarkAllRead() {
    await api.markAllNotificationsRead().catch(() => {});
    setItems((prev) => prev.map((x) => ({ ...x, is_read: true })));
    setCount(0);
  }

  return (
    <div style={{ position: "relative" }} ref={boxRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        style={{
          position: "relative", background: "none", border: "1.5px solid var(--line-strong)",
          borderRadius: 8, width: 38, height: 38, cursor: "pointer", fontSize: 16,
        }}
      >
        🔔
        {count > 0 && (
          <span
            style={{
              position: "absolute", top: -6, right: -6, background: "#c0392b", color: "#fff",
              borderRadius: 999, fontSize: 11, fontWeight: 700, minWidth: 18, height: 18,
              display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px",
            }}
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute", top: 44, right: 0, width: 340, maxHeight: 420, overflowY: "auto",
            background: "#fff", border: "1px solid var(--line)", borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 50,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderBottom: "1px solid var(--line)" }}>
            <strong style={{ fontSize: 14 }}>Notifications</strong>
            {count > 0 && (
              <button onClick={handleMarkAllRead} className="btn-text" style={{ fontSize: 12 }}>
                Mark all read
              </button>
            )}
          </div>

          {items === null && <p className="hint" style={{ padding: 14 }}>Loading…</p>}
          {items && items.length === 0 && <p className="hint" style={{ padding: 14 }}>No notifications yet.</p>}
          {items && items.map((n) => (
            <button
              key={n.id}
              onClick={() => handleItemClick(n)}
              style={{
                display: "block", width: "100%", textAlign: "left", padding: "10px 14px",
                border: "none", borderBottom: "1px solid var(--line)",
                background: n.is_read ? "transparent" : "#f2f8f6", cursor: "pointer",
              }}
            >
              <p style={{ margin: 0, fontSize: 13, fontWeight: n.is_read ? 400 : 600 }}>{n.message}</p>
              <p className="hint" style={{ margin: "3px 0 0" }}>
                {n.asset_display ? `${n.asset_display} · ` : ""}
                {new Date(n.created_at).toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
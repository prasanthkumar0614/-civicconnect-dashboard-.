const STATUS_LABELS = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export function StatusBadge({ status }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{STATUS_LABELS[status] || status}</span>;
}

export function PriorityLabel({ priority }) {
  if (!priority) return <span className="hint">Not yet triaged</span>;
  return (
    <span className="priority-label">
      <span className={`priority-dot priority-${priority.toLowerCase()}`} />
      {priority.charAt(0) + priority.slice(1).toLowerCase()} priority
    </span>
  );
}

export function AssetTag({ id, large = false }) {
  return <span className={`asset-tag${large ? " large" : ""}`}>{id}</span>;
}

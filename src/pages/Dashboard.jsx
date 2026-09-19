import { useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import { AssetTag, StatusBadge, PriorityLabel } from "../components/Badges.jsx";
import NotificationBell from "../components/NotificationBell.jsx";

const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const PRIORITY_OPTIONS = ["HIGH", "MEDIUM", "LOW"];

export default function Dashboard({ onOpenIssue, refreshKey }) {
  const [issues, setIssues] = useState(null);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ status: "", ai_priority: "" });

  useEffect(() => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.ai_priority) params.ai_priority = filters.ai_priority;

    api
      .queue(params)
      .then((data) => setIssues(data.results || data))
      .catch(() => setError("Couldn't load the complaint queue."));
  }, [filters, refreshKey]);

  const stats = useMemo(() => {
    if (!issues) return null;
    return {
      open: issues.filter((i) => i.status === "OPEN").length,
      inProgress: issues.filter((i) => i.status === "IN_PROGRESS").length,
      high: issues.filter((i) => i.ai_priority === "HIGH" && i.status !== "CLOSED").length,
      total: issues.length,
    };
  }, [issues]);

  return (
    <div className="main">
      <div className="page-head">
        <div>
          <p className="eyebrow">Queue</p>
          <h1 style={{ fontSize: 22, marginTop: 4 }}>Complaint queue</h1>
        </div>
        <NotificationBell onOpenIssue={onOpenIssue} />
      </div>

      {stats && (
        <div className="stat-row">
          <StatCard num={stats.total} label="Total in view" />
          <StatCard num={stats.open} label="Open" />
          <StatCard num={stats.inProgress} label="In progress" />
          <StatCard num={stats.high} label="High priority (unresolved)" />
        </div>
      )}

      <div className="filter-bar">
        <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
        <select value={filters.ai_priority} onChange={(e) => setFilters((f) => ({ ...f, ai_priority: e.target.value }))}>
          <option value="">All priorities</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {error && <p className="error-text">{error}</p>}
      {issues === null && !error && <p className="hint">Loading queue…</p>}

      {issues && issues.length === 0 && (
        <div className="info-card">
          <p>Nothing matches these filters right now.</p>
        </div>
      )}

      {issues && issues.length > 0 && (
                <table className="queue-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Location</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Reported</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id} className="queue-row" onClick={() => onOpenIssue(issue.id)}>
                <td><AssetTag id={issue.asset_display} /></td>
                <td className="hint" style={{ fontSize: 12 }}>{issue.asset_area_path}</td>
                <td className="desc-cell">{issue.description}</td>
                <td><PriorityLabel priority={issue.ai_priority} /></td>
                <td><StatusBadge status={issue.status} /></td>
                <td className="hint">{new Date(issue.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function StatCard({ num, label }) {
  return (
    <div className="stat-card">
      <div className="num">{num}</div>
      <div className="label">{label}</div>
    </div>
  );
}

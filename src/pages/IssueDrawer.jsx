import { useEffect, useState } from "react";
import { api, mediaUrl } from "../api.js";
import { AssetTag, StatusBadge, PriorityLabel } from "../components/Badges.jsx";

const NEXT_STATUS = {
  OPEN: "IN_PROGRESS",
  IN_PROGRESS: "RESOLVED",
  RESOLVED: "CLOSED",
};
const NEXT_LABEL = {
  IN_PROGRESS: "Mark in progress",
  RESOLVED: "Mark resolved",
  CLOSED: "Close complaint",
};

export default function IssueDrawer({ issueId, onClose, onChanged }) {
  const [issue, setIssue] = useState(null);
  const [error, setError] = useState("");

  const [officers, setOfficers] = useState([]);
  const [officerId, setOfficerId] = useState("");
  const [assignError, setAssignError] = useState("");
  const [assigning, setAssigning] = useState(false);

  const [note, setNote] = useState("");
  const [statusError, setStatusError] = useState("");
  const [updating, setUpdating] = useState(false);

  function load() {
    api.issueDetail(issueId).then(setIssue).catch(() => setError("Couldn't load this complaint."));
  }

    useEffect(load, [issueId]);
  useEffect(() => {
    api.officers().then((data) => setOfficers(data.results || data)).catch(() => setOfficers([]));
  }, []);

  async function handleAssign() {
    if (!officerId.trim()) {
      setAssignError("Enter an officer's user ID to assign.");
      return;
    }
    setAssignError("");
    setAssigning(true);
    try {
      await api.assign(issueId, officerId.trim());
      setOfficerId("");
      load();
      onChanged?.();
    } catch {
      setAssignError("Couldn't assign that officer. Check the ID and try again.");
    } finally {
      setAssigning(false);
    }
  }

  async function handleAdvanceStatus() {
    const next = NEXT_STATUS[issue.status];
    if (!next) return;
    setStatusError("");
    setUpdating(true);
    try {
      await api.updateStatus(issueId, next, note.trim());
      setNote("");
      load();
      onChanged?.();
    } catch {
      setStatusError("Couldn't update the status. Try again.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <button className="drawer-close" onClick={onClose} aria-label="Close">×</button>

        {error && <p className="error-text">{error}</p>}
        {!issue && !error && <p className="hint">Loading…</p>}

                {issue && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <AssetTag id={issue.asset_display} large />
              <StatusBadge status={issue.status} />
            </div>

            {issue.asset_area_path && (
              <p className="hint" style={{ marginTop: -8 }}>📍 {issue.asset_area_path}</p>
            )}

            <PriorityLabel priority={issue.ai_priority} />

            <div>
              <p className="eyebrow">Citizen report</p>
              <p style={{ marginTop: 6, color: "var(--ink)" }}>{issue.description}</p>
              <p className="hint" style={{ marginTop: 4 }}>Reported by {issue.reporter_name}</p>
            </div>

            {issue.ai_category && (
  <div className="info-card">
    <p className="eyebrow">AI classification</p>
    <p style={{ marginTop: 6, color: "var(--ink)" }}>{issue.ai_category}</p>
    {issue.ai_summary && <p style={{ marginTop: 4, fontSize: 13 }}>{issue.ai_summary}</p>}
    {issue.ai_department_suggestion_name && (
      <p style={{ marginTop: 8, fontSize: 13 }}>
        <strong>Suggested department:</strong> {issue.ai_department_suggestion_name}
        {issue.asset_department_name
          && issue.ai_department_suggestion_name !== issue.asset_department_name && (
          <span style={{ color: "var(--amber)" }}>
            {" "}(asset is normally routed to {issue.asset_department_name})
          </span>
        )}
      </p>
    )}
  </div>
)}

            {issue.duplicate_of && (
              <div className="info-card" style={{ borderColor: "var(--amber)" }}>
                <p className="eyebrow" style={{ color: "var(--amber)" }}>Possible duplicate</p>
                <p style={{ marginTop: 6, fontSize: 13 }}>Likely the same issue as complaint #{issue.duplicate_of}.</p>
              </div>
            )}

{issue.photos && issue.photos.length > 0 && (
  <div>
    <p className="eyebrow">Photos & videos</p>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
      {issue.photos.map((p) =>
        p.video ? (
          <video
            key={p.id}
            src={mediaUrl(p.video)}
            controls
            style={{ width: 180, height: 120, borderRadius: 8, border: "1px solid var(--line)" }}
          />
        ) : (
          <a key={p.id} href={mediaUrl(p.image)} target="_blank" rel="noreferrer">
            <img
              src={mediaUrl(p.image)}
              alt="Reported issue"
              style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8, border: "1px solid var(--line)" }}
            />
          </a>
        )
      )}
    </div>
  </div>
)}

            <hr style={{ border: "none", borderTop: "1px solid var(--line)" }} />

            <div className="field">
              <label>Assigned officer</label>
              <p style={{ fontSize: 14, color: "var(--ink)" }}>
                {issue.assigned_officer_name || "Not yet assigned"}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <select
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  style={{ flex: 1, border: "1.5px solid var(--line-strong)", borderRadius: 6, padding: "9px 10px", fontSize: 13 }}
                >
                  <option value="">Choose an officer…</option>
                  {officers.map((o) => (
                    <option key={o.id} value={o.id}>
                      {(o.first_name || o.last_name) ? `${o.first_name} ${o.last_name}`.trim() : o.username}
                      {o.department_name ? ` — ${o.department_name}` : ""} ({o.role})
                    </option>
                  ))}
                </select>
                <button className="btn-secondary" onClick={handleAssign} disabled={assigning}>
                  {assigning ? "Assigning…" : "Assign"}
                </button>
              </div>
              {officers.length === 0 && (
                <p className="hint" style={{ marginTop: 4 }}>
                  No officer accounts yet — create some in Django admin first.
                </p>
              )}
              {assignError && <p className="error-text">{assignError}</p>}
            </div>

            {NEXT_STATUS[issue.status] && (
              <div className="field">
                <label>Update status</label>
                <textarea
                  placeholder={issue.status === "IN_PROGRESS" ? "Resolution notes…" : "Optional note…"}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                {statusError && <p className="error-text">{statusError}</p>}
                <button className="btn-primary" onClick={handleAdvanceStatus} disabled={updating}>
                  {updating ? "Updating…" : NEXT_LABEL[NEXT_STATUS[issue.status]]}
                </button>
              </div>
            )}

            <div>
              <p className="eyebrow">Status history</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
                {issue.status_history.map((h, i) => (
                  <div key={i} style={{ display: "flex", gap: 10 }}>
                    <div className="timeline-dot" />
                    <div>
                      <StatusBadge status={h.status} />
                      <p className="hint" style={{ marginTop: 3 }}>
                        {new Date(h.changed_at).toLocaleString()} {h.note && `— ${h.note}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

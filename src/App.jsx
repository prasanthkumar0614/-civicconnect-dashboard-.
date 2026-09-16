import { useEffect, useState } from "react";
import { getToken, setToken, api } from "./api.js";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import IssueDrawer from "./pages/IssueDrawer.jsx";

export default function App() {
  const [authed, setAuthed] = useState(!!getToken());
  const [me, setMe] = useState(null);
  const [openIssueId, setOpenIssueId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (authed) api.me().then(setMe).catch(() => {});
  }, [authed]);

  if (!authed) {
    return <Login onLoggedIn={() => setAuthed(true)} />;
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">CC</span>
          CivicConnect
        </div>

        <nav className="side-nav">
          <button className="active">Complaint queue</button>
        </nav>

        <div className="side-footer">
          {me && (
            <div className="user-chip">
              <strong>{me.username}</strong>
              {me.role_display}{me.department_name ? ` · ${me.department_name}` : ""}
            </div>
          )}
          <button
            className="btn-text-inverse"
            onClick={() => {
              setToken(null);
              setAuthed(false);
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      <Dashboard onOpenIssue={setOpenIssueId} refreshKey={refreshKey} />

      {openIssueId && (
        <IssueDrawer
          issueId={openIssueId}
          onClose={() => setOpenIssueId(null)}
          onChanged={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
}

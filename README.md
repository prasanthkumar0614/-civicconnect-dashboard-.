# CivicConnect — Authority Dashboard

The officer / department admin / mandal head dashboard for **CivicConnect**. Authorities manage the incoming complaint queue, assign officers, update statuses, and visualize asset clusters on a map across Andhra Pradesh's real administrative hierarchy.

## Live Service

- **Dashboard:** https://civicconnect-dashboard.vercel.app
- **Backend API:** https://civicconnect-p3mq.onrender.com

## Features

- Filterable complaint queue (status, priority)
- Officer assignment and forward-only status workflow: Open → In Progress → Resolved → Closed
- AI classification (category, priority, department suggestion) and duplicate-complaint warnings shown per complaint
- Interactive asset map (Leaflet + OpenStreetMap) with status-colored markers and detected fault clusters
- In-app notification bell for new assignments and high-priority alerts
- Role-scoped views — Department Admins see their department, Mandal Heads see their whole mandal across departments
- Full District → Mandal → Village → Ward location shown on every complaint

## Data Note

Complaint locations are shown against the backend's real government District/Mandal/Village data. Ward-level detail is application-generated for demonstration purposes — see the backend README for full data attribution.

## Tech Stack

React + Vite, Leaflet for maps, same civic design system as the citizen app.

## Local Setup

```bash
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in a `.env` file pointing at the backend API.

## Author

**Sodima Naga Prasanth Kumar**

B.Tech Electronics & Communication Engineering
Pace Institute of Technology and Sciences, Ongole

**Role:** Developer / Creator of CivicConnect

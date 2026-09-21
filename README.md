# CivicConnect — Authority Dashboard

The officer / department admin / mandal head dashboard for **CivicConnect**. Manage the incoming complaint queue, assign officers, update statuses, and visualize asset clusters on a map.

🔗 **Live dashboard:** https://civicconnect-dashboard.vercel.app
🔗 **Backend API:** https://civicconnect-p3mq.onrender.com

## Features

- Filterable complaint queue with priority and status filters
- Officer assignment and forward-only status workflow (Open → In Progress → Resolved → Closed)
- AI classification and duplicate-complaint warnings shown per complaint
- Interactive asset map (Leaflet + OpenStreetMap) with status-colored markers and detected fault clusters
- In-app notification bell for new assignments and high-priority alerts
- Role-scoped views — Department Admins see their department, Mandal Heads see their whole mandal across departments
- Full district/mandal/village location visibility on every complaint

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
B.Tech Electronics & Communication Engineering, Pace Institute of Technology and Sciences, Ongole

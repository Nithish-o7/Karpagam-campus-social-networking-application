# KCE Connect — Frontend Client

This directory contains the React 19 + TypeScript + Vite frontend client code for the **KCE Connect** campus social networking application and ServiceNow ITSM portal.

---

## 🚀 Getting Started

To run the frontend client locally, we recommend using the launcher script in the repository root, which starts both the frontend client and the backend middleware:

```bash
# From the repository root
bash start.sh
```

### Manual Development Launch

If you wish to spin up the frontend development server independently:

1. Ensure dependencies are installed in this directory:
   ```bash
   npm install
   ```
2. Configure your local `.env` variables (see template below).
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run on [http://localhost:5173](http://localhost:5173).

---

## ⚙️ Environment Variables

Create a `.env` file in this folder (or use the one in the repository root if running the root scripts):

```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001

# Firebase Client Configuration (Auth & Media Storage)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🎨 Tech Stack & Highlights

- **React 19 & TypeScript**: Strong types, components, and custom hooks.
- **Vite**: Rapid Hot Module Replacement (HMR) and fast production builds.
- **Framer Motion & GSAP**: High-fidelity micro-interactions and transitions.
- **Socket.io Client**: Connection to backend for real-time messaging, typing events, and alerts.
- **Lucide Icons**: Aesthetic modern icons.

For a full overview of the project architecture, database models, and ServiceNow ITSM integrations, please refer to the **[Primary README.md](../README.md)** in the repository root.

# <p align="center"><img src="public/banner.png" alt="KCE Connect Banner" width="100%"></p>

<p align="center">
  <a href="https://github.com/Nithish-o7/Karpagam-campus-social-networking-application/commits/developer">
    <img src="https://img.shields.io/github/last-commit/Nithish-o7/Karpagam-campus-social-networking-application/developer?style=for-the-badge&color=A6192E&logo=github" alt="Last Commit">
  </a>
  <a href="https://github.com/Nithish-o7/Karpagam-campus-social-networking-application/pulls">
    <img src="https://img.shields.io/github/issues-pr/Nithish-o7/Karpagam-campus-social-networking-application?style=for-the-badge&color=1A2254&logo=git" alt="Pull Requests">
  </a>
  <img src="https://img.shields.io/badge/Status-Active-28A745?style=for-the-badge&logo=statuspage&logoColor=white" alt="Status Active">
  <img src="https://img.shields.io/badge/PRs-Welcome-4A5FD9?style=for-the-badge" alt="PRs Welcome">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.9-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TS">
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node">
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/PostgreSQL-15+-316192?style=flat-square&logo=postgresql&logoColor=white" alt="Postgres">
  <img src="https://img.shields.io/badge/Prisma-6.x-39827B?style=flat-square&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/ServiceNow-Washington-293E40?style=flat-square&logo=servicenow&logoColor=white" alt="SNOW">
  <img src="https://img.shields.io/badge/Socket.io-4.x-010101?style=flat-square&logo=socket.io&logoColor=white" alt="Socket">
  <img src="https://img.shields.io/badge/Firebase-12.x-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase">
</p>

---

## 📖 Introduction

**KCE Connect** (Karpagam Campus Social Hub & ITSM Portal) is a highly integrated, premium full-stack campus platform developed exclusively for the students, faculty, staff, and alumni of **Karpagam College of Engineering**.

The application bridges two distinct worlds:
*   📢 **Interactive Campus Social Hub**: A modern social space (similar to Reddit/Instagram) built with rich media uploads, 6-type emotional reaction models, study groups, job placement boards, and real-time Socket.io-based chat rooms.
*   🎫 **Headless ITSM Integration**: A simplified issue-reporting system linked directly to the **ServiceNow Developer Instance**. Submitting campus issues automatically creates incidents, enforces SLA countdowns, and details updates directly to users without exposing the complexity of the ServiceNow portal.

---

## ⚡ Interactive Key Features

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>📢 Social Feed & Discussion</h3>
      <ul>
        <li><b>Infinite Stream</b>: Scroll chronologically through announcements, campus news, and peer posts.</li>
        <li><b>Rich Media Uploads</b>: Support for images and video posts stored via Firebase.</li>
        <li><b>Categorized Flairs</b>: Tag posts with flairs like <code>ACADEMIC</code>, <code>EVENTS</code>, <code>HOSTEL</code>, <code>SPORTS</code>, <code>TECH</code>, <code>FUN</code>, <code>ANNOUNCEMENT</code>.</li>
        <li><b>Engagement Models</b>: Upvote, bookmark, comment, and react using 6 emotion types: <i>Like, Celebrate, Insightful, Hot, Support, Agree</i>.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>🎫 Headless ITSM ServiceNow Bridge</h3>
      <ul>
        <li><b>Record Producer Form</b>: Report issues (Wifi, Lab, Electricity, Hostel, Transport, Classroom) with block/room locations.</li>
        <li><b>Auto Routing & SLAs</b>: Incidents are automatically assigned to ServiceNow groups (e.g. <i>Network Team</i>, <i>Hostel Management</i>).</li>
        <li><b>Caching & Fallback</b>: Real-time ticket sync using local PostgreSQL cache as a fallback if the ServiceNow server sleeps.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>💬 Real-Time Socket Messaging</h3>
      <ul>
        <li><b>Private & Group Channels</b>: Powered by <code>Socket.io</code> for real-time messaging.</li>
        <li><b>Real-time Indicators</b>: Typing prompts, unread notification counts, and instant status updates.</li>
        <li><b>Department Study Groups</b>: Custom message boards, note sharing, and moderator actions.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>🚨 Priority Emergency SOS Dispatch</h3>
      <ul>
        <li><b>SOS Panic Trigger</b>: Single-tap emergency alarm sharing GPS or campus room coordinates.</li>
        <li><b>ServiceNow P1 Incident Creation</b>: Instantly routes a high-priority ticket to Campus Security, bypassing typical triage queues for safety.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>💼 Placement Job Board</h3>
      <ul>
        <li><b>Career Tracker</b>: Find on-campus internships, contracts, and full-time placement drives.</li>
        <li><b>Saved Postings</b>: Bookmark job descriptions, requirement matrices, deadlines, and direct apply links.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>📚 Shared Academic Library</h3>
      <ul>
        <li><b>Resource Repository</b>: Upload and download notes, semester papers, syllabus guidelines, and books.</li>
        <li><b>Peer Endorsements</b>: Upvote resources to filter quality materials, categorized by code/semester.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🛠️ Improved Technology Stack

KCE Connect uses a decoupled architecture designed for speed, resilience, and high-quality visuals.

```
📁 Karpagam Campus Social Networking Application
├── 📁 src/ (Frontend Source)
├── 📁 frontend/ (Frontend Subproject - React 19 Client)
├── 📁 middleware/ (Backend Subproject - Node API Proxy)
└── 📁 servicenow-config/ (Submodule - ServiceNow Scoped App Update Sets)
```

```mermaid
graph TD
    subgraph Client [React Frontend - Port 5173]
        A[User UI View] --> B[API Client / Services]
        A --> C[Socket.io Connection]
    end

    subgraph Middleware [Express Server - Port 3001]
        B --> D[Express Proxy Router]
        C --> E[Socket.io Controller]
        D --> F[Auth & JWT Middleware]
    end

    subgraph Data [Data & Auth Providers]
        F --> G[(PostgreSQL via Prisma)]
        F --> H[Firebase Auth & Storage]
    end

    subgraph ITSM [ITSM Infrastructure]
        F --> I[ServiceNow Developer Instance]
    end

    classDef client fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef middleware fill:#efebe9,stroke:#4e342e,stroke-width:2px;
    classDef data fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef itsm fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    
    class A,B,C client;
    class D,E,F middleware;
    class G,H data;
    class I itsm;
```

### Stack Breakdown

<table>
  <tr>
    <td width="33%" valign="top">
      <h3>🌐 Frontend Client</h3>
      <ul>
        <li><b>React 19 & TS</b>: Strict component types and fast HMR builds.</li>
        <li><b>Vite 8.0</b>: Instant hot reloading and build optimization.</li>
        <li><b>Framer Motion & GSAP</b>: Controls animations, transitions, and micro-interactions.</li>
        <li><b>Socket.io Client</b>: Connects to the real-time message stream.</li>
        <li><b>Lucide React</b>: Modern icons.</li>
      </ul>
      <p><i>Code entry:</i> <code>frontend/src/</code></p>
    </td>
    <td width="33%" valign="top">
      <h3>⚙️ Middleware Proxy</h3>
      <ul>
        <li><b>Express.js</b>: High-performance routing system with global error handlers.</li>
        <li><b>JWT Credentials</b>: Role verification and email constraints.</li>
        <li><b>Socket.io Server</b>: Manages connections, typing events, and message caching.</li>
        <li><b>Prisma Client</b>: Type-safe database queries.</li>
      </ul>
      <p><i>Code entry:</i> <code>middleware/src/</code></p>
    </td>
    <td width="33%" valign="top">
      <h3>🗄️ Persistence & Cloud</h3>
      <ul>
        <li><b>PostgreSQL</b>: Relational database storing social feeds, chat logs, and users.</li>
        <li><b>Prisma ORM</b>: Manages database pushes and schema changes.</li>
        <li><b>Firebase Auth</b>: Secure campus registration.</li>
        <li><b>Firebase Storage</b>: Media assets and post attachment hosting.</li>
      </ul>
      <p><i>Code entry:</i> <code>middleware/prisma/</code></p>
    </td>
  </tr>
</table>

---

## 🔄 ServiceNow Bridge Request Lifecycle

Below is the execution flow when a campus issue is reported:

```mermaid
sequenceDiagram
    autonumber
    actor User as KCE Student / Staff
    participant App as React Frontend (5173)
    participant Mid as Node Middleware (3001)
    participant PG as PostgreSQL (Prisma Cache)
    participant SNOW as ServiceNow Table API

    User->>App: Submits "Report Issue" Form
    App->>Mid: POST /api/tickets (JSON payload + JWT)
    Note over Mid: Validates user details & credentials
    Mid->>SNOW: Live POST request to Custom Table
    alt ServiceNow is Online
        SNOW-->>Mid: Success response (Incident ID, Ticket #, sys_id)
        Mid->>PG: Cache ticket status locally in 'cached_tickets'
        Mid-->>App: Return success status + Ticket Number
        App-->>User: Displays "Ticket created successfully!"
    else ServiceNow is Offline / Rate Limited
        Mid->>PG: Log ticket as pending status locally
        Mid-->>App: Return success (cached) + alert user of offline status
        App-->>User: Displays "Ticket queued. Showing last known state."
    end
```

---

## 🚀 Installation & Local Development

Set up and run KCE Connect on your local machine using the guidelines below.

### 📋 Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** (v15 or higher)
- **Firebase Project** (Auth & Storage enabled)
- **ServiceNow Developer Instance** (with table `x_kce_campus_request` configured)

### 1. Repository Setup & Submodule Sync
Clone the repository and initialize submodules:
```bash
git clone https://github.com/Nithish-o7/Karpagam-campus-social-networking-application.git
cd "Karpagam campus social networking application"
git submodule update --init --recursive
```

### 2. Configure Environment variables

<details>
  <summary>🔑 Click to view Environment Configuration templates</summary>

#### Middleware Settings (`middleware/.env`)
```env
PORT=3001
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key_here

# PostgreSQL URL
DATABASE_URL="postgresql://username:password@localhost:5432/kce_connect"

# ServiceNow developer instance API credentials
SERVICENOW_INSTANCE_URL=https://dev319062.service-now.com
SERVICENOW_USERNAME=your_snow_username
SERVICENOW_PASSWORD=your_snow_password
SERVICENOW_TABLE=x_kce_campus_request
```

#### Frontend Settings (Root folder `.env`)
```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001

# Firebase credentials
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
</details>

### 3. Install Dependencies & Setup DB
```bash
# Install frontend packages
npm install

# Install middleware packages
cd middleware
npm install

# Push the database schema using Prisma
npx prisma db push
npx prisma generate
cd ..
```

### 4. Running the Complete App
The project includes a launcher script to start PostgreSQL (if stopped), check the database, apply pending migrations, and spin up both servers in one command:
```bash
bash start.sh
```

Once running:
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`
- **Health check / Diagnostics**: `http://localhost:3001/health`

---

## 🤝 Submodule Layout
The ServiceNow system configurations and scoped app configurations reside in the [servicenow-config](servicenow-config) directory, which tracks the `sn_instances/dev319062` branch from our enterprise Git repository. If you make configuration modifications on the ServiceNow platform, export your update set XML files and commit them there.

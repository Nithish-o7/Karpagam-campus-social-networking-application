# <p align="center"><img src="public/banner.png" alt="KCE Connect Banner" width="100%"></p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite Badge">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js Badge">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express Badge">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL Badge">
  <img src="https://img.shields.io/badge/Prisma-39827B?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma Badge">
  <img src="https://img.shields.io/badge/ServiceNow-293E40?style=for-the-badge&logo=servicenow&logoColor=white" alt="ServiceNow Badge">
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io Badge">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase Badge">
</p>

---

## 📖 Project Overview

**KCE Connect** (Karpagam Campus Social Hub & ITSM Portal) is a highly integrated, modern, full-stack campus platform developed exclusively for the students, faculty, staff, and alumni of **Karpagam College of Engineering**.

The application operates as a dual-purpose platform:
1. **Modern Campus Social Hub**: A vibrant, real-time social feed (similar to Instagram/Reddit) with chronological post streams, rich media uploads, 6-type emotional reaction systems, study groups, event sign-ups, interactive polls, a placement job board, and socket-driven direct messaging.
2. **Headless ITSM ServiceNow Portal**: A streamlined campus issue reporting workflow. Submitting a ticket instantly forwards data to a custom scoped application on a **ServiceNow Developer Instance**, syncing status updates, SLA countdowns, and routing logs directly back to the student's dashboard—without requiring them to log into the ServiceNow console.

---

## ✨ Key Features

### 1. 📢 Campus Social Feed & Highlights
- **Infinite Chronological Feed**: View posts, notices, and updates from fellow peers and campus authorities.
- **Rich Media & Post Customization**: Support for image and video attachments (stored in Firebase), custom hashtags, and category flairs (`ACADEMIC`, `EVENTS`, `HOSTEL`, `SPORTS`, `TECH`, `FUN`, `ANNOUNCEMENT`).
- **Interactive Polls**: Embed options, gather opinions, and view real-time voter statistics.
- **Engagement Mechanics**: 6 distinct custom emotional reactions (`LIKE`, `CELEBRATE`, `INSIGHTFUL`, `HOT`, `SUPPORT`, `AGREE`), comment threads, and bookmarking.
- **User Verification**: Roles (`Student`, `Faculty`, `Staff`, `Alumni`) displayed as distinctive profile badges. Only verified `@kce.ac.in` domain users are permitted to register.

### 2. 🎫 ServiceNow Headless ITSM Bridge
- **Service Request Form**: Submit issues across key categories (WiFi, Labs, Electricity, Hostel, Transport, Classroom) with exact block and room mapping, along with photo attachments.
- **Automated Routing**: Submissions map directly to `x_kce_campus_request` in ServiceNow, automatically assigning incidents to specialized groups (e.g., *Network Team*, *Hostel Management*).
- **Live Sync & Fallback Caching**: Real-time retrieval of ticket statuses (`New`, `Work in Progress`, `Resolved`) and SLA indicators. In case ServiceNow is unreachable, the system falls back to a locally cached database state.

### 3. 💬 Real-Time Messaging & Study Groups
- **Direct & Group Chats**: Powered by `Socket.io` for latency-free messaging, typing indicators, and read receipts.
- **Departmental Study Groups**: Join or moderate academic interest groups. Post notes, schedule study sessions, and message members.

### 4. 💼 Career Center & Placement Hub
- **Job & Internship Board**: Filters for internship, full-time, contract, and on-campus positions.
- **Applications & Bookmarks**: Details on job requirements, company profiles, salaries, and deadline tracking.

### 5. 📚 Academic Resource Sharing
- **Material Repository**: Upload and download study resources, textbook PDFs, notes, and previous semester question papers.
- **Upvote System**: Community-curated quality filtering with categorization by department, subject code, and semester.

### 6. 🚨 Emergency SOS Dispatch
- **SOS Button**: Instantly triggers an emergency incident with location information.
- **Priority Sync**: Instantly creates a critical P1 incident on the ServiceNow backend, dispatching campus security.

---

## 🛠️ Technology Stack

| Layer | Technologies & Frameworks | Description |
|---|---|---|
| **Frontend (Client)** | React 19, TypeScript, Vite, React Router Dom, Framer Motion, GSAP, Lucide Icons | Premium UI experience, smooth micro-animations, fast hot module replacement, and clean layout flow. |
| **Middleware (Proxy)** | Node.js, Express, TypeScript, JWT, Socket.io | Secure API router, real-time socket controller, and proxy layer for ServiceNow REST API. |
| **Database (ORM)** | PostgreSQL, Prisma ORM | Stores social content, accounts, message logs, and caching layer for ServiceNow tickets. |
| **Cloud Services** | Firebase Auth & Firebase Storage | Secure passwordless or credential-based accounts and scalable cloud storage for post attachments. |
| **Backend ITSM** | ServiceNow REST Table API | Enterprise-grade ITSM ticket routing, SLA enforcement, and assignment groups. |

---

## 📐 Architecture & Flow Diagrams

### High-Level System Architecture

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

### ServiceNow Bridge Request Lifecycle

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

## 🚀 Installation & Local Setup

Follow these steps to run the complete KCE Connect platform locally.

### 📋 Prerequisites
- **Node.js** (v18 or higher recommended)
- **PostgreSQL** (v15 or higher)
- **Firebase Project** (Auth enabled & Storage bucket set up)
- **ServiceNow Developer Instance** (with custom table `x_kce_campus_request` configured)

### 1. Repository Setup & Submodules
Clone the repository and initialize submodules:
```bash
git clone https://github.com/Nithish-o7/Karpagam-campus-social-networking-application.git
cd "Karpagam campus social networking application"
git submodule update --init --recursive
```

### 2. Configure Environment Variables
Create `.env` files in both the **Root** (Frontend) and the **Middleware** (Backend) directories.

#### Middleware Configuration
Create `middleware/.env` from `middleware/.env.example`:
```env
PORT=3001
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key_here

# PostgreSQL Database URL
DATABASE_URL="postgresql://username:password@localhost:5432/kce_connect"

# ServiceNow Instance Connection
SERVICENOW_INSTANCE_URL=https://your-instance.service-now.com
SERVICENOW_USERNAME=your_admin_username
SERVICENOW_PASSWORD=your_admin_password
SERVICENOW_TABLE=x_kce_campus_request
```

#### Frontend Configuration
Create `.env` in the root folder:
```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001

# Firebase Configuration Details
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Install Dependencies
Install dependencies in both the root folder (frontend) and the middleware folder:
```bash
# Root (Frontend)
npm install

# Middleware (Backend)
cd middleware
npm install
cd ..
```

### 4. Database Setup & Migrations
Prisma handles your PostgreSQL schema. Run migrations to initialize the database structure:
```bash
cd middleware
npx prisma db push
npx prisma generate
cd ..
```

### 5. Launching the App
The project includes a launcher script `start.sh` to spin up PostgreSQL (if stopped), check the database, apply pending migrations, and spin up the backend proxy and frontend compiler in one command:
```bash
bash start.sh
```

Once running:
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`
- **Health check / Diagnostics**: `http://localhost:3001/health`

---

## 🎨 Brand Guidelines & Color Space

The app interface strictly implements the Karpagam Campus color parameters:

*   **Karpagam Crimson** (`#A6192E`): Used as the primary academic brand color, headers, primary buttons, and alerts.
*   **Campus Navy** (`#1A2254`): Used as the secondary color, dark headers, footers, and active tabs.
*   **Innovation Blue** (`#4A5FD9`): Secondary highlights, links, and "In Progress" badges.
*   **Success Green** (`#28A745`): Correct statuses, resolved badges, and SLA completions.
*   **Warning Gold** (`#FFC107`): Warnings, SLA near breaches, and pending states.

For further typography and spacing details, refer to [brandGuidelines.md](brandGuidelines.md).

---

## 🤝 Contributing & Submodule Layout
The ServiceNow system configurations, update sets, and scoped app configurations reside in the [servicenow-config](servicenow-config) directory, which tracks the `sn_instances/dev319062` branch from our enterprise Git repository. If you make configuration modifications on the ServiceNow platform, export your update set xml files and commit them there.

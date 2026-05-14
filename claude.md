# SYSTEM INSTRUCTIONS: Karpagam Campus Social Networking Application

## Project Overview

Build an **exclusive campus social networking application** designed specifically for the authorized personnel of Karpagam College of Engineering (students, faculty, staff, and alumni). The app functions as a modern social feed (similar to Instagram/Reddit) for campus updates, but features a powerful integration with a backend **ServiceNow scoped application**. Users can seamlessly report campus issues from the social app, which automatically generates ITSM incidents, triggers SLAs, and assigns tickets to the appropriate campus department groups and managers.

---

## Navigation Structure

### Bottom/Top Navigation Tabs
- Dashboard (Social Feed)
- Explore (Campus News/Events)
- Report Issue (ServiceNow Integration)
- My Tickets (Status Tracker)
- Profile

### Header Elements
- Karpagam College / App Logo
- Dark/Light mode toggle
- Search (Find peers or posts)
- Notifications
- User profile avatar

---

## Home Page (Social Feed)

### The Feed
- Infinite scroll of campus posts
- Post cards containing:
  - Author Avatar & Name
  - Role Badge (e.g., "Student", "Faculty", "Alumni")
  - Timestamp
  - Text content / Images
  - Engagement bar (Like, Comment, Share)
- "Create Post" input box at the top of the feed

### Campus Highlights Widget (Sidebar/Top)
- Trending campus topics
- Upcoming events
- Quick links to college resources

---

## Report Issue Page (The ServiceNow Bridge)

### Features
- A clean, mobile-friendly form that acts as the frontend Record Producer.
- Submitting this form sends a JSON payload through the middleware directly to the ServiceNow REST API.

### Issue Submission Form
- **Category Dropdown:**
  - Wifi Issues
  - Lab Issues
  - Electricity Issues
  - Hostel Issues
  - Transport Issues
  - Classroom Issues
- **Location Details:**
  - Block (Dropdown)
  - Room Number (Text/Dropdown)
- **Issue Description:** Multi-line text area
- **Attachments:** Option to upload a photo of the issue
- **Submit Button:** Triggers API call and shows success confirmation with generated ServiceNow Ticket ID.

---

## My Tickets Page

### Ticket Tracking
- List of all issues reported by the logged-in user.
- Fetches real-time status updates from ServiceNow.
- Ticket Cards display:
  - ServiceNow Incident ID (e.g., INC0010023)
  - Category & Short Description
  - Current Status Badge (Pending, Work in Progress, Resolved)
  - Assigned Department (e.g., "Network Team", "Hostel Management")
  - SLA Indicator (Time remaining for resolution)

---

## Profile Page

### User Details
- Full Name
- Roll Number / Employee ID
- Department (e.g., Computer Science and Technology)
- User Role
- Post History tab
- Reported Issues history tab

---

## Data Model

### User (Frontend DB)
\`\`\`json
{
  "id": "string",
  "name": "string",
  "email": "string (MUST BE @kce.ac.in)",
  "role": "student | faculty | staff | alumni",
  "department": "string",
  "avatar": "string | null",
  "createdAt": "timestamp"
}
\`\`\`

### Post (Frontend DB)
\`\`\`json
{
  "id": "string",
  "authorId": "string",
  "content": "string",
  "mediaUrl": "string | null",
  "likesCount": "number",
  "commentsCount": "number",
  "createdAt": "timestamp"
}
\`\`\`

### Service Request Payload (Sent to ServiceNow)
\`\`\`json
{
  "requester_email": "string",
  "service_category": "string",
  "block": "string",
  "room_number": "string",
  "short_description": "string",
  "source": "KCE Mobile App"
}
\`\`\`

### Ticket Status (Fetched from ServiceNow)
\`\`\`json
{
  "ticket_id": "string",
  "sys_id": "string",
  "category": "string",
  "assignment_group": "string",
  "state": "string (New, In Progress, Resolved)",
  "sla_breach_time": "timestamp | null",
  "resolution_notes": "string | null"
}
\`\`\`

---

## Core Functionalities

### Authentication & Authorization
- Strict access control: Only users with valid Karpagam College credentials can register/login.
- Role-based badges applied to user profiles automatically.

### Social Networking
- Create, read, update, and delete (CRUD) capabilities for social posts.
- Like and comment functionalities on posts.

### ServiceNow Integration (Headless ITSM)
- Seamless connection to the ServiceNow developer instance via middleware (Node.js/Python).
- Form submission maps exactly to the custom Karpagam Service Request table.
- Read-only fetch of user's active tickets to display progress without requiring them to log into the ServiceNow portal.

---

## Features for MVP
- Exclusive KCE user authentication
- Basic social feed (Text/Image posts, likes, comments)
- "Report Issue" form mapped to ServiceNow categories
- API connection to push tickets to ServiceNow backend
- "My Tickets" view fetching real-time status from ServiceNow
- User profiles

## Features to Exclude from MVP
- Direct messaging / Chat between users
- Live video streaming
- Complex post algorithms (just use chronological sorting)
- Complete ServiceNow Fulfiller Workspace (This remains on the SNOW platform)

---

## Technical Requirements

### Architecture
- **Frontend:** React, React Native, or Flutter for a smooth, app-like experience.
- **Middleware:** Node.js/Express or Python/Django to handle social data and act as a secure proxy to ServiceNow.
- **Backend (ITSM):** Existing ServiceNow Developer Instance handling the routing, assignment groups, and SLAs.

### API Integration
- Securely store ServiceNow API credentials in middleware environment variables.
- Handle API rate limits and display user-friendly error messages if the ServiceNow instance is asleep/down.

---
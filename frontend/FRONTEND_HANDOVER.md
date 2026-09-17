# 📱 Frontend Developer Handover & Integration Guide

Welcome! This document provides everything you need to build the frontend mobile/web application for **CivicAdvocate** using Expo React Native (`frontend/my-app`).

---

## 🧼 1. Clean Slate Guarantee

Your Expo template inside `frontend/my-app` has been **restored to its pristine, original template state**.
- All template tabs, routes, and styling are completely intact.
- You have **100% creative control** to design and build the screens however you envision!
- We have provided optional, ready-to-use TypeScript interfaces and an API service in `src/types/api.ts` and `src/services/api.ts`. You can use them directly or write your own fetch/axios calls.

---

## 🚀 2. Backend Quick Start & Interactive Swagger UI

### Start the Spring Boot Backend:
```bash
cd backend/civic-backend
./mvnw spring-boot:run
```
The server starts in **~2 seconds** on port `8080`.

### Explore the APIs in Your Browser:
Open **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)** to browse the interactive Swagger UI.
- You can test every endpoint directly in your browser.
- Inspect JSON schemas for requests and responses.
- Click **"Try it out"** to submit test tickets, query timelines, and test the time-travel warp.
- OpenAPI 3.0 Raw JSON: `http://localhost:8080/v3/api-docs`

---

## 📦 3. Pre-Seeded Realistic Demo Data

The database automatically initializes **4 realistic civic grievance tickets** in Hyderabad / GHMC jurisdictions so that your frontend immediately has rich, visual data to display on first boot:

| ID | Title / Hazard Type | Municipality & Ward | Severity | Initial Status | Image Preview |
|---|---|---|---|---|---|
| `#1` | **Severe POTHOLE** | Badangpet Circle / GHMC (Ward 14) | `8 / 10` | `TIER_1_ESCALATED` | `http://localhost:8080/uploads/pothole_badangpet.jpg` |
| `#2` | **Critical OPEN_MANHOLE** | Charminar Circle 9 / GHMC (Ward 22) | `9 / 10` | `TIER_2_ESCALATED` | `http://localhost:8080/uploads/manhole_charminar.jpg` |
| `#3` | **GARBAGE_OVERFLOW** | LB Nagar Circle / GHMC (Ward 11) | `7 / 10` | `SUBMITTED` | `http://localhost:8080/uploads/garbage_lbnagar.jpg` |
| `#4` | **BROKEN_STREETLIGHT** | Serilingampally Circle (Ward 104) | `6 / 10` | `RESOLVED` | `http://localhost:8080/uploads/streetlight_serilingampally.jpg` |

Each ticket comes with complete, realistic audit logs tracking the autonomous agent's actions (intake, email dispatch to Ward Officers, escalation to Zonal Commissioners, and resolution remarks).

---

## 🌐 4. Host Address Configuration for Expo

When connecting from Expo React Native to the local Spring Boot backend:
- **Web Preview (`w` in terminal):** `http://localhost:8080`
- **iOS Simulator:** `http://localhost:8080`
- **Android Emulator:** `http://10.0.2.2:8080` (Android maps host localhost to `10.0.2.2`)
- **Physical Device (via Expo Go QR code):** `http://<YOUR_COMPUTER_LAN_IP>:8080` (e.g. `http://192.168.1.50:8080`)

*Note: The backend has enterprise permissive CORS enabled (`*`), so cross-origin requests from Expo web and mobile devices work out of the box without header restrictions.*

---

## 🔌 5. Core API Endpoints Reference

### 1. Ingest Civic Hazard (T=0)
- **Method:** `POST /api/v1/tickets`
- **Content-Type:** `multipart/form-data` OR `application/json`
- **Parameters (multipart/form-data):**
  - `image` *(File, optional)*: Image captured by camera or gallery.
  - `latitude` *(Double, required)*: e.g. `17.3193`
  - `longitude` *(Double, required)*: e.g. `78.5298`
  - `description` *(String, optional)*: e.g. `"Severe pothole near crossroad"`
  - `citizenContact` *(String, optional)*: e.g. `"+91-9876543210"`
- **Payload (application/json option):**
```json
{
  "latitude": 17.3193,
  "longitude": 78.5298,
  "description": "Severe pothole near crossroad",
  "citizenContact": "+91-9876543210",
  "imageUrl": "/uploads/pothole_badangpet.jpg"
}
```
- **Response:** `201 Created`
```json
{
  "id": 1,
  "title": "Severe POTHOLE at Badangpet Circle / GHMC (Ward 14)",
  "hazardType": "POTHOLE",
  "status": "SUBMITTED",
  "municipality": "Badangpet Circle / GHMC",
  "ward": "Ward 14",
  "zone": "LB Nagar Zone",
  "severityScore": 8,
  "imageUrl": "/uploads/pothole_badangpet.jpg",
  "latitude": 17.3193,
  "longitude": 78.5298,
  "createdAt": "2026-09-17T12:00:00"
}
```

### 2. List All Tickets (Feed)
- **Method:** `GET /api/v1/tickets`
- **Response:** `200 OK` (Array of ticket summaries, ordered newest first)

### 3. Get Ticket Details
- **Method:** `GET /api/v1/tickets/{id}`
- **Response:** `200 OK` (Full record with assigned Ward Officer email, Zonal Commissioner email, official Twitter handles, and resolution date)

### 4. Get Audit Timeline
- **Method:** `GET /api/v1/tickets/{id}/timeline`
- **Response:** `200 OK`
```json
{
  "ticketId": 1,
  "title": "Severe POTHOLE at Badangpet Circle / GHMC (Ward 14)",
  "currentStatus": "TIER_1_ESCALATED",
  "municipality": "Badangpet Circle / GHMC",
  "ward": "Ward 14",
  "timeline": [
    {
      "id": 1,
      "fromStatus": null,
      "toStatus": "SUBMITTED",
      "action": "TICKET_CREATED",
      "actor": "CITIZEN_MOBILE",
      "details": "Hazard ingested via mobile client. AI Vision verified POTHOLE with severity 8/10.",
      "timestamp": "2026-09-13T12:00:00"
    },
    {
      "id": 2,
      "fromStatus": "SUBMITTED",
      "toStatus": "TIER_1_ESCALATED",
      "action": "WARD_OFFICER_NOTIFIED",
      "actor": "AUTONOMOUS_SLA_AGENT",
      "details": "Statutory 3-Day SLA breached. Grievance dossier emailed to local Ward Officer.",
      "timestamp": "2026-09-16T12:00:00"
    }
  ]
}
```

### 5. Fast-Forward Ticket Age (Time-Travel Warp)
- **Method:** `POST /api/v1/simulation/tickets/{id}/advance`
- **Body:** `{"days": 3}` (or query parameter `?days=3`)
- **Response:** `200 OK`
```json
{
  "ticketId": 1,
  "previousStatus": "SUBMITTED",
  "newStatus": "TIER_1_ESCALATED",
  "daysShifted": 3,
  "message": "Advanced ticket #1 by 3 days. Current state: TIER_1_ESCALATED.",
  "newActions": [...]
}
```

### 6. Resolve Ticket
- **Method:** `PATCH /api/v1/tickets/{id}/resolve?remarks=Repaired+by+field+unit`
- **Response:** `200 OK`

---

## 🎨 6. Recommended Screen Architecture (From `Docs/phases.md`)

1. **Screen 1: Camera & Geolocation Snap Intake**
   - Camera preview with snap button (`expo-camera` or `expo-image-picker`).
   - GPS coordinate capture (`expo-location`).
   - Single "Submit Civic Grievance" button.
2. **Screen 2: Grievance Dashboard / Feed**
   - Card list showing reported hazards with status badges:
     - `SUBMITTED`: Blue
     - `TIER_1_ESCALATED`: Amber (Ward Officer)
     - `TIER_2_ESCALATED`: Orange (Zonal Commissioner)
     - `TIER_3_TWEETED`: Red (Public Twitter Alert)
     - `RESOLVED`: Green
   - Severity indicator ($1 - 10$).
3. **Screen 3: Live Audit Timeline & Escalation Tracker**
   - Vertical timeline rendering each audit event with actor badge and timestamp.
   - Live "Resolve" button for field engineers.
4. **Screen 4: Hackathon Demo Warp Panel (Stage Pitch)**
   - Buttons to fast-forward: `+3 Days (Tier 1)`, `+4 Days (Tier 2)`, `+7 Days (Tier 3 Twitter)`.

---

## 🛠️ 7. Ready-to-Use TypeScript Helper
You can optionally import from `@/services/api`:
```typescript
import { getTickets, createTicket, getTimeline, advanceTicketTime, resolveTicket } from '@/services/api';

// Fetch feed
const tickets = await getTickets();

// Warp simulation
const warpResult = await advanceTicketTime(ticketId, 3);
```

Happy coding! If you need anything on the backend, check `Docs/` or test endpoints live on Swagger UI.

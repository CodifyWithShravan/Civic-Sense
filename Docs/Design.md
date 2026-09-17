# Detailed Engineering & Design Specification

## Project: CivicAdvocate — Autonomous Civic Grievance & Escalation Agent
**Document:** Detailed Design & API Specification  
**Version:** 1.0.0  
**Target:** Engineering Team & Frontend Integration  

---

## 1. Design Patterns & Architectural Principles

### 1.1 State Pattern & Transition Guards
Ticket lifecycles follow a deterministic state progression:
- Allowed forward transitions:
  - `SUBMITTED` &rarr; `TIER_1_ESCALATED` &rarr; `TIER_2_ESCALATED` &rarr; `TIER_3_TWEETED` &rarr; `RESOLVED`
  - Any non-terminal state &rarr; `RESOLVED`
  - `SUBMITTED` &rarr; `REJECTED` (if visual verification fails)
- Illegal transitions (e.g. attempting to jump from `SUBMITTED` directly to `TIER_3_TWEETED` without passing tier thresholds) are rejected by validation guards in `TicketService`.

### 1.2 Strategy Pattern for Notification Dispatch
Outbound dispatchers implement a common contract or decoupled services:
- `EmailDispatchService`: dispatches formal HTML/plain text grievance dossiers to ward officers and zonal commissioners.
- `TwitterService`: dispatches public accountability alerts tagging municipal handles.
- Each dispatcher includes a **fallback mock/log mode**: if SMTP or Twitter API keys are not provided in `application.properties`, they log rich formatted notices to console and audit tables without throwing errors.

### 1.3 Immutable Records as DTOs (Java 17)
All data transfer objects are modeled using Java 17 `record` types:
- Thread-safe, concise, and memory-efficient.
- Zero boilerplate (compiler-generated equals, hashCode, toString, and accessors).

---

## 2. Real-Time Locality & Jurisdiction Resolution

When coordinates are received from the mobile client:
```java
JurisdictionInfo info = jurisdictionService.resolve(latitude, longitude);
```

The system evaluates the coordinate bounds against municipal polygons:
- **GHMC / Badangpet Municipality (Hyderabad Area):**
  - **Zone:** LB Nagar Zone / Charminar Zone / Serilingampally Zone
  - **Circles:** Badangpet Circle, LB Nagar Circle, Malkajgiri, Kukatpally
  - **Official Contacts:**
    - Ward Officer: `ward.officer.<circle>@ghmc.gov.in`
    - Zonal Commissioner: `zonalcomm.<zone>@ghmc.gov.in`
    - Twitter Tags: `@GHMCOnline`, `@TelanganaMAUD`
- **Fallback / Universal Locality Resolver:**
  - For coordinates outside predefined polygons, resolves to general metropolitan grievance division (e.g. "Metropolitan Civic Operations - Sector 4"), assigning synthetic official contacts for demonstration reliability.

---

## 3. REST API Contracts & Schema Reference

### 3.1 Ticket Ingestion
- **Endpoint:** `POST /api/v1/tickets`
- **Content-Type:** `multipart/form-data`
- **Form Parameters:**
  - `image` *(File, Required)*: JPEG/PNG image of hazard.
  - `latitude` *(Double, Required)*: e.g. `17.3193`
  - `longitude` *(Double, Required)*: e.g. `78.5298`
  - `description` *(String, Optional)*: User note.
  - `citizenContact` *(String, Optional)*: Email or phone for updates.
- **Success Response:** `201 Created`
```json
{
  "id": 1,
  "title": "Severe POTHOLE at Badangpet Circle / GHMC",
  "hazardType": "POTHOLE",
  "status": "SUBMITTED",
  "municipality": "Badangpet Circle / GHMC",
  "ward": "Ward 14",
  "zone": "LB Nagar Zone",
  "severityScore": 8,
  "imageUrl": "/uploads/hazard_1726556400000.jpg",
  "latitude": 17.3193,
  "longitude": 78.5298,
  "createdAt": "2026-09-17T12:00:00"
}
```

---

### 3.2 Timeline & Audit Trail
- **Endpoint:** `GET /api/v1/tickets/{id}/timeline`
- **Success Response:** `200 OK`
```json
{
  "ticketId": 1,
  "title": "Severe POTHOLE at Badangpet Circle / GHMC",
  "currentStatus": "TIER_1_ESCALATED",
  "municipality": "Badangpet Circle / GHMC",
  "timeline": [
    {
      "id": 1,
      "fromStatus": null,
      "toStatus": "SUBMITTED",
      "action": "TICKET_CREATED",
      "actor": "CITIZEN_MOBILE",
      "details": "Hazard ingested via mobile client. AI Vision verified POTHOLE with severity 8/10.",
      "timestamp": "2026-09-14T12:00:00"
    },
    {
      "id": 2,
      "fromStatus": "SUBMITTED",
      "toStatus": "TIER_1_ESCALATED",
      "action": "WARD_OFFICER_NOTIFIED",
      "actor": "AUTONOMOUS_SLA_AGENT",
      "details": "SLA Tier 1 breached (>3 days). Autonomous grievance email dispatched to ward14.badangpet@ghmc.gov.in.",
      "timestamp": "2026-09-17T12:00:00"
    }
  ]
}
```

---

### 3.3 Simulation Fast-Forward (Time-Travel Warp)
- **Endpoint:** `POST /api/v1/simulation/tickets/{id}/advance`
- **Request Body (or query parameter `?days=3`):**
```json
{
  "days": 3
}
```
- **Success Response:** `200 OK`
```json
{
  "ticketId": 1,
  "previousStatus": "SUBMITTED",
  "newStatus": "TIER_1_ESCALATED",
  "daysShifted": 3,
  "message": "Fast-forwarded ticket #1 by 3 days. Triggered TIER_1_ESCALATED.",
  "simulatedCreatedAt": "2026-09-14T12:00:00",
  "newActions": [
    {
      "id": 2,
      "fromStatus": "SUBMITTED",
      "toStatus": "TIER_1_ESCALATED",
      "action": "WARD_OFFICER_NOTIFIED",
      "actor": "SIMULATION_WARP_AGENT",
      "details": "Simulation fast-forward: 3 days shifted. Escalation notice dispatched.",
      "timestamp": "2026-09-17T12:00:00"
    }
  ]
}
```

---

### 3.4 Ticket Details & List
- **Endpoint:** `GET /api/v1/tickets/{id}` &rarr; `200 OK` (full ticket record)
- **Endpoint:** `GET /api/v1/tickets` &rarr; `200 OK` (list of all tickets, ordered newest first)
- **Endpoint:** `PATCH /api/v1/tickets/{id}/resolve` &rarr; `200 OK` (marks ticket `RESOLVED`, logs closing audit record)

---

## 4. Frontend Integration Contract for Expo React Native

To make frontend development effortless for your teammate, here are the exact TypeScript models and API request snippets:

### TypeScript Interfaces (`types/api.ts`):
```typescript
export type TicketStatus = 
  | 'SUBMITTED' 
  | 'TIER_1_ESCALATED' 
  | 'TIER_2_ESCALATED' 
  | 'TIER_3_TWEETED' 
  | 'RESOLVED' 
  | 'REJECTED';

export interface Ticket {
  id: number;
  title: string;
  hazardType: string;
  status: TicketStatus;
  municipality: string;
  ward: string;
  zone: string;
  severityScore: number;
  imageUrl: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface AuditLogItem {
  id: number;
  fromStatus: TicketStatus | null;
  toStatus: TicketStatus;
  action: string;
  actor: string;
  details: string;
  timestamp: string;
}

export interface TimelineResponse {
  ticketId: number;
  title: string;
  currentStatus: TicketStatus;
  municipality: string;
  timeline: AuditLogItem[];
}

export interface AdvanceResponse {
  ticketId: number;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
  daysShifted: number;
  message: string;
  simulatedCreatedAt: string;
  newActions: AuditLogItem[];
}
```

### Expo React Native `fetch` Ingest Example:
```typescript
const uploadGrievance = async (imageUri: string, lat: number, lng: number) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    name: 'grievance.jpg',
    type: 'image/jpeg',
  } as any);
  formData.append('latitude', lat.toString());
  formData.append('longitude', lng.toString());
  formData.append('description', 'Reported via CivicAdvocate App');

  const res = await fetch('http://<YOUR_LAN_IP>:8080/api/v1/tickets', {
    method: 'POST',
    body: formData,
    // Note: Do NOT set Content-Type header manually when sending FormData in React Native
  });
  return await res.json();
};
```

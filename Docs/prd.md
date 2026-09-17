# Product Requirements Document (PRD)

## Project: CivicAdvocate — Autonomous Civic Grievance & Escalation Agent
**Event:** Avinya 2026 Hackathon  
**Target Domain:** Smart Cities, GovTech, Autonomous AI Agents, Civic Infrastructure  
**Version:** 1.0.0  
**Author:** Principal Software Engineer & CivicAdvocate Core Team  
**Status:** Approved for Implementation  

---

## 1. Executive Summary & Problem Statement

### 1.1 The Civic Challenge: "Citizen Fatigue"
In rapidly growing urban metropolises (e.g., GHMC Hyderabad, BBMP Bengaluru, BMC Mumbai), civic hazards such as deep potholes, overflowing waste bins, uncovered manholes, and defunct streetlights pose critical public safety hazards.

While municipalities offer portals and grievance hotlines (e.g., Prajavani, GHMC App, CPGRAMS), citizens face **Citizen Fatigue**:
- **High Friction Intake:** Complex categorization drop-downs, ward-number lookups, and lengthy complaint forms.
- **Bureaucratic Black Hole:** Complaints are marked "Pending" or closed arbitrarily without resolution.
- **Burden of Follow-Up:** Citizens must constantly re-check portals, call local ward offices, or visit administrative circles to demand action.
- **No Accountability Escalation:** Hierarchy (Ward Officer → Zonal Commissioner → Municipal Commissioner → Public Ministry) remains uncontacted unless an influential figure intervenes.

### 1.2 The Solution: CivicAdvocate
**CivicAdvocate** is an **autonomous digital proxy** that acts on the citizen's behalf.
A citizen takes **one photo** and clicks **Submit**. The citizen’s job is done.

CivicAdvocate takes over completely:
1. **Verifies** the hazard with AI Vision to score severity and filter out bogus submissions.
2. **Reverse-geocodes** coordinates to pinpoint the responsible local Ward Officer, Municipal Circle, and Zonal Commissioner in real time.
3. **Autonomously enforces SLAs**: If the local municipality ignores the complaint, the agent autonomously escalates up the bureaucratic ladder ($T+3$ days to Ward Officer, $T+7$ days to Zonal Commissioner) and ultimately triggers public accountability alerts via Twitter/X API v2 at $T+14$ days tagging official handles (`@GHMCOnline`, `@TelanganaMAUD`).
4. **Maintains an immutable audit trail** of every transition, email dispatched, and tweet published.

---

## 2. Target Personas

| Persona | Role | Core Need / Pain Point | CivicAdvocate Value |
|---|---|---|---|
| **Priya (Commuter / Citizen)** | Daily two-wheeler commuter | Spots dangerous open manhole on dark road; doesn't know ward number or who to call. | 5-second intake (photo + GPS). Zero follow-up needed. Receives autonomous notifications on progress. |
| **K. Rao (Ward Officer / AE)** | Field Executive Engineer (Circle 3) | Overwhelmed by unstructured complaints; lacks exact geo-coordinates. | Receives structured, pre-verified grievance dossiers with exact GPS coordinates and high-res photos. |
| **Dr. V. Sharma (Zonal Commissioner)** | Administrative Oversight | Unaware of grassroots delays until issues blow up into public scandals. | Receives high-priority escalation notices citing specific days overdue and SLA breaches in their zone. |
| **Avinya Hackathon Judges** | Technical Evaluators | Need to see a 14-day autonomous escalation cycle within a 3-minute pitch. | Interactive Time-Travel Warp Engine to trigger live escalations on stage in seconds. |

---

## 3. Autonomous State Machine & Escalation SLA Matrix

The core lifecycle of a civic grievance ticket is governed by a strict state machine:

```
                  ┌─────────────────┐
                  │   [Citizen]     │
                  │ Photo + GPS at  │
                  │      T = 0      │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │    SUBMITTED    │ ◄── Intake & AI Vision Verified
                  └────────┬────────┘
                           │
                           │ If unresolved after 3 days (T + 3d)
                           ▼
              ┌─────────────────────────┐
              │    TIER_1_ESCALATED     │ ◄── Grievance Email dispatched
              └────────────┬────────────┘     to Local Ward Officer
                           │
                           │ If unresolved after 7 days (T + 7d)
                           ▼
              ┌─────────────────────────┐
              │    TIER_2_ESCALATED     │ ◄── Escalation Notice dispatched
              └────────────┬────────────┘     to Zonal Commissioner
                           │
                           │ If unresolved after 14 days (T + 14d)
                           ▼
              ┌─────────────────────────┐
              │     TIER_3_TWEETED      │ ◄── Public Accountability Alert
              └────────────┬────────────┘     tweeted via Twitter/X API v2
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
      ┌───────────────┐         ┌───────────────┐
      │   RESOLVED    │         │   REJECTED    │
      └───────────────┘         └───────────────┘
```

### Detailed SLA Rules:

| State | Trigger Condition | Autonomous Action Taken | Target Recipient / Channel |
|---|---|---|---|
| `SUBMITTED` | Photo & GPS received at $T=0$. AI Vision verification passes (>60% confidence). | Ticket created; municipality & ward mapped; immutable intake `AuditLog` generated. | Citizen App Confirmation |
| `TIER_1_ESCALATED` | Status is `SUBMITTED` and $\text{Age} \ge 3\text{ days}$. | Dispatches formal Grievance Dossier with photo, Google Maps link, and 72-hour rectification demand. | Local Ward Officer (`ward.officer@ghmc.gov.in`) |
| `TIER_2_ESCALATED` | Status is `TIER_1_ESCALATED` and $\text{Age} \ge 7\text{ days}$. | Dispatches Formal Escalation Notice citing 7-day administrative delay and non-compliance with Citizen Charter. | Zonal Commissioner (`zonal.comm@ghmc.gov.in`) |
| `TIER_3_TWEETED` | Status is `TIER_2_ESCALATED` and $\text{Age} \ge 14\text{ days}$. | Autonomous public tweet citing ticket ID, hazard type, exact GPS location, days overdue, and tagging official handles. | Public Twitter/X: `@GHMCOnline`, `@TelanganaMAUD` |
| `RESOLVED` | Field inspection or citizen verifies fix. | Resolution timestamp logged; audit closure record created. | Citizen & Authority Notification |
| `REJECTED` | AI Vision detects non-hazard (e.g. selfie, blurred, non-civic). | Rejection reason logged with feedback. | Citizen Notification |

---

## 4. Functional Requirements

### 4.1 Hazard Intake & Multi-Modal Ingestion
- **FR-1.1:** System shall accept `multipart/form-data` with `image` (binary file), `latitude` (double), and `longitude` (double).
- **FR-1.2:** System shall support optional metadata: `description` (string), `citizenContact` (email/phone).
- **FR-1.3:** System shall pass the image to the `VisionVerificationService` to detect hazard category (e.g., POTHOLE, OPEN_MANHOLE, GARBAGE_OVERFLOW, WATERLOGGING, STREETLIGHT_DEFECT) and assign a severity score ($1 - 10$).
- **FR-1.4:** System shall automatically map GPS coordinates to the administrative jurisdiction: Municipality Name, Zone/Circle, Ward Number, and responsible officer directory.

### 4.2 Autonomous Escalation Engine
- **FR-2.1:** Background SLA monitor shall run on a periodic schedule (configurable cron) and query tickets breaching SLA thresholds.
- **FR-2.2:** Escalation transitions must be **idempotent**: running the scheduler multiple times will never trigger duplicate emails or duplicate tweets for the same tier.
- **FR-2.3:** Every state transition must record an immutable `AuditLog` entry detailing: `ticketId`, `fromStatus`, `toStatus`, `action`, `actor` ("SYSTEM_AGENT" or user), `details`, and ISO-8601 `timestamp`.

### 4.3 Outbound Dispatch Adapters
- **FR-3.1:** `EmailDispatchService` shall construct formatted email notices with hazard details, high-res photo references, and direct Google Maps coordinates links.
- **FR-3.2:** `TwitterService` shall construct formatted 280-character public accountability tweets with geo coordinates, days overdue, and official municipal tags (`@GHMCOnline`, `@TelanganaMAUD`).
- **FR-3.3:** Both dispatchers shall support fallback structured logging mode so the application runs seamlessly in hackathon demonstration environments without requiring active SMTP servers or paid Twitter API keys.

### 4.4 Hackathon Demo Engine (Time-Travel Warp)
- **FR-4.1:** The backend shall expose `POST /api/v1/simulation/tickets/{id}/advance` accepting `{"days": X}` or `?days=X`.
- **FR-4.2:** This endpoint shall shift the ticket's `createdAt` timestamp backwards by $X$ days and immediately trigger the evaluation logic.
- **FR-4.3:** The response must return the previous state, new state, days shifted, and the new audit log items generated during the warp.

### 4.5 Timeline & Auditing API
- **FR-5.1:** `GET /api/v1/tickets/{id}/timeline` shall return an ordered chronologically ascending list of all audit events.
- **FR-5.2:** `GET /api/v1/tickets/{id}` shall return full ticket metadata, current status, severity, and jurisdiction.
- **FR-5.3:** `GET /api/v1/tickets` shall return a list of all active grievances with pagination or descending recency for dashboard display.

---

## 5. Non-Functional Requirements

| Metric | Requirement | Justification |
|---|---|---|
| **Response Latency** | Intake endpoint $P95 < 800\text{ ms}$ | Mobile users on 4G/5G connections require instantaneous feedback after snapping photos. |
| **Availability & Execution** | Zero-dependency local startup | Hackathon judges and developers must be able to boot the entire stack in under 30 seconds using `./mvnw spring-boot:run`. |
| **Portability** | H2 in-memory default with 1-flag PostgreSQL switch | Seamless local testing + enterprise production readiness. |
| **Concurrency & Idempotency** | Transactional boundaries (`@Transactional`) | Prevents race conditions where parallel scheduled tasks double-escalate a ticket. |
| **Security & CORS** | Permissive CORS configuration | Expo React Native on physical devices, iOS Simulator, and Android Emulator must connect without CORS headers issues. |

---

## 6. Avinya 2026 Hackathon Demo Script (3-Minute Walkthrough)

1. **Minute 0:00 - 0:45 (The Problem & The Snap):**
   - Presenter shows mobile app. Citizen spots a deep pothole in Badangpet.
   - Snaps photo, submits. System verifies via AI Vision, returns `SUBMITTED`, assigns Severity 8/10, maps to Badangpet Circle 3 / Ward 14.
2. **Minute 0:45 - 1:30 (Tier 1 Escalation Demo):**
   - Presenter triggers Time Warp: Advance 3 days.
   - Screen updates: Status is now `TIER_1_ESCALATED`. Live log displays: Official grievance email dispatched to `ward14.badangpet@ghmc.gov.in`.
3. **Minute 1:30 - 2:15 (Tier 2 Escalation Demo):**
   - Presenter triggers Time Warp: Advance 4 more days (Day 7).
   - Screen updates: Status is now `TIER_2_ESCALATED`. Notice dispatched to Zonal Commissioner citing past 7 days of administrative silence.
4. **Minute 2:15 - 3:00 (Tier 3 Public Twitter Alert & Conclusion):**
   - Presenter triggers Time Warp: Advance 7 more days (Day 14).
   - Status transitions to `TIER_3_TWEETED`. Public tweet alert generated tagging `@GHMCOnline`.
   - Presenter opens Audit Timeline showing complete, tamper-proof history. Judges see a truly autonomous civic advocate.

# Project Implementation Roadmap & Phases

## Project: CivicAdvocate — Autonomous Civic Grievance & Escalation Agent
**Event:** Avinya 2026 Hackathon  
**Target:** Engineering Execution & Cross-Team Handover  
**Document:** Project Phases & Roadmap  

---

## 1. Roadmap Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PHASED EXECUTION ROADMAP                        │
│                                                                        │
│  [PHASE 1] Backend Core & Domain Architecture          (Completed)     │
│    ├── Java 17 records & Spring Boot 3.3.4 parent                      │
│    ├── JPA Entities (Ticket, AuditLog, TicketStatus)                   │
│    └── Repositories with custom indexing & SLA queries                 │
│                                                                        │
│  [PHASE 2] Autonomous Agent Workflows & Services       (In Progress)   │
│    ├── Multi-modal AI Vision Triage Service                            │
│    ├── Real-time Locality & Jurisdiction Resolver                      │
│    ├── Outbound Email & Twitter Notification Adapters                  │
│    ├── Idempotent SLA Escalation Scheduler (@Scheduled)               │
│    └── Time-Travel Warp Simulation Service                             │
│                                                                        │
│  [PHASE 3] API Verification, Testing & QA                              │
│    ├── Spring Boot Context & Unit Tests                                │
│    ├── Live cURL validation of Multipart Ingestion                     │
│    └── SLA & Time-Warp Escalation Cascade Tests                        │
│                                                                        │
│  [PHASE 4] Frontend Expo React Native Handover (For Teammate)          │
│    ├── Screen 1: Camera & Geolocation Snap Intake                      │
│    ├── Screen 2: Grievance Dashboard & Feed                            │
│    ├── Screen 3: Live Audit Timeline & Escalation Tracker              │
│    └── Screen 4: Hackathon Demo Time-Warp Controller                   │
│                                                                        │
│  [PHASE 5] Stage Demo Pitch & Hackathon Rehearsal                      │
│    ├── 3-Minute Live Pitch Playbook                                    │
│    ├── Fail-safe local backup profiles                                 │
│    └── Judge Q&A Defense Matrix                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Phase Details & Deliverables

### Phase 1: Backend Core & Domain Architecture
- **Objective:** Establish the foundation with Java 17 and Spring Boot 3.3.4.
- **Key Deliverables:**
  - `pom.xml`: Spring Web, Spring Data JPA, Spring Validation, Spring Mail, H2, PostgreSQL.
  - `application.properties`: Multipart upload limits (20MB), in-memory H2 configuration, scheduling settings.
  - `Ticket.java`, `AuditLog.java`, `TicketStatus.java`: domain entities with table indexes on `(status, created_at)`.
  - `TicketDtos.java`: Java 17 immutable record definitions for all API request/response contracts.
  - `TicketRepository.java`, `AuditLogRepository.java`: query methods for SLA scanning.

### Phase 2: Autonomous Agent Workflows & Services
- **Objective:** Implement the three collaborative agents and outbound adapters.
- **Key Deliverables:**
  - `VisionVerificationService.java`: Evaluates image, determines hazard classification, calculates severity score (1-10), and validates authenticity.
  - `JurisdictionService.java`: Resolves GPS coordinates to municipality, ward, ward officer email, zonal commissioner, and official Twitter handles.
  - `EmailDispatchService.java`: Formats official notices using Java 17 text blocks; delivers via `JavaMailSender` or structured console log.
  - `TwitterService.java`: Formats public accountability tweets tagging `@GHMCOnline`, `@TelanganaMAUD`.
  - `TicketService.java`: Orchestrates the grievance lifecycle, state transitions, and audit records.
  - `EscalationScheduler.java`: `@Scheduled` cron daemon checking SLA boundaries ($T+3\text{d}, T+7\text{d}, T+14\text{d}$).
  - `SimulationService.java` & `SimulationController.java`: Fast-forwards ticket age to trigger live escalations on demand.

### Phase 3: API Verification & Testing
- **Objective:** Verify compilation, test coverage, and end-to-end simulation behavior.
- **Key Deliverables:**
  - Integration tests verifying ticket creation and audit log generation.
  - Time-travel warp tests demonstrating automated cascade from `SUBMITTED` &rarr; `TIER_1_ESCALATED` &rarr; `TIER_2_ESCALATED` &rarr; `TIER_3_TWEETED`.
  - Verification that scheduler queries are idempotent and prevent double-escalation.

---

## 3. Phase 4: Frontend Expo React Native Plan (Handover Guide for Teammate)

Your teammate building `frontend/my-app` should follow this 4-step UI development guide:

### Screen 1: Camera & Geolocation Capture (`app/(tabs)/index.tsx` or `report.tsx`)
- **UI Components:**
  - Full-screen camera viewfinder using `expo-camera` or `expo-image-picker`.
  - Floating GPS badge showing current coordinates using `expo-location`.
  - Optional description text input.
  - Primary CTA button: **"Submit Civic Grievance"**.
- **Network Call:**
  - Sends `POST /api/v1/tickets` as `FormData`.
  - On `201 Created`, navigates to the Ticket Timeline screen with the newly created ticket ID.

### Screen 2: Grievance Dashboard (`app/(tabs)/explore.tsx` or `tickets.tsx`)
- **UI Components:**
  - Pull-to-refresh list of all reported civic hazards.
  - Status badges with distinct colors:
    - `SUBMITTED`: Blue
    - `TIER_1_ESCALATED`: Amber
    - `TIER_2_ESCALATED`: Orange
    - `TIER_3_TWEETED`: Red (High Alert)
    - `RESOLVED`: Green
  - Severity meter indicator ($1 - 10$).
  - Tap card &rarr; Opens detailed timeline.

### Screen 3: Live Audit Timeline (`app/ticket/[id].tsx`)
- **UI Components:**
  - Hero image of the hazard with municipality header (e.g. "Badangpet Circle / GHMC - Ward 14").
  - Vertical timeline (stepper) rendering each `AuditLogItem`:
    - Checkmark icon for completed steps.
    - Timestamp formatted as readable local time.
    - Actor badge ("SYSTEM_AGENT", "WARD_OFFICER", "SIMULATION_WARP").
    - Action description (e.g., "Grievance Dossier dispatched to Ward Officer").
  - Live "Resolve" button for field officers.

### Screen 4: Hackathon Demo Time-Warp Controller (`app/demo.tsx` or Modal)
- **UI Components:**
  - Fast-forward control panel for the 3-minute hackathon pitch:
    - Button: **"+3 Days (Trigger Ward Officer Tier 1)"** &rarr; `POST /advance {"days": 3}`
    - Button: **"+4 Days (Trigger Zonal Comm. Tier 2)"** &rarr; `POST /advance {"days": 4}`
    - Button: **"+7 Days (Trigger Public Tweet Tier 3)"** &rarr; `POST /advance {"days": 7}`
  - Shows real-time toaster/banner when the escalation fires live on screen.

---

## 4. Phase 5: Hackathon Pitch & Stage Rehearsal Playbook

### Stage Pitch Narrative (3 Minutes):
1. **The Hook (0:00 - 0:30):**
   > "Every year, millions of civic hazards in India go unaddressed because citizens suffer from *Citizen Fatigue*. You report a pothole on a portal, nothing happens, you follow up three times, and eventually give up. Today, we present **CivicAdvocate** — the autonomous AI proxy that never gives up."
2. **The Live Ingestion (0:30 - 1:15):**
   > "Our team snaps a live photo of a hazard right now. The AI Vision agent analyzes the photo, verifies it's an authentic severe pothole, assigns an 8/10 severity, and instantly resolves the exact municipality and ward contacts based on live GPS."
3. **The Autonomous Escalation (1:15 - 2:30):**
   > "Now, watch what happens when the municipality delays. Using our demo engine, let's fast forward 3 days. Boom — the autonomous agent immediately drafts and emails an official grievance notice to the local Ward Officer. Still no action after 7 days? Fast forward — the agent escalates to the Zonal Commissioner citing past delays. Day 14? The agent holds them publicly accountable, posting an alert to Twitter tagging municipal leadership."
4. **The Close (2:30 - 3:00):**
   > "CivicAdvocate turns passive complaint boxes into proactive accountability engines. Built on Spring Boot 3, Java 17, and Expo. Thank you!"

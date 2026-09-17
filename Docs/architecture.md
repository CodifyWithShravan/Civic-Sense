# System Architecture Specification

## Project: CivicAdvocate — Autonomous Civic Grievance & Escalation Agent
**Document:** System Architecture  
**Version:** 1.0.0  
**Stack:** Spring Boot 3.3.x, Java 17 LTS, Spring Data JPA, PostgreSQL / H2, Expo React Native  

---

## 1. High-Level Architecture Overview

CivicAdvocate is designed as a modular, event-aware, resilient backend with an autonomous background escalation worker and a time-travel simulation engine.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION TIER                             │
│                                                                        │
│       Expo React Native (iOS / Android / Web)                          │
│       • Live Camera Capture + High-Precision GPS                       │
│       • Grievance Status Tracker & Live Audit Timeline                 │
│       • Hackathon Demo Time-Warp Controller                            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON / multipart
                                    │ (CORS Enabled for Expo)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        SPRING BOOT 3 BACKEND                           │
│                                                                        │
│  ┌──────────────────────┐               ┌───────────────────────────┐  │
│  │   TicketController   │               │   SimulationController    │  │
│  └──────────┬───────────┘               └─────────────┬─────────────┘  │
│             │                                         │                │
│             ▼                                         ▼                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     ORCHESTRATION & AGENTS                       │  │
│  │                                                                  │  │
│  │  ┌─────────────────────┐  ┌──────────────────┐  ┌─────────────┐  │  │
│  │  │ VisionTriageService │  │JurisdictionRouter│  │TicketService│  │  │
│  │  └─────────────────────┘  └──────────────────┘  └──────┬──────┘  │  │
│  │                                                        │         │  │
│  │  ┌─────────────────────────────────────────────────────┴──────┐  │  │
│  │  │            EscalationScheduler (Background Daemon)         │  │  │
│  │  └─────────────────────────────┬──────────────────────────────┘  │  │
│  └────────────────────────────────┼─────────────────────────────────┘  │
│                                   │                                    │
│         ┌─────────────────────────┴────────────────────────┐           │
│         ▼                                                  ▼           │
│  ┌──────────────┐                                   ┌──────────────┐   │
│  │ EmailService │                                   │TwitterService│   │
│  └──────┬───────┘                                   └──────┬───────┘   │
└─────────┼──────────────────────────────────────────────────┼───────────┘
          │ SMTP                                             │ Twitter API
          ▼                                                  ▼
   [Municipal Inboxes]                                [Public Twitter/X]
(Ward / Zonal Commissioners)                        (@GHMCOnline / @MAUD)
          │
          ▼
┌────────────────────────────────────────────────────────────────────────┐
│                           PERSISTENCE LAYER                            │
│                                                                        │
│          PostgreSQL 15+ (Production)  /  H2 In-Memory (Dev/Demo)       │
│          • `tickets` Table (Indexed by status, created_at)             │
│          • `audit_logs` Table (Append-only immutable audit trail)       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Multi-Agent Division of Labor

The system is structured as three collaborative software agents working autonomously:

```
+-------------------------------------------------------------------------------+
|                             CIVIC ADVOCATE SYSTEM                             |
|                                                                               |
|  +-------------------------+     +-----------------------+                    |
|  |  Agent 1: Vision Triage |     | Agent 2: Jurisdiction |                    |
|  |  • Hazard classification|     |  • Reverse geocoding  |                    |
|  |  • Quality scoring      |     |  • Ward boundary check|                    |
|  |  • Severity estimation  |     |  • Official directory |                    |
|  +------------+------------+     +-----------+-----------+                    |
|               |                              |                                |
|               +--------------+---------------+                                |
|                              |                                                |
|                              v                                                |
|               +------------------------------+                                |
|               | Ticket Record & Audit Ledger |                                |
|               +--------------+---------------+                                |
|                              |                                                |
|                              v                                                |
|               +------------------------------+                                |
|               | Agent 3: Autonomous SLA      |                                |
|               | Escalation Daemon            |                                |
|               |  • Continuous time monitoring|                                |
|               |  • Tier 1 (3d): Ward Officer |                                |
|               |  • Tier 2 (7d): Zonal Comm.  |                                |
|               |  • Tier 3 (14d): Twitter/X   |                                |
|               +------------------------------+                                |
+-------------------------------------------------------------------------------+
```

---

## 3. Detailed Sequence Diagrams

### 3.1 Intake & Verification Sequence (T = 0)

```mermaid
sequenceDiagram
    autonumber
    actor Citizen as Citizen (Mobile App)
    participant TC as TicketController
    participant TS as TicketService
    participant VS as VisionVerificationService
    participant JS as JurisdictionService
    participant DB as JPA Repository (H2/PostgreSQL)
    participant AL as AuditLogRepository

    Citizen->>TC: POST /api/v1/tickets (image, lat, lng)
    TC->>TS: ingestGrievance(image, lat, lng, meta)
    TS->>VS: analyzeHazard(image)
    VS-->>TS: HazardAnalysis(type="POTHOLE", score=8, verified=true)
    TS->>JS: resolveJurisdiction(lat, lng)
    JS-->>TS: JurisdictionInfo("Badangpet Circle", Ward 14, emails, handles)
    TS->>DB: save(Ticket[status=SUBMITTED, severity=8, ...])
    DB-->>TS: persistedTicket (ID: 101)
    TS->>AL: save(AuditLog[ticketId=101, action="INTAKE_VERIFIED", actor="SYSTEM_AGENT"])
    TS-->>TC: IngestResponse(101, "POTHOLE", SUBMITTED, ...)
    TC-->>Citizen: 201 Created (Ticket Details)
```

---

### 3.2 Autonomous SLA Escalation Sequence (Background Scheduled Worker)

```mermaid
sequenceDiagram
    autonumber
    participant Cron as EscalationScheduler (@Scheduled)
    participant TS as TicketService
    participant Repo as TicketRepository
    participant Email as EmailDispatchService
    participant Twitter as TwitterService
    participant AL as AuditLogRepository

    Cron->>TS: runSlaEscalationEvaluation()
    Note over TS,Repo: Tier 1 Check: Tickets in SUBMITTED older than 3 Days
    TS->>Repo: findByStatusAndCreatedAtBefore(SUBMITTED, now - 3d)
    Repo-->>TS: List [Ticket #101]
    TS->>Email: dispatchWardOfficerNotice(Ticket #101)
    Email-->>TS: Dispatched (or logged)
    TS->>Repo: save(Ticket #101[status=TIER_1_ESCALATED])
    TS->>AL: save(AuditLog[#101, SUBMITTED -> TIER_1_ESCALATED, "WARD_EMAIL_DISPATCHED"])

    Note over TS,Repo: Tier 2 Check: Tickets in TIER_1 older than 7 Days
    TS->>Repo: findByStatusAndCreatedAtBefore(TIER_1_ESCALATED, now - 7d)
    Repo-->>TS: List [Ticket #94]
    TS->>Email: dispatchZonalCommissionerEscalation(Ticket #94)
    TS->>Repo: save(Ticket #94[status=TIER_2_ESCALATED])
    TS->>AL: save(AuditLog[#94, TIER_1 -> TIER_2, "ZONAL_COMMISSIONER_ESCALATED"])

    Note over TS,Repo: Tier 3 Check: Tickets in TIER_2 older than 14 Days
    TS->>Repo: findByStatusAndCreatedAtBefore(TIER_2_ESCALATED, now - 14d)
    Repo-->>TS: List [Ticket #80]
    TS->>Twitter: publishPublicAccountabilityTweet(Ticket #80)
    TS->>Repo: save(Ticket #80[status=TIER_3_TWEETED])
    TS->>AL: save(AuditLog[#80, TIER_2 -> TIER_3, "TWITTER_ALERT_PUBLISHED"])
```

---

### 3.3 Hackathon Demo Time-Travel Warp Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Judge as Presenter / Judge
    participant SC as SimulationController
    participant SS as SimulationService
    participant TS as TicketService
    participant DB as TicketRepository
    participant AL as AuditLogRepository

    Judge->>SC: POST /api/v1/simulation/tickets/101/advance {"days": 3}
    SC->>SS: advanceTicketTime(ticketId=101, days=3)
    SS->>DB: findById(101)
    DB-->>SS: Ticket #101 (createdAt = T, status = SUBMITTED)
    SS->>SS: ticket.setCreatedAt(createdAt - 3 days)
    SS->>DB: save(ticket)
    SS->>TS: evaluateAndEscalateTicket(ticket)
    Note over TS: Trigger immediate Tier 1 Escalation logic
    TS->>DB: update status to TIER_1_ESCALATED
    TS->>AL: append AuditLog entry
    SS->>AL: findByTicketIdOrderByTimestampAsc(101)
    AL-->>SS: updated audit records
    SS-->>SC: AdvanceResponse(status=TIER_1_ESCALATED, daysShifted=3, newActions)
    SC-->>Judge: 200 OK
```

---

## 4. Database Schema & ER Diagram

```mermaid
erDiagram
    TICKETS ||--o{ AUDIT_LOGS : "has audit trail"

    TICKETS {
        bigint id PK "Identity Autoincrement"
        varchar title "Hazard Title"
        text description "Citizen or AI Description"
        varchar hazard_type "POTHOLE, MANHOLE, GARBAGE, etc."
        double_precision latitude "GPS Latitude"
        double_precision longitude "GPS Longitude"
        varchar image_url "Storage Path or Cloud URI"
        varchar municipality "e.g. Badangpet Circle / GHMC"
        varchar ward "e.g. Ward 14"
        varchar zone "e.g. LB Nagar Zone"
        varchar ward_officer_email "Official Contact"
        varchar zonal_commissioner_email "Zonal Contact"
        varchar official_twitter_handles "e.g. @GHMCOnline, @TelanganaMAUD"
        integer severity_score "Calculated 1 to 10"
        varchar status "SUBMITTED, TIER_1_ESCALATED, etc."
        varchar citizen_contact "Citizen Email or Phone"
        timestamp created_at "Indexed creation timestamp"
        timestamp updated_at "Last update timestamp"
        timestamp resolved_at "Resolution timestamp (nullable)"
    }

    AUDIT_LOGS {
        bigint id PK "Identity Autoincrement"
        bigint ticket_id FK "References TICKETS(id)"
        varchar from_status "Previous Lifecycle State"
        varchar to_status "New Lifecycle State"
        varchar action "Action Type (INTAKE, EMAIL, TWEET)"
        varchar actor "SYSTEM_AGENT or USER"
        text details "Structured transition description"
        timestamp timestamp "Immutable action timestamp"
    }
```

### Critical Performance Indexes:
1. `idx_tickets_status_created_at` on `tickets (status, created_at)`: Guarantees $O(\log N)$ retrieval for SLA cron queries scanning overdue tickets.
2. `idx_audit_logs_ticket_id_timestamp` on `audit_logs (ticket_id, timestamp ASC)`: Guarantees instantaneous retrieval of ordered timeline logs for mobile client rendering.

---

## 5. Security, Networking & Cross-Cutting Architecture

### 5.1 Cross-Origin Resource Sharing (CORS)
- **Problem:** Expo React Native apps on physical devices or web preview send cross-origin requests from diverse origins (`exp://*`, `http://192.168.*.*:8081`, `http://localhost:8081`).
- **Solution:** `CorsConfig` declares a comprehensive Spring `CorsFilter` matching `/**` with `allowedOriginPatterns("*")`, allowing all standard HTTP methods (`GET, POST, PUT, PATCH, DELETE, OPTIONS`) and all request headers.

### 5.2 Multipart Ingestion & Storage
- Spring `StandardServletMultipartResolver` configured with max request size of 25MB and max file size of 20MB.
- Uploaded files are verified for MIME integrity (`image/jpeg`, `image/png`, `image/webp`).
- In demo/dev mode, files are written to local application storage (`/uploads`) and served statically.

### 5.3 Idempotency & Fault Tolerance
- Schedulers operate within transactional boundaries.
- External dispatch calls (SMTP / Twitter) are wrapped in try-catch blocks with graceful fallbacks: an SMTP network failure will log a diagnostic warning and register the audit attempt without crashing the scheduler loop or leaving tickets in an inconsistent state.

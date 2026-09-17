# 🏛️ CivicAdvocate — Autonomous Civic Grievance & Escalation Agent

[![Built for Avinya 2026 Hackathon](https://img.shields.io/badge/Hackathon-Avinya%202026-0f766e.svg)](#)
[![Backend](https://img.shields.io/badge/Spring%20Boot-3.3.4%20(Java%2017)-green.svg)](backend/civic-backend/)
[![Frontend Handover](https://img.shields.io/badge/Frontend-Expo%20Clean%20Slate-blue.svg)](frontend/FRONTEND_HANDOVER.md)
[![OpenAPI / Swagger](https://img.shields.io/badge/Swagger-Interactive%20Docs-85EA2D.svg)](#interactive-swagger-ui--openapi-30)
[![Database](https://img.shields.io/badge/Database-H2%20%2F%20PostgreSQL%2015-orange.svg)](#docker--postgresql-15-production-profile)
[![Tests](https://img.shields.io/badge/Tests-13%20Passed%20(100%25)-brightgreen.svg)](#verification--test-suite)

> **"Snap once. The autonomous agent tracks, audits, and escalates for you."**  
> Eliminating *Citizen Fatigue* in urban governance by replacing passive grievance portals with an autonomous digital proxy.

---

## 🌟 Key Architectural Pillars

1. **Autonomous Intake & AI Vision Triage ($T=0$):**
   - Citizen snaps a photo with GPS coordinates.
   - The agent analyzes the photo, verifies authenticity, classifies the hazard (`POTHOLE`, `OPEN_MANHOLE`, `GARBAGE_OVERFLOW`, `BROKEN_STREETLIGHT`, `WATERLOGGING`), and scores severity ($1 - 10$).
   - Creates an immutable intake `AuditLog` entry.
2. **Real-Time Locality & Jurisdiction Resolution:**
   - Evaluates device GPS coordinates against municipal polygons in real-time.
   - Maps to the exact administrative jurisdiction: **Municipality, Circle, and Ward** (e.g., Badangpet Circle / GHMC, Ward 14, LB Nagar Zone).
   - Resolves responsible officer emails and official Twitter/X handles.
3. **Autonomous Time-Based SLA Escalation Engine:**
   - **Tier 1 ($T + 3$ Days):** If unresolved, autonomously dispatches formal grievance email to the local **Ward Officer / Executive Engineer**.
   - **Tier 2 ($T + 7$ Days):** If unresolved, autonomously escalates to the **Zonal Commissioner** citing past administrative delays.
   - **Tier 3 ($T + 14$ Days):** If still neglected, autonomously publishes a **public accountability alert on Twitter/X** tagging municipal leadership (`@GHMCOnline`, `@TelanganaMAUD`).
4. **Interactive Time-Travel Warp Engine (Hackathon Demo):**
   - Demonstrate 14 days of autonomous escalation within a 3-minute stage pitch!
   - `POST /api/v1/simulation/tickets/{id}/advance?days=X` fast-forwards ticket age, immediately firing live emails and public alerts on stage.
5. **Interactive Swagger UI & OpenAPI 3.0:**
   - Interactive visual interface at `http://localhost:8080/swagger-ui.html` for browsing, trying out endpoints, and inspecting JSON schemas.

---

## 📚 Complete Project Documentation (`Docs/`)

| Document | Description | Direct Link |
|---|---|---|
| **Product Requirements Document (PRD)** | Problem statement, citizen fatigue, SLA rules, target personas, 3-minute pitch script. | [Docs/prd.md](Docs/prd.md) |
| **System Architecture Specification** | C4 architecture, multi-agent division of labor, sequence diagrams, database ERD. | [Docs/architecture.md](Docs/architecture.md) |
| **Detailed Engineering & Design Spec** | Software design patterns, OpenAPI contracts, TypeScript models, heuristics. | [Docs/Design.md](Docs/Design.md) |
| **Project Implementation Roadmap** | Phase 1 through 5 deliverables, screen-by-screen frontend guide for teammates. | [Docs/phases.md](Docs/phases.md) |
| **Frontend Handover & Integration Guide** | Clean-slate status, endpoint reference, sample data, and TypeScript client. | [frontend/FRONTEND_HANDOVER.md](frontend/FRONTEND_HANDOVER.md) |

---

## 🚀 Quick Start Guide

### 1. Run the Spring Boot 3 Backend
```bash
cd backend/civic-backend

# Boots in ~2 seconds using H2 in-memory database with pre-seeded realistic data
./mvnw spring-boot:run
```

- **Interactive Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI 3.0 Specification:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)
- **H2 Database Console:** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)  
  - JDBC URL: `jdbc:h2:mem:civicdb`  
  - Username: `sa` | Password: *(leave blank)*
- **Static Uploads Endpoint:** `http://localhost:8080/uploads/<image_name>`

---

## 📱 Frontend Integration (For Your Teammate)

The frontend project in `frontend/my-app` is **completely clean and pristine**:
- Restored to the clean Expo router starter template so your teammate has **total creative freedom** to build the UI and theme.
- **Detailed Handover Guide:** [frontend/FRONTEND_HANDOVER.md](frontend/FRONTEND_HANDOVER.md)
- Pre-made optional TypeScript client and type definitions are ready in `frontend/my-app/src/services/api.ts` and `frontend/my-app/src/types/api.ts`.
- **Run the frontend:**
  ```bash
  cd frontend/my-app
  npm start
  ```
  - Press `w` to open web preview in browser.
  - Scan QR code with Expo Go app on iOS or Android.

---

## 📦 Pre-Seeded Realistic Demo Data

When the backend boots, the `DataInitializer` automatically seeds **4 realistic civic grievance tickets** in Hyderabad / GHMC:

| ID | Title / Hazard Type | Municipality & Ward | Severity | Current Status | Image Preview |
|---|---|---|---|---|---|
| `#1` | **Severe POTHOLE** | Badangpet Circle / GHMC (Ward 14) | `8 / 10` | `TIER_1_ESCALATED` | [View Photo](http://localhost:8080/uploads/pothole_badangpet.jpg) |
| `#2` | **Critical OPEN_MANHOLE** | Charminar Circle 9 / GHMC (Ward 22) | `9 / 10` | `TIER_2_ESCALATED` | [View Photo](http://localhost:8080/uploads/manhole_charminar.jpg) |
| `#3` | **GARBAGE_OVERFLOW** | LB Nagar Circle / GHMC (Ward 11) | `7 / 10` | `SUBMITTED` | [View Photo](http://localhost:8080/uploads/garbage_lbnagar.jpg) |
| `#4` | **BROKEN_STREETLIGHT** | Serilingampally Circle (Ward 104) | `6 / 10` | `RESOLVED` | [View Photo](http://localhost:8080/uploads/streetlight_serilingampally.jpg) |

Every ticket has realistic audit logs tracking the autonomous agent's timeline.

---

## 🐳 Docker & PostgreSQL 15 Production Profile

### Option A: Run PostgreSQL 15 via Docker Compose (Local Dev)
```bash
# Start PostgreSQL 15 container in background
docker compose up -d postgres

# Run backend connected to PostgreSQL
cd backend/civic-backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=postgres
```

### Option B: Run Entire Stack via Docker Compose
```bash
# Builds and launches both PostgreSQL and CivicAdvocate backend
docker compose up --build -d
```

---

## 🧪 Verification & Test Suite

Run the full automated test suite (unit tests, integration tests, full lifecycle flow tests):

```bash
cd backend/civic-backend

# Run all tests
./mvnw clean test

# Build production fat JAR
./mvnw clean package
```

**Results:** `13 tests run, 0 failures, 0 errors, 100% pass rate.`

---

## ⚡ 3-Minute Hackathon Demo Script (Stage Pitch)

### Step 1: Snap & Intake ($T=0$)
**Option A: Via Multipart / Camera File Upload**
```bash
curl -X POST http://localhost:8080/api/v1/tickets \
  -F "latitude=17.3193" \
  -F "longitude=78.5298" \
  -F "description=Severe deep pothole on main crossroad" \
  -F "citizenContact=+919876543210"
```

**Option B: Via Raw JSON Payload**
```bash
curl -X POST http://localhost:8080/api/v1/tickets \
  -H "Content-Type: application/json" \
  -d '{"latitude": 17.3193, "longitude": 78.5298, "description": "Severe deep pothole", "citizenContact": "+919876543210"}'
```
*System verifies via AI Vision, returns `SUBMITTED`, severity `8/10`, maps to Badangpet Circle / GHMC.*

### Step 2: Time Warp +3 Days (Tier 1 Escalation)
```bash
curl -X POST http://localhost:8080/api/v1/simulation/tickets/1/advance \
  -H "Content-Type: application/json" \
  -d '{"days": 3}'
```
*Agent detects 3-day SLA breach and emails formal grievance dossier to `ward.officer.badangpet@ghmc.gov.in`.*

### Step 3: Time Warp +4 More Days (Tier 2 Escalation)
```bash
curl -X POST http://localhost:8080/api/v1/simulation/tickets/1/advance \
  -H "Content-Type: application/json" \
  -d '{"days": 4}'
```
*Agent detects 7-day administrative silence and escalates to Zonal Commissioner (`zonalcomm.lbnagar@ghmc.gov.in`).*

### Step 4: Time Warp +7 More Days (Tier 3 Twitter Public Alert)
```bash
curl -X POST http://localhost:8080/api/v1/simulation/tickets/1/advance \
  -H "Content-Type: application/json" \
  -d '{"days": 7}'
```
*14-day statutory SLA breached: Agent autonomously posts public accountability alert to Twitter tagging `@GHMCOnline` and `@TelanganaMAUD`.*

### Step 5: Inspect Immutable Audit Timeline
```bash
curl http://localhost:8080/api/v1/tickets/1/timeline
```

### Step 6: Mark Resolved
```bash
curl -X PATCH "http://localhost:8080/api/v1/tickets/1/resolve?remarks=Road+resurfaced+with+bitumen"
```

---

## 👥 Authors & Team
- **Backend & System Architecture:** Principal Software Engineer
- **Frontend & UI/UX:** Expo React Native Mobile Team
- **Event:** Avinya 2026 Hackathon

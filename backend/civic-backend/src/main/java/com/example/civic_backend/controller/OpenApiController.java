package com.example.civic_backend.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingClass;

/**
 * Serves the OpenAPI 3.0.3 Specification and interactive Swagger UI interface
 * for CivicAdvocate. Allows developers, teammates, and judges to test all endpoints
 * interactively in the browser at http://localhost:8080/swagger-ui.html.
 *
 * When SpringDoc OpenAPI Starter is present on the classpath, this controller automatically
 * steps aside so SpringDoc handles the OpenAPI endpoints without path conflicts.
 */
@RestController
@ConditionalOnMissingClass("org.springdoc.webmvc.ui.SwaggerConfig")
public class OpenApiController {

    @GetMapping(value = "/swagger-ui", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<Void> redirectToSwaggerUi() {
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create("/swagger-ui.html"));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @GetMapping(value = {"/swagger-ui.html", "/swagger-ui/index.html"}, produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> getSwaggerUiHtml() {
        String html = """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="utf-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1" />
                  <title>CivicAdvocate &mdash; Interactive Swagger UI</title>
                  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css" />
                  <style>
                    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
                    *, *:before, *:after { box-sizing: inherit; }
                    body { margin: 0; background: #fafafa; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
                    .custom-banner {
                      background: linear-gradient(135deg, #0f766e 0%, #0369a1 100%);
                      color: #ffffff;
                      padding: 14px 24px;
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
                    }
                    .custom-banner h1 { margin: 0; font-size: 20px; font-weight: 800; display: flex; align-items: center; gap: 10px; }
                    .custom-banner .meta-links { display: flex; gap: 10px; }
                    .custom-banner a {
                      color: #ffffff;
                      background: rgba(255,255,255,0.15);
                      text-decoration: none;
                      font-size: 13px;
                      font-weight: 600;
                      padding: 6px 14px;
                      border-radius: 6px;
                      border: 1px solid rgba(255,255,255,0.3);
                      transition: background 0.2s ease;
                    }
                    .custom-banner a:hover { background: rgba(255,255,255,0.3); }
                    .swagger-ui .topbar { display: none; }
                    .offline-fallback {
                      display: none;
                      padding: 24px;
                      margin: 20px auto;
                      max-width: 900px;
                      background: #fff;
                      border: 1px solid #e2e8f0;
                      border-radius: 10px;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    }
                    .offline-fallback h2 { color: #0f766e; margin-top: 0; }
                    .endpoint-card {
                      background: #f8fafc;
                      border-left: 4px solid #0284c7;
                      padding: 12px 16px;
                      margin-bottom: 12px;
                      border-radius: 4px;
                    }
                    .method-badge {
                      font-weight: 800;
                      font-size: 11px;
                      padding: 3px 8px;
                      border-radius: 4px;
                      color: white;
                      display: inline-block;
                      margin-right: 8px;
                    }
                    .badge-post { background: #16a34a; }
                    .badge-get { background: #0284c7; }
                    .badge-patch { background: #ca8a04; }
                  </style>
                </head>
                <body>
                  <div class="custom-banner">
                    <h1>🏛️ CivicAdvocate &mdash; Autonomous Grievance &amp; Escalation Agent</h1>
                    <div class="meta-links">
                      <a href="/v3/api-docs" target="_blank">OpenAPI 3.0 Spec</a>
                      <a href="/api/v1/tickets" target="_blank">Tickets JSON</a>
                      <a href="/h2-console" target="_blank">H2 Database</a>
                    </div>
                  </div>

                  <div id="swagger-ui"></div>

                  <div id="offline-view" class="offline-fallback">
                    <h2>CivicAdvocate REST API Reference (Offline Mode)</h2>
                    <p>Connected to Spring Boot 3 on <code>http://localhost:8080</code></p>
                    
                    <div class="endpoint-card">
                      <span class="method-badge badge-post">POST</span> <strong>/api/v1/tickets</strong>
                      <p>Citizen intake (T=0) via multipart/form-data with photo and GPS coordinates.</p>
                    </div>

                    <div class="endpoint-card">
                      <span class="method-badge badge-get">GET</span> <strong>/api/v1/tickets</strong>
                      <p>List all reported civic grievances ordered newest first.</p>
                    </div>

                    <div class="endpoint-card">
                      <span class="method-badge badge-get">GET</span> <strong>/api/v1/tickets/{id}</strong>
                      <p>Full ticket record with municipal officer routing and jurisdiction details.</p>
                    </div>

                    <div class="endpoint-card">
                      <span class="method-badge badge-get">GET</span> <strong>/api/v1/tickets/{id}/timeline</strong>
                      <p>Chronological audit timeline tracking autonomous SLA state transitions.</p>
                    </div>

                    <div class="endpoint-card">
                      <span class="method-badge badge-patch">PATCH</span> <strong>/api/v1/tickets/{id}/resolve</strong>
                      <p>Marks ticket as RESOLVED with engineering remarks.</p>
                    </div>

                    <div class="endpoint-card">
                      <span class="method-badge badge-post">POST</span> <strong>/api/v1/simulation/tickets/{id}/advance</strong>
                      <p>Hackathon Time-Travel Warp: advances ticket age by X days (body: <code>{"days": 3}</code> or query: <code>?days=3</code>).</p>
                    </div>
                  </div>

                  <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js" crossorigin></script>
                  <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-standalone-preset.js" crossorigin></script>
                  <script>
                    window.addEventListener('load', function() {
                      if (typeof SwaggerUIBundle !== 'undefined') {
                        SwaggerUIBundle({
                          url: '/v3/api-docs',
                          dom_id: '#swagger-ui',
                          presets: [
                            SwaggerUIBundle.presets.apis,
                            SwaggerUIStandalonePreset
                          ],
                          layout: "BaseLayout",
                          deepLinking: true,
                          showExtensions: true,
                          showCommonExtensions: true,
                          defaultModelsExpandDepth: 2,
                          defaultModelExpandDepth: 2
                        });
                      } else {
                        // Fallback in case internet connection to CDN is unavailable
                        document.getElementById('offline-view').style.display = 'block';
                      }
                    });
                  </script>
                </body>
                </html>
                """;
        return ResponseEntity.ok(html);
    }

    @GetMapping(value = "/v3/api-docs/swagger-config", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getSwaggerConfig() {
        return ResponseEntity.ok("{\"url\":\"/v3/api-docs\"}");
    }

    @GetMapping(value = "/v3/api-docs", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getOpenApiSpecification() {
        String spec = """
                {
                  "openapi": "3.0.3",
                  "info": {
                    "title": "CivicAdvocate &mdash; Autonomous Civic Grievance & Escalation Agent",
                    "description": "Enterprise Spring Boot 3 backend API powering autonomous hazard detection, reverse jurisdiction routing, SLA escalation (T+3d Ward Officer, T+7d Zonal Commissioner, T+14d Twitter API v2), immutable audit trails, and a Hackathon Time-Travel Warp Engine.",
                    "version": "1.0.0",
                    "contact": {
                      "name": "CivicAdvocate Core Team",
                      "email": "civicadvocate.agent@gmail.com"
                    }
                  },
                  "servers": [
                    {
                      "url": "http://localhost:8080",
                      "description": "Local Spring Boot Server"
                    }
                  ],
                  "tags": [
                    {
                      "name": "Civic Grievances",
                      "description": "Citizen intake, timeline auditing, ticket detail, and resolution endpoints"
                    },
                    {
                      "name": "Simulation Engine",
                      "description": "Time-Travel Warp controller for live stage hackathon demonstrations"
                    }
                  ],
                  "paths": {
                    "/api/v1/tickets": {
                      "post": {
                        "tags": ["Civic Grievances"],
                        "summary": "Ingest a new civic hazard grievance (T=0)",
                        "description": "Accepts multipart/form-data with a hazard photo and GPS coordinates. Executes AI Vision classification, scores severity (1-10), resolves municipal jurisdiction (Circle, Ward, Contacts), creates ticket, and logs intake audit trail.",
                        "operationId": "createTicket",
                        "requestBody": {
                          "required": true,
                          "content": {
                            "multipart/form-data": {
                              "schema": {
                                "type": "object",
                                "required": ["latitude", "longitude"],
                                "properties": {
                                  "image": {
                                    "type": "string",
                                    "format": "binary",
                                    "description": "Hazard photo (JPEG, PNG, WEBP)"
                                  },
                                  "latitude": {
                                    "type": "number",
                                    "format": "double",
                                    "example": 17.3193,
                                    "description": "GPS Latitude (e.g., 17.3193 for Badangpet Circle)"
                                  },
                                  "longitude": {
                                    "type": "number",
                                    "format": "double",
                                    "example": 78.5298,
                                    "description": "GPS Longitude (e.g., 78.5298 for Badangpet Circle)"
                                  },
                                  "description": {
                                    "type": "string",
                                    "example": "Deep pothole at main crossroad junction",
                                    "description": "Optional citizen remarks"
                                  },
                                  "citizenContact": {
                                    "type": "string",
                                    "example": "+91-9876543210",
                                    "description": "Citizen email or phone number for automated escalation updates"
                                  }
                                }
                              }
                            },
                            "application/json": {
                              "schema": {
                                "$ref": "#/components/schemas/IngestRequest"
                              }
                            }
                          }
                        },
                        "responses": {
                          "201": {
                            "description": "Ticket ingested and verified successfully",
                            "content": {
                              "application/json": {
                                "schema": {
                                  "$ref": "#/components/schemas/IngestResponse"
                                }
                              }
                            }
                          }
                        }
                      },
                      "get": {
                        "tags": ["Civic Grievances"],
                        "summary": "List all active civic grievance tickets",
                        "description": "Retrieves all reported tickets, ordered newest first. Ideal for dashboard feeds.",
                        "operationId": "listAllTickets",
                        "responses": {
                          "200": {
                            "description": "List of tickets",
                            "content": {
                              "application/json": {
                                "schema": {
                                  "type": "array",
                                  "items": {
                                    "$ref": "#/components/schemas/TicketSummaryResponse"
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    "/api/v1/tickets/{id}": {
                      "get": {
                        "tags": ["Civic Grievances"],
                        "summary": "Retrieve complete ticket details",
                        "description": "Returns full ticket metadata, current status, severity score, and responsible municipal contacts.",
                        "operationId": "getTicketDetail",
                        "parameters": [
                          {
                            "name": "id",
                            "in": "path",
                            "required": true,
                            "schema": {
                              "type": "integer",
                              "format": "int64"
                            },
                            "example": 1
                          }
                        ],
                        "responses": {
                          "200": {
                            "description": "Ticket details",
                            "content": {
                              "application/json": {
                                "schema": {
                                  "$ref": "#/components/schemas/TicketDetailResponse"
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    "/api/v1/tickets/{id}/timeline": {
                      "get": {
                        "tags": ["Civic Grievances"],
                        "summary": "Retrieve chronological audit timeline",
                        "description": "Returns the complete immutable ledger of every lifecycle event, dispatched email, and Twitter accountability post for this ticket.",
                        "operationId": "getTicketTimeline",
                        "parameters": [
                          {
                            "name": "id",
                            "in": "path",
                            "required": true,
                            "schema": {
                              "type": "integer",
                              "format": "int64"
                            },
                            "example": 1
                          }
                        ],
                        "responses": {
                          "200": {
                            "description": "Chronological audit timeline",
                            "content": {
                              "application/json": {
                                "schema": {
                                  "$ref": "#/components/schemas/TimelineResponse"
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    "/api/v1/tickets/{id}/resolve": {
                      "patch": {
                        "tags": ["Civic Grievances"],
                        "summary": "Resolve civic grievance",
                        "description": "Marks a ticket as RESOLVED and records closing remarks from field engineers.",
                        "operationId": "resolveTicket",
                        "parameters": [
                          {
                            "name": "id",
                            "in": "path",
                            "required": true,
                            "schema": {
                              "type": "integer",
                              "format": "int64"
                            },
                            "example": 1
                          },
                          {
                            "name": "remarks",
                            "in": "query",
                            "required": false,
                            "schema": {
                              "type": "string"
                            },
                            "example": "Hazard repaired and inspected by field engineering unit."
                          }
                        ],
                        "responses": {
                          "200": {
                            "description": "Ticket successfully resolved",
                            "content": {
                              "application/json": {
                                "schema": {
                                  "$ref": "#/components/schemas/ResolveResponse"
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    "/api/v1/simulation/tickets/{id}/advance": {
                      "post": {
                        "tags": ["Simulation Engine"],
                        "summary": "Hackathon Time-Travel Warp (Fast-Forward Ticket Age)",
                        "description": "Shifts the ticket's creation timestamp backwards by X days and immediately evaluates SLA rules. Enables demonstrating Tier 1 (Ward Officer at 3d), Tier 2 (Zonal Commissioner at 7d), and Tier 3 (Twitter at 14d) escalations live on stage.",
                        "operationId": "advanceTicket",
                        "parameters": [
                          {
                            "name": "id",
                            "in": "path",
                            "required": true,
                            "schema": {
                              "type": "integer",
                              "format": "int64"
                            },
                            "example": 1
                          },
                          {
                            "name": "days",
                            "in": "query",
                            "required": false,
                            "description": "Number of days to warp (e.g. 3, 4, 7)",
                            "schema": {
                              "type": "integer"
                            },
                            "example": 3
                          }
                        ],
                        "requestBody": {
                          "required": false,
                          "content": {
                            "application/json": {
                              "schema": {
                                "$ref": "#/components/schemas/AdvanceRequest"
                              }
                            }
                          }
                        },
                        "responses": {
                          "200": {
                            "description": "Escalation simulation results with new audit logs",
                            "content": {
                              "application/json": {
                                "schema": {
                                  "$ref": "#/components/schemas/AdvanceResponse"
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  "components": {
                    "schemas": {
                      "IngestRequest": {
                        "type": "object",
                        "required": ["latitude", "longitude"],
                        "properties": {
                          "latitude": { "type": "number", "format": "double", "example": 17.3193 },
                          "longitude": { "type": "number", "format": "double", "example": 78.5298 },
                          "description": { "type": "string", "example": "Severe pothole causing hazards" },
                          "citizenContact": { "type": "string", "example": "+91-9876543210" },
                          "imageUrl": { "type": "string", "example": "/uploads/pothole_badangpet.jpg" }
                        }
                      },
                      "TicketStatus": {
                        "type": "string",
                        "enum": [
                          "SUBMITTED",
                          "TIER_1_ESCALATED",
                          "TIER_2_ESCALATED",
                          "TIER_3_TWEETED",
                          "RESOLVED",
                          "REJECTED"
                        ],
                        "example": "SUBMITTED"
                      },
                      "IngestResponse": {
                        "type": "object",
                        "properties": {
                          "id": { "type": "integer", "format": "int64", "example": 1 },
                          "title": { "type": "string", "example": "Severe POTHOLE at Badangpet Circle / GHMC (Ward 14)" },
                          "hazardType": { "type": "string", "example": "POTHOLE" },
                          "status": { "$ref": "#/components/schemas/TicketStatus" },
                          "municipality": { "type": "string", "example": "Badangpet Circle / GHMC" },
                          "ward": { "type": "string", "example": "Ward 14" },
                          "zone": { "type": "string", "example": "LB Nagar Zone" },
                          "severityScore": { "type": "integer", "example": 8 },
                          "imageUrl": { "type": "string", "example": "/uploads/hazard_1726556400000.jpg" },
                          "latitude": { "type": "number", "format": "double", "example": 17.3193 },
                          "longitude": { "type": "number", "format": "double", "example": 78.5298 },
                          "createdAt": { "type": "string", "format": "date-time", "example": "2026-09-17T12:00:00" }
                        }
                      },
                      "TicketSummaryResponse": {
                        "type": "object",
                        "properties": {
                          "id": { "type": "integer", "format": "int64", "example": 1 },
                          "title": { "type": "string", "example": "Severe POTHOLE at Badangpet Circle / GHMC (Ward 14)" },
                          "hazardType": { "type": "string", "example": "POTHOLE" },
                          "status": { "$ref": "#/components/schemas/TicketStatus" },
                          "municipality": { "type": "string", "example": "Badangpet Circle / GHMC" },
                          "ward": { "type": "string", "example": "Ward 14" },
                          "severityScore": { "type": "integer", "example": 8 },
                          "imageUrl": { "type": "string", "example": "/uploads/pothole_badangpet.jpg" },
                          "latitude": { "type": "number", "format": "double", "example": 17.3193 },
                          "longitude": { "type": "number", "format": "double", "example": 78.5298 },
                          "createdAt": { "type": "string", "format": "date-time", "example": "2026-09-17T12:00:00" }
                        }
                      },
                      "TicketDetailResponse": {
                        "type": "object",
                        "properties": {
                          "id": { "type": "integer", "format": "int64", "example": 1 },
                          "title": { "type": "string", "example": "Severe POTHOLE at Badangpet Circle / GHMC (Ward 14)" },
                          "description": { "type": "string", "example": "Deep asphalt crater causing two-wheeler skidding." },
                          "hazardType": { "type": "string", "example": "POTHOLE" },
                          "latitude": { "type": "number", "format": "double", "example": 17.3193 },
                          "longitude": { "type": "number", "format": "double", "example": 78.5298 },
                          "imageUrl": { "type": "string", "example": "/uploads/pothole_badangpet.jpg" },
                          "municipality": { "type": "string", "example": "Badangpet Circle / GHMC" },
                          "ward": { "type": "string", "example": "Ward 14" },
                          "zone": { "type": "string", "example": "LB Nagar Zone" },
                          "wardOfficerEmail": { "type": "string", "example": "ward.officer.badangpet@ghmc.gov.in" },
                          "zonalCommissionerEmail": { "type": "string", "example": "zonalcomm.lbnagar@ghmc.gov.in" },
                          "officialTwitterHandles": { "type": "string", "example": "@GHMCOnline, @TelanganaMAUD" },
                          "severityScore": { "type": "integer", "example": 8 },
                          "status": { "$ref": "#/components/schemas/TicketStatus" },
                          "citizenContact": { "type": "string", "example": "+91-9876543210" },
                          "createdAt": { "type": "string", "format": "date-time" },
                          "updatedAt": { "type": "string", "format": "date-time" },
                          "resolvedAt": { "type": "string", "format": "date-time", "nullable": true }
                        }
                      },
                      "AuditLogItem": {
                        "type": "object",
                        "properties": {
                          "id": { "type": "integer", "format": "int64", "example": 1 },
                          "fromStatus": { "$ref": "#/components/schemas/TicketStatus", "nullable": true },
                          "toStatus": { "$ref": "#/components/schemas/TicketStatus" },
                          "action": { "type": "string", "example": "WARD_OFFICER_NOTIFIED" },
                          "actor": { "type": "string", "example": "AUTONOMOUS_SLA_AGENT" },
                          "details": { "type": "string", "example": "Statutory 3-Day SLA breached. Grievance dossier emailed to local Ward Officer." },
                          "timestamp": { "type": "string", "format": "date-time" }
                        }
                      },
                      "TimelineResponse": {
                        "type": "object",
                        "properties": {
                          "ticketId": { "type": "integer", "format": "int64", "example": 1 },
                          "title": { "type": "string", "example": "Severe POTHOLE at Badangpet Circle / GHMC (Ward 14)" },
                          "currentStatus": { "$ref": "#/components/schemas/TicketStatus" },
                          "municipality": { "type": "string", "example": "Badangpet Circle / GHMC" },
                          "ward": { "type": "string", "example": "Ward 14" },
                          "timeline": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/AuditLogItem"
                            }
                          }
                        }
                      },
                      "AdvanceRequest": {
                        "type": "object",
                        "required": ["days"],
                        "properties": {
                          "days": {
                            "type": "integer",
                            "minimum": 1,
                            "example": 3,
                            "description": "Number of days to shift creation time backwards"
                          }
                        }
                      },
                      "AdvanceResponse": {
                        "type": "object",
                        "properties": {
                          "ticketId": { "type": "integer", "format": "int64", "example": 1 },
                          "previousStatus": { "$ref": "#/components/schemas/TicketStatus" },
                          "newStatus": { "$ref": "#/components/schemas/TicketStatus" },
                          "daysShifted": { "type": "integer", "example": 3 },
                          "message": { "type": "string", "example": "Advanced ticket #1 by 3 days. Current state: TIER_1_ESCALATED." },
                          "simulatedCreatedAt": { "type": "string", "format": "date-time" },
                          "newActions": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/AuditLogItem"
                            }
                          }
                        }
                      },
                      "ResolveResponse": {
                        "type": "object",
                        "properties": {
                          "ticketId": { "type": "integer", "format": "int64", "example": 1 },
                          "status": { "$ref": "#/components/schemas/TicketStatus" },
                          "message": { "type": "string", "example": "Ticket marked as resolved successfully." },
                          "resolvedAt": { "type": "string", "format": "date-time" }
                        }
                      }
                    }
                  }
                }
                """;
        return ResponseEntity.ok(spec);
    }
}

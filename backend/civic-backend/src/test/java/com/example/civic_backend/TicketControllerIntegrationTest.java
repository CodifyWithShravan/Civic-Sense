package com.example.civic_backend;

import com.example.civic_backend.entity.TicketStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TicketControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Test HTTP Endpoints: Multipart POST Intake -> GET Timeline -> POST Advance -> PATCH Resolve")
    void testRestEndpoints() throws Exception {
        MockMultipartFile mockFile = new MockMultipartFile(
                "image", "open_manhole.jpg", "image/jpeg", "fake_image_content".getBytes());

        // 1. Ingest Grievance
        String responseContent = mockMvc.perform(multipart("/api/v1/tickets")
                        .file(mockFile)
                        .param("latitude", "17.3616")
                        .param("longitude", "78.4747")
                        .param("description", "Open manhole near Charminar circle")
                        .param("citizenContact", "+919876543210"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.status").value("SUBMITTED"))
                .andExpect(jsonPath("$.hazardType").value("OPEN_MANHOLE"))
                .andExpect(jsonPath("$.municipality").value("Charminar Circle 9 / GHMC"))
                .andExpect(jsonPath("$.ward").value("Ward 22"))
                .andReturn().getResponse().getContentAsString();

        // Extract ID from JSON
        org.json.JSONObject json = new org.json.JSONObject(responseContent);
        long ticketId = json.getLong("id");

        // 2. Query Timeline
        mockMvc.perform(get("/api/v1/tickets/" + ticketId + "/timeline"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ticketId").value(ticketId))
                .andExpect(jsonPath("$.currentStatus").value("SUBMITTED"))
                .andExpect(jsonPath("$.timeline[0].action").value("TICKET_CREATED"));

        // 3. Fast-forward 3 days via Simulation Endpoint
        mockMvc.perform(post("/api/v1/simulation/tickets/" + ticketId + "/advance")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"days\": 3}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.newStatus").value(TicketStatus.TIER_1_ESCALATED.name()))
                .andExpect(jsonPath("$.daysShifted").value(3))
                .andExpect(jsonPath("$.newActions[0].action").value("WARD_OFFICER_NOTIFIED"));

        // 4. Query All Tickets List
        mockMvc.perform(get("/api/v1/tickets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        // 5. Query Ticket Details
        mockMvc.perform(get("/api/v1/tickets/" + ticketId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(TicketStatus.TIER_1_ESCALATED.name()))
                .andExpect(jsonPath("$.wardOfficerEmail").value("ward.officer.charminar@ghmc.gov.in"));

        // 6. Resolve Ticket
        mockMvc.perform(patch("/api/v1/tickets/" + ticketId + "/resolve")
                        .param("remarks", "Manhole cover replaced and secured with steel ring."))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(TicketStatus.RESOLVED.name()));

        // 7. Advance on an already resolved ticket -> should return terminal message
        mockMvc.perform(post("/api/v1/simulation/tickets/" + ticketId + "/advance")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"days\": 3}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("terminal state")));
    }

    @Test
    @DisplayName("Test JSON Payload Grievance Intake")
    void testJsonGrievanceIntake() throws Exception {
        String jsonBody = """
                {
                    "latitude": 17.4401,
                    "longitude": 78.3489,
                    "description": "Defunct streetlights along Hitec City stretch",
                    "citizenContact": "+91-9988776655",
                    "imageUrl": "/uploads/streetlight_serilingampally.jpg"
                }
                """;

        mockMvc.perform(post("/api/v1/tickets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.status").value("SUBMITTED"))
                .andExpect(jsonPath("$.hazardType").value("BROKEN_STREETLIGHT"))
                .andExpect(jsonPath("$.municipality").value(org.hamcrest.Matchers.containsString("Serilingampally")))
                .andExpect(jsonPath("$.ward").value("Ward 105"));
    }

    @Test
    @DisplayName("Test 404 Not Found when ticket does not exist")
    void testTicketNotFound() throws Exception {
        mockMvc.perform(get("/api/v1/tickets/999999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"));

        mockMvc.perform(patch("/api/v1/tickets/999999/resolve"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test 400 Bad Request when coordinates are missing")
    void testMissingCoordinates() throws Exception {
        String jsonBody = """
                {
                    "description": "Missing coordinates ticket"
                }
                """;

        mockMvc.perform(post("/api/v1/tickets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    @DisplayName("Test 400 Bad Request when advancing with invalid days")
    void testAdvanceInvalidDays() throws Exception {
        mockMvc.perform(post("/api/v1/simulation/tickets/1/advance")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"days\": 0}"))
                .andExpect(status().isBadRequest());
    }
}

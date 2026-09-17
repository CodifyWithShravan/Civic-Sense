package com.example.civic_backend;

import com.example.civic_backend.dto.TicketDtos;
import com.example.civic_backend.entity.TicketStatus;
import com.example.civic_backend.service.SimulationService;
import com.example.civic_backend.service.TicketService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class CivicAdvocateFlowTest {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private SimulationService simulationService;

    @Test
    @DisplayName("Test Complete Autonomous Lifecycle: Ingestion -> Tier 1 -> Tier 2 -> Tier 3 -> Resolve")
    void testFullAutonomousEscalationLifecycle() {
        // 1. Intake & AI Verification (T=0)
        MockMultipartFile mockImage = new MockMultipartFile(
                "image", "pothole_badangpet.jpg", "image/jpeg", "sample_hazard_bytes".getBytes());

        // Coordinates around Badangpet Circle / GHMC
        double lat = 17.3193;
        double lng = 78.5298;

        TicketDtos.IngestResponse ingest = ticketService.ingestGrievance(
                mockImage, lat, lng, "Dangerous pothole near main crossroad", "citizen@example.com");

        assertNotNull(ingest.id());
        assertEquals(TicketStatus.SUBMITTED, ingest.status());
        assertEquals("POTHOLE", ingest.hazardType());
        assertTrue(ingest.municipality().contains("Badangpet"));
        assertEquals("Ward 14", ingest.ward());
        assertTrue(ingest.severityScore() >= 1 && ingest.severityScore() <= 10);

        Long ticketId = ingest.id();

        // Check initial timeline
        TicketDtos.TimelineResponse timeline0 = ticketService.getTimeline(ticketId);
        assertEquals(1, timeline0.timeline().size());
        assertEquals("TICKET_CREATED", timeline0.timeline().get(0).action());

        // 2. Simulate T+3 Days -> Should trigger Tier 1 Escalation (Ward Officer)
        TicketDtos.AdvanceResponse advanceTier1 = simulationService.advanceTicketTime(ticketId, 3);
        assertEquals(TicketStatus.SUBMITTED, advanceTier1.previousStatus());
        assertEquals(TicketStatus.TIER_1_ESCALATED, advanceTier1.newStatus());
        assertEquals(1, advanceTier1.newActions().size());
        assertEquals("WARD_OFFICER_NOTIFIED", advanceTier1.newActions().get(0).action());

        // 3. Simulate T+4 additional days (Total 7 Days) -> Should trigger Tier 2 Escalation (Zonal Commissioner)
        TicketDtos.AdvanceResponse advanceTier2 = simulationService.advanceTicketTime(ticketId, 4);
        assertEquals(TicketStatus.TIER_1_ESCALATED, advanceTier2.previousStatus());
        assertEquals(TicketStatus.TIER_2_ESCALATED, advanceTier2.newStatus());
        assertEquals("ZONAL_COMMISSIONER_ESCALATED", advanceTier2.newActions().get(0).action());

        // 4. Simulate T+7 additional days (Total 14 Days) -> Should trigger Tier 3 Escalation (Public Twitter Alert)
        TicketDtos.AdvanceResponse advanceTier3 = simulationService.advanceTicketTime(ticketId, 7);
        assertEquals(TicketStatus.TIER_2_ESCALATED, advanceTier3.previousStatus());
        assertEquals(TicketStatus.TIER_3_TWEETED, advanceTier3.newStatus());
        assertEquals("TWITTER_ALERT_PUBLISHED", advanceTier3.newActions().get(0).action());

        // Check complete timeline audit trail
        TicketDtos.TimelineResponse finalTimeline = ticketService.getTimeline(ticketId);
        assertEquals(4, finalTimeline.timeline().size());

        // 5. Test Resolution
        TicketDtos.ResolveResponse resolve = ticketService.resolveTicket(ticketId, "Pothole filled with bitumen mix.");
        assertEquals(TicketStatus.RESOLVED, resolve.status());

        // Verify status reflects RESOLVED in details
        TicketDtos.TicketDetailResponse detail = ticketService.getTicketDetails(ticketId);
        assertEquals(TicketStatus.RESOLVED, detail.status());
        assertNotNull(detail.resolvedAt());
    }
}

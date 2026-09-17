package com.example.civic_backend;

import com.example.civic_backend.entity.AuditLog;
import com.example.civic_backend.entity.Ticket;
import com.example.civic_backend.entity.TicketStatus;
import com.example.civic_backend.repository.AuditLogRepository;
import com.example.civic_backend.repository.TicketRepository;
import com.example.civic_backend.scheduler.EscalationScheduler;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class EscalationSchedulerTest {

    @Autowired
    private EscalationScheduler escalationScheduler;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Test
    @DisplayName("Autonomous SLA Scheduler should escalate overdue tickets and remain strictly idempotent")
    void testSchedulerEscalationAndIdempotency() {
        LocalDateTime now = LocalDateTime.now();

        // 1. Create a ticket in SUBMITTED breaching 3-day SLA (4 days old)
        Ticket t1 = new Ticket();
        t1.setTitle("Test SLA Breached Pothole");
        t1.setHazardType("POTHOLE");
        t1.setLatitude(17.3193);
        t1.setLongitude(78.5298);
        t1.setMunicipality("Badangpet Circle / GHMC");
        t1.setWard("Ward 14");
        t1.setZone("LB Nagar Zone");
        t1.setWardOfficerEmail("ward.officer@ghmc.gov.in");
        t1.setZonalCommissionerEmail("zonalcomm@ghmc.gov.in");
        t1.setOfficialTwitterHandles("@GHMCOnline");
        t1.setSeverityScore(8);
        t1.setStatus(TicketStatus.SUBMITTED);
        t1.setCreatedAt(now.minusDays(4));
        t1.setUpdatedAt(now.minusDays(4));
        Ticket saved1 = ticketRepository.save(t1);

        // 2. Create a ticket in TIER_1_ESCALATED breaching 7-day SLA (8 days old)
        Ticket t2 = new Ticket();
        t2.setTitle("Test SLA Breached Manhole");
        t2.setHazardType("OPEN_MANHOLE");
        t2.setLatitude(17.3616);
        t2.setLongitude(78.4747);
        t2.setMunicipality("Charminar Circle 9 / GHMC");
        t2.setWard("Ward 22");
        t2.setZone("Charminar Zone");
        t2.setWardOfficerEmail("ward.officer@ghmc.gov.in");
        t2.setZonalCommissionerEmail("zonalcomm@ghmc.gov.in");
        t2.setOfficialTwitterHandles("@GHMCOnline");
        t2.setSeverityScore(9);
        t2.setStatus(TicketStatus.TIER_1_ESCALATED);
        t2.setCreatedAt(now.minusDays(8));
        t2.setUpdatedAt(now.minusDays(5));
        Ticket saved2 = ticketRepository.save(t2);

        // 3. Create a ticket in TIER_2_ESCALATED breaching 14-day SLA (15 days old)
        Ticket t3 = new Ticket();
        t3.setTitle("Test SLA Breached Garbage");
        t3.setHazardType("GARBAGE_OVERFLOW");
        t3.setLatitude(17.3457);
        t3.setLongitude(78.5522);
        t3.setMunicipality("LB Nagar Circle / GHMC");
        t3.setWard("Ward 11");
        t3.setZone("LB Nagar Zone");
        t3.setWardOfficerEmail("ward.officer@ghmc.gov.in");
        t3.setZonalCommissionerEmail("zonalcomm@ghmc.gov.in");
        t3.setOfficialTwitterHandles("@GHMCOnline");
        t3.setSeverityScore(7);
        t3.setStatus(TicketStatus.TIER_2_ESCALATED);
        t3.setCreatedAt(now.minusDays(15));
        t3.setUpdatedAt(now.minusDays(8));
        Ticket saved3 = ticketRepository.save(t3);

        // Run the autonomous escalation cycle
        escalationScheduler.evaluateSlaEscalations();

        // Verify state transitions
        Ticket refreshed1 = ticketRepository.findById(saved1.getId()).orElseThrow();
        assertEquals(TicketStatus.TIER_1_ESCALATED, refreshed1.getStatus(), "Overdue SUBMITTED should escalate to TIER_1");

        Ticket refreshed2 = ticketRepository.findById(saved2.getId()).orElseThrow();
        assertEquals(TicketStatus.TIER_2_ESCALATED, refreshed2.getStatus(), "Overdue TIER_1 should escalate to TIER_2");

        Ticket refreshed3 = ticketRepository.findById(saved3.getId()).orElseThrow();
        assertEquals(TicketStatus.TIER_3_TWEETED, refreshed3.getStatus(), "Overdue TIER_2 should escalate to TIER_3");

        // Verify audit log entries
        List<AuditLog> logs1 = auditLogRepository.findByTicketIdOrderByTimestampAsc(saved1.getId());
        assertEquals(1, logs1.size());
        assertEquals("WARD_OFFICER_NOTIFIED", logs1.get(0).getAction());

        List<AuditLog> logs2 = auditLogRepository.findByTicketIdOrderByTimestampAsc(saved2.getId());
        assertEquals(1, logs2.size());
        assertEquals("ZONAL_COMMISSIONER_ESCALATED", logs2.get(0).getAction());

        List<AuditLog> logs3 = auditLogRepository.findByTicketIdOrderByTimestampAsc(saved3.getId());
        assertEquals(1, logs3.size());
        assertEquals("TWITTER_ALERT_PUBLISHED", logs3.get(0).getAction());

        // =====================================================================
        // Test Idempotency: Run scheduler immediately a second time
        // =====================================================================
        escalationScheduler.evaluateSlaEscalations();

        // Statuses must remain unchanged
        assertEquals(TicketStatus.TIER_1_ESCALATED, ticketRepository.findById(saved1.getId()).orElseThrow().getStatus());
        assertEquals(TicketStatus.TIER_2_ESCALATED, ticketRepository.findById(saved2.getId()).orElseThrow().getStatus());
        assertEquals(TicketStatus.TIER_3_TWEETED, ticketRepository.findById(saved3.getId()).orElseThrow().getStatus());

        // Audit log counts must remain strictly 1 (no duplicate transitions or actions)
        assertEquals(1, auditLogRepository.findByTicketIdOrderByTimestampAsc(saved1.getId()).size(),
                "Scheduler must be idempotent and not create duplicate audit logs for Ticket 1");
        assertEquals(1, auditLogRepository.findByTicketIdOrderByTimestampAsc(saved2.getId()).size(),
                "Scheduler must be idempotent and not create duplicate audit logs for Ticket 2");
        assertEquals(1, auditLogRepository.findByTicketIdOrderByTimestampAsc(saved3.getId()).size(),
                "Scheduler must be idempotent and not create duplicate audit logs for Ticket 3");
    }
}

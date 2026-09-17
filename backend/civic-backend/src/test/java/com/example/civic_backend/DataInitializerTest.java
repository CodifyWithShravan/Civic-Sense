package com.example.civic_backend;

import com.example.civic_backend.entity.AuditLog;
import com.example.civic_backend.entity.Ticket;
import com.example.civic_backend.entity.TicketStatus;
import com.example.civic_backend.repository.AuditLogRepository;
import com.example.civic_backend.repository.TicketRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class DataInitializerTest {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Test
    @DisplayName("DataInitializer should seed realistic sample tickets across GHMC jurisdictions")
    void testSeedDataLoaded() {
        assertTrue(ticketRepository.count() >= 3, "At least 3 sample tickets should be seeded");

        List<Ticket> allTickets = ticketRepository.findAll();
        boolean hasBadangpet = allTickets.stream()
                .anyMatch(t -> t.getMunicipality().contains("Badangpet") && t.getHazardType().equals("POTHOLE"));
        boolean hasCharminar = allTickets.stream()
                .anyMatch(t -> t.getMunicipality().contains("Charminar") && t.getHazardType().equals("OPEN_MANHOLE"));
        boolean hasLBNagar = allTickets.stream()
                .anyMatch(t -> t.getMunicipality().contains("LB Nagar") && t.getHazardType().equals("GARBAGE_OVERFLOW"));

        assertTrue(hasBadangpet, "Must have Badangpet pothole seed ticket");
        assertTrue(hasCharminar, "Must have Charminar open manhole seed ticket");
        assertTrue(hasLBNagar, "Must have LB Nagar garbage overflow seed ticket");

        // Verify audit logs exist for each seed ticket
        for (Ticket ticket : allTickets) {
            List<AuditLog> logs = auditLogRepository.findByTicketIdOrderByTimestampAsc(ticket.getId());
            assertFalse(logs.isEmpty(), "Every seed ticket must have at least one audit log entry");
            assertEquals("TICKET_CREATED", logs.get(0).getAction(), "First audit log must be TICKET_CREATED");
        }
    }
}

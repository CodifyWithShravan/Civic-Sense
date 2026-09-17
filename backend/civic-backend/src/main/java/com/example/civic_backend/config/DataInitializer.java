package com.example.civic_backend.config;

import com.example.civic_backend.entity.AuditLog;
import com.example.civic_backend.entity.Ticket;
import com.example.civic_backend.entity.TicketStatus;
import com.example.civic_backend.repository.AuditLogRepository;
import com.example.civic_backend.repository.TicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Seeds initial realistic civic grievance tickets and chronological audit trails
 * for Hyderabad / GHMC municipal jurisdictions. Ensures rich, immediate data
 * is available as soon as the mobile app or Swagger UI connects.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final TicketRepository ticketRepository;
    private final AuditLogRepository auditLogRepository;

    @org.springframework.beans.factory.annotation.Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    public DataInitializer(TicketRepository ticketRepository, AuditLogRepository auditLogRepository) {
        this.ticketRepository = ticketRepository;
        this.auditLogRepository = auditLogRepository;
    }

    private void ensureSeedUploads() {
        String[] files = {
            "pothole_badangpet.jpg",
            "manhole_charminar.jpg",
            "garbage_lbnagar.jpg",
            "streetlight_serilingampally.jpg",
            "sample_hazard.jpg"
        };
        try {
            java.nio.file.Path targetDir = java.nio.file.Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!java.nio.file.Files.exists(targetDir)) {
                java.nio.file.Files.createDirectories(targetDir);
            }
            for (String file : files) {
                java.nio.file.Path dest = targetDir.resolve(file);
                if (!java.nio.file.Files.exists(dest)) {
                    try (java.io.InputStream in = getClass().getResourceAsStream("/seed-uploads/" + file)) {
                        if (in != null) {
                            java.nio.file.Files.copy(in, dest, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                            log.info("Initialized seed image asset on disk: {}", dest);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Could not ensure seed uploads: {}", e.getMessage());
        }
    }

    @Override
    public void run(String... args) {
        ensureSeedUploads();

        if (ticketRepository.count() > 0) {
            log.info("Database already contains tickets. Skipping sample seed data initialization.");
            return;
        }

        log.info("Initializing realistic sample civic grievance tickets and audit records...");
        LocalDateTime now = LocalDateTime.now();

        // ---------------------------------------------------------------------
        // 1. Badangpet Pothole (Tier 1 Escalated - 4 days old)
        // ---------------------------------------------------------------------
        Ticket t1 = new Ticket();
        t1.setTitle("Severe POTHOLE at Badangpet Circle / GHMC (Ward 14)");
        t1.setDescription("Deep asphalt crater (approx 25cm depth) at the Almasguda - Badangpet main junction road. Two-wheelers are losing balance, creating an immediate danger to commuters during peak hours.");
        t1.setHazardType("POTHOLE");
        t1.setLatitude(17.3193);
        t1.setLongitude(78.5298);
        t1.setImageUrl("/uploads/pothole_badangpet.jpg");
        t1.setMunicipality("Badangpet Circle / GHMC");
        t1.setWard("Ward 14");
        t1.setZone("LB Nagar Zone");
        t1.setWardOfficerEmail("ward.officer.badangpet@ghmc.gov.in");
        t1.setZonalCommissionerEmail("zonalcomm.lbnagar@ghmc.gov.in");
        t1.setOfficialTwitterHandles("@GHMCOnline, @TelanganaMAUD");
        t1.setSeverityScore(8);
        t1.setStatus(TicketStatus.TIER_1_ESCALATED);
        t1.setCitizenContact("+91-9876543210");
        t1.setCreatedAt(now.minusDays(4));
        t1.setUpdatedAt(now.minusDays(1));
        Ticket saved1 = ticketRepository.save(t1);

        AuditLog a1_1 = new AuditLog(
                saved1.getId(),
                null,
                TicketStatus.SUBMITTED,
                "TICKET_CREATED",
                "CITIZEN_MOBILE",
                "Hazard ingested via mobile client. AI Vision verified POTHOLE with severity 8/10. Routed to Badangpet Circle / GHMC (Ward 14)."
        );
        a1_1.setTimestamp(now.minusDays(4));
        auditLogRepository.save(a1_1);

        AuditLog a1_2 = new AuditLog(
                saved1.getId(),
                TicketStatus.SUBMITTED,
                TicketStatus.TIER_1_ESCALATED,
                "WARD_OFFICER_NOTIFIED",
                "AUTONOMOUS_SLA_AGENT",
                "Statutory 3-Day SLA breached without municipal rectification. Grievance dossier emailed to local Ward Officer (ward.officer.badangpet@ghmc.gov.in)."
        );
        a1_2.setTimestamp(now.minusDays(1));
        auditLogRepository.save(a1_2);

        // ---------------------------------------------------------------------
        // 2. Charminar Open Manhole (Tier 2 Escalated - 8 days old)
        // ---------------------------------------------------------------------
        Ticket t2 = new Ticket();
        t2.setTitle("Critical OPEN_MANHOLE at Charminar Circle 9 / GHMC (Ward 22)");
        t2.setDescription("Uncovered municipal storm drainage chamber without cautionary barricades or warning markers. Extreme life safety hazard for pedestrians and two-wheelers in high-density heritage market zone.");
        t2.setHazardType("OPEN_MANHOLE");
        t2.setLatitude(17.3616);
        t2.setLongitude(78.4747);
        t2.setImageUrl("/uploads/manhole_charminar.jpg");
        t2.setMunicipality("Charminar Circle 9 / GHMC");
        t2.setWard("Ward 22");
        t2.setZone("Charminar Zone");
        t2.setWardOfficerEmail("ward.officer.charminar@ghmc.gov.in");
        t2.setZonalCommissionerEmail("zonalcomm.charminar@ghmc.gov.in");
        t2.setOfficialTwitterHandles("@GHMCOnline, @TelanganaMAUD");
        t2.setSeverityScore(9);
        t2.setStatus(TicketStatus.TIER_2_ESCALATED);
        t2.setCitizenContact("citizen.charminar@gmail.com");
        t2.setCreatedAt(now.minusDays(8));
        t2.setUpdatedAt(now.minusDays(1));
        Ticket saved2 = ticketRepository.save(t2);

        AuditLog a2_1 = new AuditLog(
                saved2.getId(),
                null,
                TicketStatus.SUBMITTED,
                "TICKET_CREATED",
                "CITIZEN_MOBILE",
                "Hazard ingested via mobile client. AI Vision verified OPEN_MANHOLE with severity 9/10. Routed to Charminar Circle 9 / GHMC (Ward 22)."
        );
        a2_1.setTimestamp(now.minusDays(8));
        auditLogRepository.save(a2_1);

        AuditLog a2_2 = new AuditLog(
                saved2.getId(),
                TicketStatus.SUBMITTED,
                TicketStatus.TIER_1_ESCALATED,
                "WARD_OFFICER_NOTIFIED",
                "AUTONOMOUS_SLA_AGENT",
                "3-Day SLA breached without Ward response. Grievance dossier emailed to Ward Officer (ward.officer.charminar@ghmc.gov.in)."
        );
        a2_2.setTimestamp(now.minusDays(5));
        auditLogRepository.save(a2_2);

        AuditLog a2_3 = new AuditLog(
                saved2.getId(),
                TicketStatus.TIER_1_ESCALATED,
                TicketStatus.TIER_2_ESCALATED,
                "ZONAL_COMMISSIONER_ESCALATED",
                "AUTONOMOUS_SLA_AGENT",
                "7-Day SLA breached without Ward resolution. Formal escalation notice dispatched to Zonal Commissioner (zonalcomm.charminar@ghmc.gov.in)."
        );
        a2_3.setTimestamp(now.minusDays(1));
        auditLogRepository.save(a2_3);

        // ---------------------------------------------------------------------
        // 3. LB Nagar Solid Waste Overflow (Submitted - 14 hours old)
        // ---------------------------------------------------------------------
        Ticket t3 = new Ticket();
        t3.setTitle("Public Health Hazard: GARBAGE_OVERFLOW at LB Nagar Circle (Ward 11)");
        t3.setDescription("Municipal secondary collection dump yard overflowing across 30 meters of road carriage-way, blocking pedestrian walkway and causing acute bio-sanitary nuisance.");
        t3.setHazardType("GARBAGE_OVERFLOW");
        t3.setLatitude(17.3457);
        t3.setLongitude(78.5522);
        t3.setImageUrl("/uploads/garbage_lbnagar.jpg");
        t3.setMunicipality("LB Nagar Circle / GHMC");
        t3.setWard("Ward 11");
        t3.setZone("LB Nagar Zone");
        t3.setWardOfficerEmail("ward.officer.lbnagar@ghmc.gov.in");
        t3.setZonalCommissionerEmail("zonalcomm.lbnagar@ghmc.gov.in");
        t3.setOfficialTwitterHandles("@GHMCOnline, @TelanganaMAUD");
        t3.setSeverityScore(7);
        t3.setStatus(TicketStatus.SUBMITTED);
        t3.setCitizenContact("+91-9123456780");
        t3.setCreatedAt(now.minusHours(14));
        t3.setUpdatedAt(now.minusHours(14));
        Ticket saved3 = ticketRepository.save(t3);

        AuditLog a3_1 = new AuditLog(
                saved3.getId(),
                null,
                TicketStatus.SUBMITTED,
                "TICKET_CREATED",
                "CITIZEN_MOBILE",
                "Hazard ingested via mobile client. AI Vision verified GARBAGE_OVERFLOW with severity 7/10. Routed to LB Nagar Circle / GHMC (Ward 11)."
        );
        a3_1.setTimestamp(now.minusHours(14));
        auditLogRepository.save(a3_1);

        // ---------------------------------------------------------------------
        // 4. Serilingampally Defunct Streetlight (Resolved)
        // ---------------------------------------------------------------------
        Ticket t4 = new Ticket();
        t4.setTitle("Defunct Streetlight Corridor at Serilingampally Circle (Ward 104)");
        t4.setDescription("Consecutive row of 8 LED street lamps dark for multiple days near Gachibowli flyover underpass, creating a dangerous blind spot for vehicles.");
        t4.setHazardType("BROKEN_STREETLIGHT");
        t4.setLatitude(17.4401);
        t4.setLongitude(78.3489);
        t4.setImageUrl("/uploads/streetlight_serilingampally.jpg");
        t4.setMunicipality("Serilingampally Circle / GHMC");
        t4.setWard("Ward 104");
        t4.setZone("Serilingampally Zone");
        t4.setWardOfficerEmail("ward.officer.serilingampally@ghmc.gov.in");
        t4.setZonalCommissionerEmail("zonalcomm.serilingampally@ghmc.gov.in");
        t4.setOfficialTwitterHandles("@GHMCOnline, @TelanganaMAUD");
        t4.setSeverityScore(6);
        t4.setStatus(TicketStatus.RESOLVED);
        t4.setCitizenContact("resident.serilingampally@outlook.com");
        t4.setCreatedAt(now.minusDays(10));
        t4.setUpdatedAt(now.minusDays(2));
        t4.setResolvedAt(now.minusDays(2));
        Ticket saved4 = ticketRepository.save(t4);

        AuditLog a4_1 = new AuditLog(
                saved4.getId(),
                null,
                TicketStatus.SUBMITTED,
                "TICKET_CREATED",
                "CITIZEN_MOBILE",
                "Hazard ingested via mobile client. AI Vision verified BROKEN_STREETLIGHT with severity 6/10."
        );
        a4_1.setTimestamp(now.minusDays(10));
        auditLogRepository.save(a4_1);

        AuditLog a4_2 = new AuditLog(
                saved4.getId(),
                TicketStatus.SUBMITTED,
                TicketStatus.TIER_1_ESCALATED,
                "WARD_OFFICER_NOTIFIED",
                "AUTONOMOUS_SLA_AGENT",
                "3-Day SLA breached. Grievance notice dispatched to Ward Officer."
        );
        a4_2.setTimestamp(now.minusDays(7));
        auditLogRepository.save(a4_2);

        AuditLog a4_3 = new AuditLog(
                saved4.getId(),
                TicketStatus.TIER_1_ESCALATED,
                TicketStatus.RESOLVED,
                "TICKET_RESOLVED",
                "MUNICIPAL_ENGINEER",
                "Underground junction box cable repaired; all 8 luminaires tested operational by GHMC Electrical Wing."
        );
        a4_3.setTimestamp(now.minusDays(2));
        auditLogRepository.save(a4_3);

        log.info("Successfully seeded 4 realistic civic grievance tickets with complete audit trails!");
    }
}

package com.example.civic_backend.service;

import com.example.civic_backend.dto.TicketDtos;
import com.example.civic_backend.entity.AuditLog;
import com.example.civic_backend.entity.Ticket;
import com.example.civic_backend.entity.TicketStatus;
import com.example.civic_backend.repository.AuditLogRepository;
import com.example.civic_backend.repository.TicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Core Orchestration Service for the CivicAdvocate Autonomous Grievance Agent.
 * Manages ticket lifecycles, vision verification, administrative routing, and audit logs.
 */
@Service
public class TicketService {

    private static final Logger log = LoggerFactory.getLogger(TicketService.class);

    private final TicketRepository ticketRepository;
    private final AuditLogRepository auditLogRepository;
    private final VisionVerificationService visionVerificationService;
    private final JurisdictionService jurisdictionService;

    public TicketService(
            TicketRepository ticketRepository,
            AuditLogRepository auditLogRepository,
            VisionVerificationService visionVerificationService,
            JurisdictionService jurisdictionService) {
        this.ticketRepository = ticketRepository;
        this.auditLogRepository = auditLogRepository;
        this.visionVerificationService = visionVerificationService;
        this.jurisdictionService = jurisdictionService;
    }

    /**
     * Ingests a new civic grievance from the mobile client at T=0.
     */
    @Transactional
    public TicketDtos.IngestResponse ingestGrievance(
            MultipartFile image,
            Double latitude,
            Double longitude,
            String description,
            String citizenContact) {

        if (latitude == null || longitude == null) {
            throw new IllegalArgumentException("Latitude and Longitude coordinates are required for civic grievance intake");
        }

        // 1. Autonomous AI Vision Verification
        VisionVerificationService.VisionAnalysisResult visionResult =
                visionVerificationService.analyzeImage(image, description);

        // 2. Real-time Locality & Administrative Jurisdiction Resolution
        JurisdictionService.JurisdictionInfo jurisdiction =
                jurisdictionService.resolve(latitude, longitude);

        // 3. Create Ticket Record
        Ticket ticket = new Ticket();
        ticket.setTitle(String.format("Severe %s at %s (%s)",
                visionResult.hazardType(), jurisdiction.municipality(), jurisdiction.ward()));
        ticket.setDescription(description != null && !description.isBlank() ? description : visionResult.summary());
        ticket.setHazardType(visionResult.hazardType());
        ticket.setLatitude(latitude);
        ticket.setLongitude(longitude);
        ticket.setImageUrl(visionResult.imageUrl());
        ticket.setMunicipality(jurisdiction.municipality());
        ticket.setWard(jurisdiction.ward());
        ticket.setZone(jurisdiction.zone());
        ticket.setWardOfficerEmail(jurisdiction.wardOfficerEmail());
        ticket.setZonalCommissionerEmail(jurisdiction.zonalCommissionerEmail());
        ticket.setOfficialTwitterHandles(jurisdiction.officialTwitterHandles());
        ticket.setSeverityScore(visionResult.severityScore());
        ticket.setStatus(TicketStatus.SUBMITTED);
        ticket.setCitizenContact(citizenContact);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket savedTicket = ticketRepository.save(ticket);

        // 4. Record Immutable Intake Audit Log
        AuditLog auditLog = new AuditLog(
                savedTicket.getId(),
                null,
                TicketStatus.SUBMITTED,
                "TICKET_CREATED",
                "CITIZEN_MOBILE",
                String.format("Hazard ingested via mobile client. AI Vision verified %s with severity %d/10. Routed to %s (%s).",
                        visionResult.hazardType(), visionResult.severityScore(), jurisdiction.municipality(), jurisdiction.ward())
        );
        auditLogRepository.save(auditLog);

        log.info("Successfully ingested Grievance #CA-{} for [{} - {}]",
                savedTicket.getId(), jurisdiction.municipality(), jurisdiction.ward());

        return new TicketDtos.IngestResponse(
                savedTicket.getId(),
                savedTicket.getTitle(),
                savedTicket.getHazardType(),
                savedTicket.getStatus(),
                savedTicket.getMunicipality(),
                savedTicket.getWard(),
                savedTicket.getZone(),
                savedTicket.getSeverityScore(),
                savedTicket.getImageUrl(),
                savedTicket.getLatitude(),
                savedTicket.getLongitude(),
                savedTicket.getCreatedAt()
        );
    }

    /**
     * Ingests a new civic grievance from a JSON request body.
     */
    @Transactional
    public TicketDtos.IngestResponse ingestGrievanceJson(TicketDtos.IngestRequest request) {
        if (request == null || request.latitude() == null || request.longitude() == null) {
            throw new IllegalArgumentException("Latitude and Longitude coordinates are required for civic grievance intake");
        }

        VisionVerificationService.VisionAnalysisResult visionResult =
                visionVerificationService.analyzeImage(null, request.description());

        JurisdictionService.JurisdictionInfo jurisdiction =
                jurisdictionService.resolve(request.latitude(), request.longitude());

        String finalImageUrl = request.imageUrl() != null && !request.imageUrl().isBlank()
                ? request.imageUrl()
                : visionResult.imageUrl();

        Ticket ticket = new Ticket();
        ticket.setTitle(String.format("Severe %s at %s (%s)",
                visionResult.hazardType(), jurisdiction.municipality(), jurisdiction.ward()));
        ticket.setDescription(request.description() != null && !request.description().isBlank() ? request.description() : visionResult.summary());
        ticket.setHazardType(visionResult.hazardType());
        ticket.setLatitude(request.latitude());
        ticket.setLongitude(request.longitude());
        ticket.setImageUrl(finalImageUrl);
        ticket.setMunicipality(jurisdiction.municipality());
        ticket.setWard(jurisdiction.ward());
        ticket.setZone(jurisdiction.zone());
        ticket.setWardOfficerEmail(jurisdiction.wardOfficerEmail());
        ticket.setZonalCommissionerEmail(jurisdiction.zonalCommissionerEmail());
        ticket.setOfficialTwitterHandles(jurisdiction.officialTwitterHandles());
        ticket.setSeverityScore(visionResult.severityScore());
        ticket.setStatus(TicketStatus.SUBMITTED);
        ticket.setCitizenContact(request.citizenContact());
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket savedTicket = ticketRepository.save(ticket);

        AuditLog auditLog = new AuditLog(
                savedTicket.getId(),
                null,
                TicketStatus.SUBMITTED,
                "TICKET_CREATED",
                "CITIZEN_MOBILE",
                String.format("Hazard ingested via mobile client (JSON). AI Vision verified %s with severity %d/10. Routed to %s (%s).",
                        visionResult.hazardType(), visionResult.severityScore(), jurisdiction.municipality(), jurisdiction.ward())
        );
        auditLogRepository.save(auditLog);

        log.info("Successfully ingested Grievance #CA-{} for [{} - {}] via JSON",
                savedTicket.getId(), jurisdiction.municipality(), jurisdiction.ward());

        return new TicketDtos.IngestResponse(
                savedTicket.getId(),
                savedTicket.getTitle(),
                savedTicket.getHazardType(),
                savedTicket.getStatus(),
                savedTicket.getMunicipality(),
                savedTicket.getWard(),
                savedTicket.getZone(),
                savedTicket.getSeverityScore(),
                savedTicket.getImageUrl(),
                savedTicket.getLatitude(),
                savedTicket.getLongitude(),
                savedTicket.getCreatedAt()
        );
    }

    /**
     * Retrieves chronological audit history for a specific ticket.
     */
    @Transactional(readOnly = true)
    public TicketDtos.TimelineResponse getTimeline(Long ticketId) {
        Ticket ticket = getTicketOrThrow(ticketId);
        List<AuditLog> auditLogs = auditLogRepository.findByTicketIdOrderByTimestampAsc(ticketId);

        List<TicketDtos.AuditLogItem> items = auditLogs.stream()
                .map(log -> new TicketDtos.AuditLogItem(
                        log.getId(),
                        log.getFromStatus(),
                        log.getToStatus(),
                        log.getAction(),
                        log.getActor(),
                        log.getDetails(),
                        log.getTimestamp()
                ))
                .toList();

        return new TicketDtos.TimelineResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getStatus(),
                ticket.getMunicipality(),
                ticket.getWard(),
                items
        );
    }

    /**
     * Retrieves full ticket details by ID.
     */
    @Transactional(readOnly = true)
    public TicketDtos.TicketDetailResponse getTicketDetails(Long ticketId) {
        Ticket ticket = getTicketOrThrow(ticketId);
        return mapToDetailResponse(ticket);
    }

    /**
     * Retrieves all active grievance tickets, ordered newest first.
     */
    @Transactional(readOnly = true)
    public List<TicketDtos.TicketSummaryResponse> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(t -> new TicketDtos.TicketSummaryResponse(
                        t.getId(),
                        t.getTitle(),
                        t.getHazardType(),
                        t.getStatus(),
                        t.getMunicipality(),
                        t.getWard(),
                        t.getSeverityScore(),
                        t.getImageUrl(),
                        t.getLatitude(),
                        t.getLongitude(),
                        t.getCreatedAt()
                ))
                .toList();
    }

    /**
     * Marks a ticket as RESOLVED and records the closure audit log.
     */
    @Transactional
    public TicketDtos.ResolveResponse resolveTicket(Long ticketId, String remarks) {
        Ticket ticket = getTicketOrThrow(ticketId);

        if (ticket.getStatus() == TicketStatus.RESOLVED) {
            return new TicketDtos.ResolveResponse(ticket.getId(), ticket.getStatus(), "Ticket is already marked as resolved.", ticket.getResolvedAt());
        }

        TicketStatus previousStatus = ticket.getStatus();
        LocalDateTime now = LocalDateTime.now();
        ticket.setStatus(TicketStatus.RESOLVED);
        ticket.setResolvedAt(now);
        ticket.setUpdatedAt(now);
        ticketRepository.save(ticket);

        String detailText = (remarks != null && !remarks.isBlank())
                ? remarks
                : "Civic hazard inspected and verified repaired by field engineering team.";

        AuditLog auditLog = new AuditLog(
                ticket.getId(),
                previousStatus,
                TicketStatus.RESOLVED,
                "TICKET_RESOLVED",
                "MUNICIPAL_ENGINEER",
                detailText
        );
        auditLogRepository.save(auditLog);

        log.info("Ticket #CA-{} officially RESOLVED with remarks: {}", ticketId, detailText);

        return new TicketDtos.ResolveResponse(ticket.getId(), TicketStatus.RESOLVED, "Ticket marked as resolved successfully.", now);
    }

    /**
     * Executes a state transition and logs an immutable audit event.
     */
    @Transactional
    public AuditLog recordTransition(Ticket ticket, TicketStatus newStatus, String action, String actor, String details) {
        TicketStatus previous = ticket.getStatus();
        ticket.setStatus(newStatus);
        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);

        AuditLog logEntry = new AuditLog(ticket.getId(), previous, newStatus, action, actor, details);
        return auditLogRepository.save(logEntry);
    }

    public Ticket getTicketOrThrow(Long ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with ID: " + ticketId));
    }

    private TicketDtos.TicketDetailResponse mapToDetailResponse(Ticket t) {
        return new TicketDtos.TicketDetailResponse(
                t.getId(),
                t.getTitle(),
                t.getDescription(),
                t.getHazardType(),
                t.getLatitude(),
                t.getLongitude(),
                t.getImageUrl(),
                t.getMunicipality(),
                t.getWard(),
                t.getZone(),
                t.getWardOfficerEmail(),
                t.getZonalCommissionerEmail(),
                t.getOfficialTwitterHandles(),
                t.getSeverityScore(),
                t.getStatus(),
                t.getCitizenContact(),
                t.getCreatedAt(),
                t.getUpdatedAt(),
                t.getResolvedAt()
        );
    }
}

package com.example.civic_backend.dto;

import com.example.civic_backend.entity.TicketStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Immutable Java 17 records representing API contracts for CivicAdvocate.
 */
public final class TicketDtos {

    private TicketDtos() {
    }

    /**
     * Optional JSON request payload for civic grievance intake.
     */
    public record IngestRequest(
        Double latitude,
        Double longitude,
        String description,
        String citizenContact,
        String imageUrl
    ) {}

    /**
     * Response returned immediately upon hazard intake (T=0).
     */
    public record IngestResponse(
        Long id,
        String title,
        String hazardType,
        TicketStatus status,
        String municipality,
        String ward,
        String zone,
        Integer severityScore,
        String imageUrl,
        Double latitude,
        Double longitude,
        LocalDateTime createdAt
    ) {}

    /**
     * Item entry within an audit timeline.
     */
    public record AuditLogItem(
        Long id,
        TicketStatus fromStatus,
        TicketStatus toStatus,
        String action,
        String actor,
        String details,
        LocalDateTime timestamp
    ) {}

    /**
     * Complete ordered audit trail of a grievance ticket.
     */
    public record TimelineResponse(
        Long ticketId,
        String title,
        TicketStatus currentStatus,
        String municipality,
        String ward,
        List<AuditLogItem> timeline
    ) {}

    /**
     * Request payload to warp/advance ticket time for hackathon demonstration.
     */
    public record AdvanceRequest(
        @NotNull(message = "Days parameter is required")
        @Min(value = 1, message = "Days must be at least 1")
        Integer days
    ) {}

    /**
     * Response payload after advancing ticket time.
     */
    public record AdvanceResponse(
        Long ticketId,
        TicketStatus previousStatus,
        TicketStatus newStatus,
        Integer daysShifted,
        String message,
        LocalDateTime simulatedCreatedAt,
        List<AuditLogItem> newActions
    ) {}

    /**
     * Summary item for dashboard listings.
     */
    public record TicketSummaryResponse(
        Long id,
        String title,
        String hazardType,
        TicketStatus status,
        String municipality,
        String ward,
        Integer severityScore,
        String imageUrl,
        Double latitude,
        Double longitude,
        LocalDateTime createdAt
    ) {}

    /**
     * Detailed ticket view including municipal officer routing information.
     */
    public record TicketDetailResponse(
        Long id,
        String title,
        String description,
        String hazardType,
        Double latitude,
        Double longitude,
        String imageUrl,
        String municipality,
        String ward,
        String zone,
        String wardOfficerEmail,
        String zonalCommissionerEmail,
        String officialTwitterHandles,
        Integer severityScore,
        TicketStatus status,
        String citizenContact,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime resolvedAt
    ) {}

    /**
     * Response returned after resolving a ticket.
     */
    public record ResolveResponse(
        Long ticketId,
        TicketStatus status,
        String message,
        LocalDateTime resolvedAt
    ) {}
}

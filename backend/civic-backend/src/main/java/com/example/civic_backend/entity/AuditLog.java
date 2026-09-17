package com.example.civic_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Immutable audit trail for every grievance state transition and agent action.
 */
@Entity
@Table(
    name = "audit_logs",
    indexes = {
        @Index(name = "idx_audit_ticket_timestamp", columnList = "ticket_id, timestamp")
    }
)
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_id", nullable = false)
    private Long ticketId;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_status")
    private TicketStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "to_status", nullable = false)
    private TicketStatus toStatus;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private String actor;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public AuditLog() {
    }

    public AuditLog(Long ticketId, TicketStatus fromStatus, TicketStatus toStatus, String action, String actor, String details) {
        this.ticketId = ticketId;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.action = action;
        this.actor = actor;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public TicketStatus getFromStatus() {
        return fromStatus;
    }

    public void setFromStatus(TicketStatus fromStatus) {
        this.fromStatus = fromStatus;
    }

    public TicketStatus getToStatus() {
        return toStatus;
    }

    public void setToStatus(TicketStatus toStatus) {
        this.toStatus = toStatus;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getActor() {
        return actor;
    }

    public void setActor(String actor) {
        this.actor = actor;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}

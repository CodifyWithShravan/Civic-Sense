package com.example.civic_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Core entity representing an autonomous civic grievance ticket.
 */
@Entity
@Table(
    name = "tickets",
    indexes = {
        @Index(name = "idx_ticket_status_created", columnList = "status, created_at"),
        @Index(name = "idx_ticket_municipality", columnList = "municipality")
    }
)
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "hazard_type", nullable = false)
    private String hazardType;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(nullable = false)
    private String municipality;

    private String ward;

    private String zone;

    @Column(name = "ward_officer_email")
    private String wardOfficerEmail;

    @Column(name = "zonal_commissioner_email")
    private String zonalCommissionerEmail;

    @Column(name = "official_twitter_handles")
    private String officialTwitterHandles;

    @Column(name = "severity_score", nullable = false)
    private Integer severityScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private TicketStatus status;

    @Column(name = "citizen_contact")
    private String citizenContact;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    public Ticket() {
    }

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (this.createdAt == null) {
            this.createdAt = now;
        }
        if (this.updatedAt == null) {
            this.updatedAt = now;
        }
        if (this.status == null) {
            this.status = TicketStatus.SUBMITTED;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getHazardType() {
        return hazardType;
    }

    public void setHazardType(String hazardType) {
        this.hazardType = hazardType;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getMunicipality() {
        return municipality;
    }

    public void setMunicipality(String municipality) {
        this.municipality = municipality;
    }

    public String getWard() {
        return ward;
    }

    public void setWard(String ward) {
        this.ward = ward;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public String getWardOfficerEmail() {
        return wardOfficerEmail;
    }

    public void setWardOfficerEmail(String wardOfficerEmail) {
        this.wardOfficerEmail = wardOfficerEmail;
    }

    public String getZonalCommissionerEmail() {
        return zonalCommissionerEmail;
    }

    public void setZonalCommissionerEmail(String zonalCommissionerEmail) {
        this.zonalCommissionerEmail = zonalCommissionerEmail;
    }

    public String getOfficialTwitterHandles() {
        return officialTwitterHandles;
    }

    public void setOfficialTwitterHandles(String officialTwitterHandles) {
        this.officialTwitterHandles = officialTwitterHandles;
    }

    public Integer getSeverityScore() {
        return severityScore;
    }

    public void setSeverityScore(Integer severityScore) {
        this.severityScore = severityScore;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public String getCitizenContact() {
        return citizenContact;
    }

    public void setCitizenContact(String citizenContact) {
        this.citizenContact = citizenContact;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
}

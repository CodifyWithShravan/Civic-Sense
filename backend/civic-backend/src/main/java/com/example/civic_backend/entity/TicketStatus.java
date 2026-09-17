package com.example.civic_backend.entity;

/**
 * Lifecycle states for an autonomous civic grievance ticket.
 */
public enum TicketStatus {
    /**
     * Hazard successfully ingested and AI Vision verified at T=0.
     */
    SUBMITTED,

    /**
     * Unresolved at T+3 Days: Autonomous grievance email dispatched to local Ward Officer.
     */
    TIER_1_ESCALATED,

    /**
     * Unresolved at T+7 Days: Autonomous escalation notice dispatched to Zonal Commissioner.
     */
    TIER_2_ESCALATED,

    /**
     * Unresolved at T+14 Days: Autonomous public accountability alert posted to Twitter/X.
     */
    TIER_3_TWEETED,

    /**
     * Hazard officially inspected, repaired, and resolved.
     */
    RESOLVED,

    /**
     * Rejected if verified as non-hazard, duplicate, or fraudulent.
     */
    REJECTED
}

package com.example.civic_backend.service;

import com.example.civic_backend.dto.TicketDtos;
import com.example.civic_backend.entity.AuditLog;
import com.example.civic_backend.entity.Ticket;
import com.example.civic_backend.entity.TicketStatus;
import com.example.civic_backend.repository.AuditLogRepository;
import com.example.civic_backend.repository.TicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Hackathon Demo Engine (Time-Travel Warp).
 * Allows fast-forwarding ticket age to simulate 14 days of civic SLA escalation
 * within a 3-minute stage pitch, triggering live email and Twitter actions.
 */
@Service
public class SimulationService {

    private static final Logger log = LoggerFactory.getLogger(SimulationService.class);

    private final TicketRepository ticketRepository;
    private final AuditLogRepository auditLogRepository;
    private final EmailDispatchService emailDispatchService;
    private final TwitterService twitterService;

    @Value("${app.sla.tier1-days:3}")
    private int tier1Days;

    @Value("${app.sla.tier2-days:7}")
    private int tier2Days;

    @Value("${app.sla.tier3-days:14}")
    private int tier3Days;

    public SimulationService(
            TicketRepository ticketRepository,
            AuditLogRepository auditLogRepository,
            EmailDispatchService emailDispatchService,
            TwitterService twitterService) {
        this.ticketRepository = ticketRepository;
        this.auditLogRepository = auditLogRepository;
        this.emailDispatchService = emailDispatchService;
        this.twitterService = twitterService;
    }

    /**
     * Fast-forwards the ticket's creation timestamp backwards by X days
     * and evaluates SLA rules immediately, triggering autonomous actions.
     */
    @Transactional
    public TicketDtos.AdvanceResponse advanceTicketTime(Long ticketId, int days) {
        if (days <= 0) {
            throw new IllegalArgumentException("Days to advance must be greater than 0");
        }

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with ID: " + ticketId));

        if (ticket.getStatus() == TicketStatus.RESOLVED || ticket.getStatus() == TicketStatus.REJECTED) {
            return new TicketDtos.AdvanceResponse(
                    ticket.getId(),
                    ticket.getStatus(),
                    ticket.getStatus(),
                    days,
                    "Ticket is in terminal state " + ticket.getStatus() + ". No further escalation applicable.",
                    ticket.getCreatedAt(),
                    List.of()
            );
        }

        TicketStatus originalStatus = ticket.getStatus();
        LocalDateTime simulatedCreatedAt = ticket.getCreatedAt().minusDays(days);
        ticket.setCreatedAt(simulatedCreatedAt);
        ticket.setUpdatedAt(LocalDateTime.now());

        // Calculate total simulated age in days from now
        long ageInDays = Duration.between(simulatedCreatedAt, LocalDateTime.now()).toDays();
        log.info("Simulation Warp: Ticket #CA-{} shifted by {} days. Simulated age: {} days. Status: {}",
                ticketId, days, ageInDays, ticket.getStatus());

        List<AuditLog> triggeredLogs = new ArrayList<>();

        // 1. Tier 1 Escalation Check (T + 3 Days)
        if (ticket.getStatus() == TicketStatus.SUBMITTED && ageInDays >= tier1Days) {
            log.info("Simulation: Triggering TIER_1_ESCALATED for Ticket #CA-{}", ticketId);
            emailDispatchService.dispatchTier1WardNotice(ticket);
            
            ticket.setStatus(TicketStatus.TIER_1_ESCALATED);
            AuditLog tier1Log = new AuditLog(
                    ticket.getId(),
                    TicketStatus.SUBMITTED,
                    TicketStatus.TIER_1_ESCALATED,
                    "WARD_OFFICER_NOTIFIED",
                    "SIMULATION_WARP_AGENT",
                    String.format("Time-Travel Warp (+%d days): 3-Day SLA breached. Autonomous grievance email dispatched to Ward Officer (%s).",
                            days, ticket.getWardOfficerEmail())
            );
            triggeredLogs.add(auditLogRepository.save(tier1Log));
        }

        // 2. Tier 2 Escalation Check (T + 7 Days)
        if (ticket.getStatus() == TicketStatus.TIER_1_ESCALATED && ageInDays >= tier2Days) {
            log.info("Simulation: Triggering TIER_2_ESCALATED for Ticket #CA-{}", ticketId);
            emailDispatchService.dispatchTier2ZonalEscalation(ticket);

            ticket.setStatus(TicketStatus.TIER_2_ESCALATED);
            AuditLog tier2Log = new AuditLog(
                    ticket.getId(),
                    TicketStatus.TIER_1_ESCALATED,
                    TicketStatus.TIER_2_ESCALATED,
                    "ZONAL_COMMISSIONER_ESCALATED",
                    "SIMULATION_WARP_AGENT",
                    String.format("Time-Travel Warp (+%d days): 7-Day SLA breached without Ward response. Escalation notice dispatched to Zonal Commissioner (%s).",
                            days, ticket.getZonalCommissionerEmail())
            );
            triggeredLogs.add(auditLogRepository.save(tier2Log));
        }

        // 3. Tier 3 Escalation Check (T + 14 Days)
        if (ticket.getStatus() == TicketStatus.TIER_2_ESCALATED && ageInDays >= tier3Days) {
            log.info("Simulation: Triggering TIER_3_TWEETED for Ticket #CA-{}", ticketId);
            String tweet = twitterService.publishPublicAccountabilityAlert(ticket);

            ticket.setStatus(TicketStatus.TIER_3_TWEETED);
            AuditLog tier3Log = new AuditLog(
                    ticket.getId(),
                    TicketStatus.TIER_2_ESCALATED,
                    TicketStatus.TIER_3_TWEETED,
                    "TWITTER_ALERT_PUBLISHED",
                    "SIMULATION_WARP_AGENT",
                    String.format("Time-Travel Warp (+%d days): 14-Day statutory SLA breached. Public accountability tweet broadcasted tagging %s. Tweet excerpt: %s",
                            days, ticket.getOfficialTwitterHandles(), tweet.substring(0, Math.min(tweet.length(), 100)))
            );
            triggeredLogs.add(auditLogRepository.save(tier3Log));
        }

        // Save updated ticket
        Ticket updatedTicket = ticketRepository.save(ticket);

        List<TicketDtos.AuditLogItem> auditItems = triggeredLogs.stream()
                .map(l -> new TicketDtos.AuditLogItem(
                        l.getId(),
                        l.getFromStatus(),
                        l.getToStatus(),
                        l.getAction(),
                        l.getActor(),
                        l.getDetails(),
                        l.getTimestamp()
                ))
                .toList();

        String message = String.format("Advanced ticket #%d by %d days. Current state: %s. %d autonomous actions executed.",
                ticketId, days, updatedTicket.getStatus(), triggeredLogs.size());

        return new TicketDtos.AdvanceResponse(
                updatedTicket.getId(),
                originalStatus,
                updatedTicket.getStatus(),
                days,
                message,
                updatedTicket.getCreatedAt(),
                auditItems
        );
    }
}

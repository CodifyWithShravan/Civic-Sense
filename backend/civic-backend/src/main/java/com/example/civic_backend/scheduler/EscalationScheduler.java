package com.example.civic_backend.scheduler;

import com.example.civic_backend.entity.AuditLog;
import com.example.civic_backend.entity.Ticket;
import com.example.civic_backend.entity.TicketStatus;
import com.example.civic_backend.repository.AuditLogRepository;
import com.example.civic_backend.repository.TicketRepository;
import com.example.civic_backend.service.EmailDispatchService;
import com.example.civic_backend.service.TwitterService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Autonomous SLA Escalation Monitor (Background Daemon).
 * Periodically scans the database for tickets breaching statutory resolution SLAs
 * and triggers autonomous escalation actions up the municipal hierarchy.
 */
@Component
public class EscalationScheduler {

    private static final Logger log = LoggerFactory.getLogger(EscalationScheduler.class);

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

    public EscalationScheduler(
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
     * Executes autonomous SLA checks across all active tickets.
     */
    @Scheduled(cron = "${app.escalation.cron:0 */5 * * * *}")
    @Transactional
    public void evaluateSlaEscalations() {
        LocalDateTime now = LocalDateTime.now();
        log.info("Autonomous SLA Escalation Daemon executing check at {}", now);

        try {
            processTier1Breaches(now);
            processTier2Breaches(now);
            processTier3Breaches(now);
        } catch (Exception e) {
            log.error("Error encountered during autonomous SLA escalation cycle: {}", e.getMessage(), e);
        }
    }

    private void processTier1Breaches(LocalDateTime now) {
        LocalDateTime tier1Threshold = now.minusDays(tier1Days);
        List<Ticket> overdueSubmitted = ticketRepository.findByStatusAndCreatedAtBefore(
                TicketStatus.SUBMITTED, tier1Threshold);

        if (!overdueSubmitted.isEmpty()) {
            log.info("Found {} tickets breaching Tier-1 SLA (> {} days). Escalating to Ward Officers...",
                    overdueSubmitted.size(), tier1Days);
        }

        for (Ticket ticket : overdueSubmitted) {
            try {
                emailDispatchService.dispatchTier1WardNotice(ticket);
                ticket.setStatus(TicketStatus.TIER_1_ESCALATED);
                ticket.setUpdatedAt(now);
                ticketRepository.save(ticket);

                AuditLog logEntry = new AuditLog(
                        ticket.getId(),
                        TicketStatus.SUBMITTED,
                        TicketStatus.TIER_1_ESCALATED,
                        "WARD_OFFICER_NOTIFIED",
                        "AUTONOMOUS_SLA_AGENT",
                        String.format("Statutory 3-Day SLA breached. Grievance dossier emailed to local Ward Officer (%s).",
                                ticket.getWardOfficerEmail())
                );
                auditLogRepository.save(logEntry);
            } catch (Exception e) {
                log.error("Failed to process Tier-1 escalation for ticket #CA-{}: {}", ticket.getId(), e.getMessage());
            }
        }
    }

    private void processTier2Breaches(LocalDateTime now) {
        LocalDateTime tier2Threshold = now.minusDays(tier2Days);
        List<Ticket> overdueTier1 = ticketRepository.findByStatusAndCreatedAtBefore(
                TicketStatus.TIER_1_ESCALATED, tier2Threshold);

        if (!overdueTier1.isEmpty()) {
            log.info("Found {} tickets breaching Tier-2 SLA (> {} days). Escalating to Zonal Commissioners...",
                    overdueTier1.size(), tier2Days);
        }

        for (Ticket ticket : overdueTier1) {
            try {
                emailDispatchService.dispatchTier2ZonalEscalation(ticket);
                ticket.setStatus(TicketStatus.TIER_2_ESCALATED);
                ticket.setUpdatedAt(now);
                ticketRepository.save(ticket);

                AuditLog logEntry = new AuditLog(
                        ticket.getId(),
                        TicketStatus.TIER_1_ESCALATED,
                        TicketStatus.TIER_2_ESCALATED,
                        "ZONAL_COMMISSIONER_ESCALATED",
                        "AUTONOMOUS_SLA_AGENT",
                        String.format("7-Day SLA breached without Ward resolution. Escalation notice dispatched to Zonal Commissioner (%s).",
                                ticket.getZonalCommissionerEmail())
                );
                auditLogRepository.save(logEntry);
            } catch (Exception e) {
                log.error("Failed to process Tier-2 escalation for ticket #CA-{}: {}", ticket.getId(), e.getMessage());
            }
        }
    }

    private void processTier3Breaches(LocalDateTime now) {
        LocalDateTime tier3Threshold = now.minusDays(tier3Days);
        List<Ticket> overdueTier2 = ticketRepository.findByStatusAndCreatedAtBefore(
                TicketStatus.TIER_2_ESCALATED, tier3Threshold);

        if (!overdueTier2.isEmpty()) {
            log.info("Found {} tickets breaching Tier-3 SLA (> {} days). Publishing public Twitter alerts...",
                    overdueTier2.size(), tier3Days);
        }

        for (Ticket ticket : overdueTier2) {
            try {
                String tweet = twitterService.publishPublicAccountabilityAlert(ticket);
                ticket.setStatus(TicketStatus.TIER_3_TWEETED);
                ticket.setUpdatedAt(now);
                ticketRepository.save(ticket);

                AuditLog logEntry = new AuditLog(
                        ticket.getId(),
                        TicketStatus.TIER_2_ESCALATED,
                        TicketStatus.TIER_3_TWEETED,
                        "TWITTER_ALERT_PUBLISHED",
                        "AUTONOMOUS_SLA_AGENT",
                        String.format("14-Day statutory SLA breached. Public accountability tweet published tagging %s.",
                                ticket.getOfficialTwitterHandles())
                );
                auditLogRepository.save(logEntry);
            } catch (Exception e) {
                log.error("Failed to process Tier-3 escalation for ticket #CA-{}: {}", ticket.getId(), e.getMessage());
            }
        }
    }
}

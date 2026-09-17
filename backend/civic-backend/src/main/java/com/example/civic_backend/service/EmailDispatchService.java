package com.example.civic_backend.service;

import com.example.civic_backend.entity.Ticket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

/**
 * Autonomous Email Dispatch Service.
 * Generates and dispatches legally structured civic grievance and escalation notices
 * to local Ward Officers and Zonal Commissioners.
 */
@Service
public class EmailDispatchService {

    private static final Logger log = LoggerFactory.getLogger(EmailDispatchService.class);
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm:ss");

    private final JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${spring.mail.username:civicadvocate.agent@gmail.com}")
    private String fromEmail;

    public EmailDispatchService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Tier 1 Escalation: Autonomous grievance notice to the local Ward Officer.
     */
    public void dispatchTier1WardNotice(Ticket ticket) {
        String recipient = ticket.getWardOfficerEmail() != null ? ticket.getWardOfficerEmail() : "ward.officer@ghmc.gov.in";
        String subject = String.format("[URGENT TIER-1 GRIEVANCE] #CA-%d: %s at %s - %s",
                ticket.getId(), ticket.getHazardType(), ticket.getMunicipality(), ticket.getWard());

        String googleMapsUrl = String.format("https://www.google.com/maps/search/?api=1&query=%f,%f",
                ticket.getLatitude(), ticket.getLongitude());

        String emailBody = """
            ================================================================================
            OFFICIAL NOTICE OF CIVIC HAZARD & SLA COMMENCEMENT
            CIVICADVOCATE AUTONOMOUS GRIEVANCE ENGINE (AVINYA 2026)
            ================================================================================

            TO: Executive Engineer / Ward Officer (%s)
            JURISDICTION: %s | %s | %s
            DATE & TIME: %s

            GRIEVANCE IDENTIFIER: CA-%d
            HAZARD CLASSIFICATION: %s
            AI SEVERITY ASSESSMENT: %d / 10
            GPS COORDINATES: Latitude %f, Longitude %f
            GEOLOCATION LINK: %s

            DESCRIPTION / CITIZEN REPORT:
            "%s"

            STATUTORY COMPLIANCE WARNING:
            This civic hazard was verified at intake and remains UNRESOLVED after 3 days (72 Hours).
            Pursuant to the Municipal Citizen Charter and Public Safety Regulations, immediate
            field verification and emergency rectification are required within 72 hours.

            FAILURE TO RECTIFY:
            In the absence of a verified status update, the CivicAdvocate Autonomous Agent
            will automatically escalate this ticket to the Zonal Commissioner at T+7 Days.

            Sincerely,
            CivicAdvocate Autonomous Digital Proxy
            Automated Grievance Dispatch Division
            ================================================================================
            """.formatted(
                recipient,
                ticket.getMunicipality(), ticket.getZone(), ticket.getWard(),
                ticket.getCreatedAt().format(DATE_FORMAT),
                ticket.getId(),
                ticket.getHazardType(),
                ticket.getSeverityScore(),
                ticket.getLatitude(), ticket.getLongitude(),
                googleMapsUrl,
                ticket.getDescription() != null ? ticket.getDescription() : "Verified public roadway hazard.",
                recipient
            );

        sendOrLogEmail(recipient, subject, emailBody, "TIER 1 (Ward Officer)");
    }

    /**
     * Tier 2 Escalation: Autonomous notice to Zonal Commissioner citing past delays.
     */
    public void dispatchTier2ZonalEscalation(Ticket ticket) {
        String recipient = ticket.getZonalCommissionerEmail() != null ? ticket.getZonalCommissionerEmail() : "zonalcomm@ghmc.gov.in";
        String subject = String.format("[ESCALATION TIER-2: 7-DAY SLA BREACH] #CA-%d: Unattended %s in %s",
                ticket.getId(), ticket.getHazardType(), ticket.getZone());

        String googleMapsUrl = String.format("https://www.google.com/maps/search/?api=1&query=%f,%f",
                ticket.getLatitude(), ticket.getLongitude());

        String emailBody = """
            ================================================================================
            NOTICE OF ADMINISTRATIVE DELAY & TIER-2 STATUTORY ESCALATION
            CIVICADVOCATE AUTONOMOUS GRIEVANCE ENGINE
            ================================================================================

            TO: Zonal Commissioner (%s)
            ZONE: %s
            WARD: %s (%s)
            DATE OF ESCALATION: %s

            GRIEVANCE IDENTIFIER: CA-%d
            INITIAL REPORTED DATE: %s (7 DAYS ELAPSED WITHOUT RECTIFICATION)
            HAZARD CLASSIFICATION: %s (SEVERITY: %d / 10)
            GEOLOCATION LINK: %s

            EXECUTIVE SUMMARY OF SLA BREACH:
            Tier-1 formal notification was issued to the local Ward Officer on %s.
            To date, no field inspection or closure report has been registered.
            The civic hazard continues to endanger pedestrians and vehicular traffic.

            MANDATORY ACTION REQUESTED:
            1. Issue administrative directive to Circle Executive Engineer.
            2. Dispatch emergency repair unit within 48 hours.

            AUTONOMOUS PROXY ESCALATION CLAUSE:
            Should this issue remain unattended at T+14 Days, the CivicAdvocate Agent
            is scheduled to broadcast a public accountability alert on Twitter/X tagging
            the Principal Secretary (MA&UD) and Municipal Commissioner.

            CivicAdvocate Autonomous Public Governance Agent
            ================================================================================
            """.formatted(
                recipient,
                ticket.getZone(),
                ticket.getWard(), ticket.getMunicipality(),
                java.time.LocalDateTime.now().format(DATE_FORMAT),
                ticket.getId(),
                ticket.getCreatedAt().format(DATE_FORMAT),
                ticket.getHazardType(), ticket.getSeverityScore(),
                googleMapsUrl,
                ticket.getCreatedAt().plusDays(3).format(DATE_FORMAT)
            );

        sendOrLogEmail(recipient, subject, emailBody, "TIER 2 (Zonal Commissioner)");
    }

    private void sendOrLogEmail(String to, String subject, String body, String tier) {
        if (mailEnabled && mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(to);
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
                log.info("DISPATCHED REAL EMAIL [{}] to {}", tier, to);
                return;
            } catch (Exception e) {
                log.warn("Failed to send real email via SMTP: {}. Falling back to structured log.", e.getMessage());
            }
        }

        // Hackathon Demo / Local structured logging mode
        log.info("""
            \n==================== [OUTBOUND EMAIL DISPATCH: {}] ====================
            TO: {}
            FROM: {}
            SUBJECT: {}
            ------------------------------------------------------------------------
            {}
            ========================================================================""",
            tier, to, fromEmail, subject, body);
    }
}

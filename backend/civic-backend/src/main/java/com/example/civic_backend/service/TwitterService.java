package com.example.civic_backend.service;

import com.example.civic_backend.entity.Ticket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Autonomous Social Accountability Agent (Twitter/X API v2).
 * Broadcasts public accountability alerts tagging municipal and governmental handles
 * when civic grievances remain neglected past the 14-day SLA deadline.
 */
@Service
public class TwitterService {

    private static final Logger log = LoggerFactory.getLogger(TwitterService.class);

    private final RestTemplate restTemplate;

    @Value("${app.twitter.enabled:false}")
    private boolean twitterEnabled;

    @Value("${app.twitter.bearer-token:}")
    private String bearerToken;

    public TwitterService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Tier 3 Escalation: Broadcasts a public accountability alert on Twitter/X.
     */
    public String publishPublicAccountabilityAlert(Ticket ticket) {
        String tweetText = String.format(
            "🚨 CIVIC ALERT: #CA-%d | Severe %s (Severity: %d/10) at %s (%s) has been UNRESOLVED for 14 DAYS despite Ward & Zonal notices.\n\n" +
            "📍 Loc: %f, %f\n" +
            "CC: %s\n" +
            "#CivicAdvocate #SmartCity #PublicSafety #Avinya2026",
            ticket.getId(),
            ticket.getHazardType(),
            ticket.getSeverityScore(),
            ticket.getMunicipality(),
            ticket.getWard(),
            ticket.getLatitude(),
            ticket.getLongitude(),
            ticket.getOfficialTwitterHandles() != null ? ticket.getOfficialTwitterHandles() : "@GHMCOnline @TelanganaMAUD"
        );

        // Truncate to 280 characters if needed
        if (tweetText.length() > 280) {
            tweetText = tweetText.substring(0, 277) + "...";
        }

        if (twitterEnabled && bearerToken != null && !bearerToken.isBlank()) {
            try {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(bearerToken);

                HttpEntity<Map<String, String>> request = new HttpEntity<>(Map.of("text", tweetText), headers);
                String twitterEndpoint = "https://api.twitter.com/2/tweets";
                restTemplate.postForEntity(twitterEndpoint, request, String.class);
                log.info("PUBLIC TWEET PUBLISHED SUCCESSFULLY via Twitter API v2: {}", tweetText);
                return tweetText;
            } catch (Exception e) {
                log.warn("Failed to dispatch tweet to Twitter API v2: {}. Falling back to structured log.", e.getMessage());
            }
        }

        // Hackathon Demo Mode: Log structured tweet
        log.info("""
            \n==================== [PUBLIC TWITTER/X ACCOUNTABILITY DISPATCH] ====================
            HANDLE TAGGED: {}
            STATUS: TIER_3_TWEETED
            TWEET PAYLOAD:
            {}
            =================================================================================""",
            ticket.getOfficialTwitterHandles(), tweetText);

        return tweetText;
    }
}

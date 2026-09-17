package com.example.civic_backend.controller;

import com.example.civic_backend.dto.TicketDtos;
import com.example.civic_backend.service.TicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * REST Controller for Citizen Grievance Intake, Auditing, and Lifecycle operations.
 */
@RestController
@RequestMapping("/api/v1/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    /**
     * Intake & Verification Endpoint (T=0).
     * Consumes multipart/form-data containing photo, latitude, and longitude.
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TicketDtos.IngestResponse> createTicket(
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "citizenContact", required = false) String citizenContact) {

        TicketDtos.IngestResponse response = ticketService.ingestGrievance(
                image, latitude, longitude, description, citizenContact);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Intake & Verification Endpoint (T=0) via JSON.
     * Consumes application/json containing latitude, longitude, and optional metadata.
     */
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TicketDtos.IngestResponse> createTicketJson(
            @RequestBody TicketDtos.IngestRequest request) {

        TicketDtos.IngestResponse response = ticketService.ingestGrievanceJson(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Timeline Audit Endpoint.
     * Returns an ordered chronologically ascending list of all audit trail entries for a ticket.
     */
    @GetMapping("/{id}/timeline")
    public ResponseEntity<TicketDtos.TimelineResponse> getTicketTimeline(@PathVariable("id") Long id) {
        TicketDtos.TimelineResponse timeline = ticketService.getTimeline(id);
        return ResponseEntity.ok(timeline);
    }

    /**
     * Detailed Ticket View.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TicketDtos.TicketDetailResponse> getTicketDetail(@PathVariable("id") Long id) {
        TicketDtos.TicketDetailResponse detail = ticketService.getTicketDetails(id);
        return ResponseEntity.ok(detail);
    }

    /**
     * List all reported tickets ordered newest first.
     */
    @GetMapping
    public ResponseEntity<List<TicketDtos.TicketSummaryResponse>> listAllTickets() {
        List<TicketDtos.TicketSummaryResponse> tickets = ticketService.getAllTickets();
        return ResponseEntity.ok(tickets);
    }

    /**
     * Marks a ticket as resolved.
     */
    @PatchMapping("/{id}/resolve")
    public ResponseEntity<TicketDtos.ResolveResponse> resolveTicket(
            @PathVariable("id") Long id,
            @RequestParam(value = "remarks", required = false) String remarks) {
        TicketDtos.ResolveResponse response = ticketService.resolveTicket(id, remarks);
        return ResponseEntity.ok(response);
    }
}

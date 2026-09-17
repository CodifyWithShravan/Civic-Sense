package com.example.civic_backend.controller;

import com.example.civic_backend.dto.TicketDtos;
import com.example.civic_backend.service.SimulationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for the Hackathon Demo Time-Travel Warp Engine.
 * Enables live fast-forwarding of ticket timestamps to demonstrate 14 days
 * of autonomous SLA escalation during a 3-minute pitch.
 */
@RestController
@RequestMapping("/api/v1/simulation")
@CrossOrigin(origins = "*")
public class SimulationController {

    private final SimulationService simulationService;

    public SimulationController(SimulationService simulationService) {
        this.simulationService = simulationService;
    }

    /**
     * Advances ticket age by X days and triggers immediate escalation tier logic.
     * Supports both JSON body: {"days": 3} and Query parameter: ?days=3.
     */
    @PostMapping("/tickets/{id}/advance")
    public ResponseEntity<TicketDtos.AdvanceResponse> advanceTicket(
            @PathVariable("id") Long id,
            @RequestBody(required = false) TicketDtos.AdvanceRequest request,
            @RequestParam(value = "days", required = false) Integer queryDays) {

        int daysToAdvance;
        if (request != null && request.days() != null) {
            daysToAdvance = request.days();
        } else if (queryDays != null) {
            daysToAdvance = queryDays;
        } else {
            daysToAdvance = 3; // Default sensible increment
        }

        TicketDtos.AdvanceResponse response = simulationService.advanceTicketTime(id, daysToAdvance);
        return ResponseEntity.ok(response);
    }
}

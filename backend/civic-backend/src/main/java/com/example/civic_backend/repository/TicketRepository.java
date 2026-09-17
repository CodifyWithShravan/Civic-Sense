package com.example.civic_backend.repository;

import com.example.civic_backend.entity.Ticket;
import com.example.civic_backend.entity.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Spring Data JPA repository for Ticket entities.
 */
@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    /**
     * Finds all tickets currently in a given status that were created before the SLA threshold cutoff.
     */
    List<Ticket> findByStatusAndCreatedAtBefore(TicketStatus status, LocalDateTime threshold);

    /**
     * Retrieves all tickets ordered by creation date descending.
     */
    List<Ticket> findAllByOrderByCreatedAtDesc();

    /**
     * Retrieves tickets by municipality name.
     */
    List<Ticket> findByMunicipality(String municipality);

    /**
     * Counts tickets by status for dashboard statistics.
     */
    long countByStatus(TicketStatus status);
}

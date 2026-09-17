package com.example.civic_backend.repository;

import com.example.civic_backend.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for immutable AuditLog entries.
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    /**
     * Retrieves chronological audit history for a specific ticket.
     */
    List<AuditLog> findByTicketIdOrderByTimestampAsc(Long ticketId);

    /**
     * Retrieves reverse-chronological audit history for a specific ticket.
     */
    List<AuditLog> findByTicketIdOrderByTimestampDesc(Long ticketId);
}

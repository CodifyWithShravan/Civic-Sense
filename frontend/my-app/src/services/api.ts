import {
  IngestRequest,
  IngestResponse,
  TimelineResponse,
  TicketSummary,
  TicketDetail,
  AdvanceResponse,
  ResolveResponse,
} from '@/types/api';
import { Platform } from 'react-native';

// Default host: localhost for iOS Simulator/Web, 10.0.2.2 for Android Emulator
const defaultHost = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

let currentBaseUrl = defaultHost;

export const getApiBaseUrl = () => currentBaseUrl;

export const setApiBaseUrl = (newUrl: string) => {
  currentBaseUrl = newUrl.replace(/\/$/, '');
};

/**
 * Submits a new civic hazard grievance via multipart/form-data.
 */
export async function createTicket(formData: FormData): Promise<IngestResponse> {
  const response = await fetch(`${currentBaseUrl}/api/v1/tickets`, {
    method: 'POST',
    body: formData,
    // Note: Do NOT set Content-Type header manually when sending FormData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create ticket (${response.status}): ${errorText}`);
  }

  return await response.json();
}

/**
 * Submits a new civic hazard grievance via JSON.
 */
export async function createTicketJson(payload: IngestRequest): Promise<IngestResponse> {
  const response = await fetch(`${currentBaseUrl}/api/v1/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create ticket (${response.status}): ${errorText}`);
  }

  return await response.json();
}

/**
 * Retrieves the full chronological audit timeline for a grievance.
 */
export async function getTimeline(ticketId: number): Promise<TimelineResponse> {
  const response = await fetch(`${currentBaseUrl}/api/v1/tickets/${ticketId}/timeline`);
  if (!response.ok) {
    throw new Error(`Failed to fetch timeline: ${response.statusText}`);
  }
  return await response.json();
}

/**
 * Retrieves all reported tickets, newest first.
 */
export async function getTickets(): Promise<TicketSummary[]> {
  const response = await fetch(`${currentBaseUrl}/api/v1/tickets`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tickets: ${response.statusText}`);
  }
  return await response.json();
}

/**
 * Retrieves full details for a single ticket.
 */
export async function getTicketDetail(ticketId: number): Promise<TicketDetail> {
  const response = await fetch(`${currentBaseUrl}/api/v1/tickets/${ticketId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ticket #${ticketId}: ${response.statusText}`);
  }
  return await response.json();
}

/**
 * Hackathon Simulation Warp: fast-forwards ticket age by X days.
 */
export async function advanceTicketTime(ticketId: number, days: number): Promise<AdvanceResponse> {
  const response = await fetch(`${currentBaseUrl}/api/v1/simulation/tickets/${ticketId}/advance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ days }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to advance ticket time: ${errorText}`);
  }

  return await response.json();
}

/**
 * Resolves a ticket with field remarks.
 */
export async function resolveTicket(ticketId: number, remarks?: string): Promise<ResolveResponse> {
  const url = `${currentBaseUrl}/api/v1/tickets/${ticketId}/resolve${
    remarks ? `?remarks=${encodeURIComponent(remarks)}` : ''
  }`;
  const response = await fetch(url, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error(`Failed to resolve ticket: ${response.statusText}`);
  }

  return await response.json();
}

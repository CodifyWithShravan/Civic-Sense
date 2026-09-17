export type TicketStatus =
  | 'SUBMITTED'
  | 'TIER_1_ESCALATED'
  | 'TIER_2_ESCALATED'
  | 'TIER_3_TWEETED'
  | 'RESOLVED'
  | 'REJECTED';

export interface AuditLogItem {
  id: number;
  fromStatus: TicketStatus | null;
  toStatus: TicketStatus;
  action: string;
  actor: string;
  details: string;
  timestamp: string;
}

export interface IngestRequest {
  latitude: number;
  longitude: number;
  description?: string;
  citizenContact?: string;
  imageUrl?: string;
}

export interface IngestResponse {
  id: number;
  title: string;
  hazardType: string;
  status: TicketStatus;
  municipality: string;
  ward: string;
  zone: string;
  severityScore: number;
  imageUrl: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface TimelineResponse {
  ticketId: number;
  title: string;
  currentStatus: TicketStatus;
  municipality: string;
  ward: string;
  timeline: AuditLogItem[];
}

export interface TicketSummary {
  id: number;
  title: string;
  hazardType: string;
  status: TicketStatus;
  municipality: string;
  ward: string;
  severityScore: number;
  imageUrl: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface TicketDetail extends TicketSummary {
  description: string;
  zone: string;
  wardOfficerEmail: string;
  zonalCommissionerEmail: string;
  officialTwitterHandles: string;
  citizenContact?: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface AdvanceResponse {
  ticketId: number;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
  daysShifted: number;
  message: string;
  simulatedCreatedAt: string;
  newActions: AuditLogItem[];
}

export interface ResolveResponse {
  ticketId: number;
  status: TicketStatus;
  message: string;
  resolvedAt: string;
}

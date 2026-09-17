export type TicketStatus =
  | 'SUBMITTED'
  | 'TIER_1_ESCALATED'
  | 'TIER_2_ESCALATED'
  | 'TIER_3_TWEETED'
  | 'RESOLVED'
  | 'REJECTED';

<<<<<<< HEAD
=======
export type HazardType =
  | 'ELECTRICAL_HAZARD'
  | 'POTHOLE'
  | 'OPEN_MANHOLE'
  | 'GARBAGE_OVERFLOW'
  | 'STREETLIGHT_DEFECT'
  | 'WATERLOGGING';

>>>>>>> a9fd93c (Done with frontend)
export interface AuditLogItem {
  id: number;
  fromStatus: TicketStatus | null;
  toStatus: TicketStatus;
  action: string;
  actor: string;
  details: string;
  timestamp: string;
}

<<<<<<< HEAD
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
=======
export interface Ticket {
  id: number;
  title: string;
  hazardType: HazardType | string;
>>>>>>> a9fd93c (Done with frontend)
  status: TicketStatus;
  municipality: string;
  ward: string;
  zone: string;
  severityScore: number;
  imageUrl: string;
  latitude: number;
  longitude: number;
  createdAt: string;
<<<<<<< HEAD
=======
  description?: string;
  citizenContact?: string;
  // Dynamic swarm dispatch metadata
  botDispatchId?: string;
  etaMinutes?: number;
  consensusScore?: number;
  stage?: 1 | 2 | 3 | 4 | 5;
>>>>>>> a9fd93c (Done with frontend)
}

export interface TimelineResponse {
  ticketId: number;
  title: string;
  currentStatus: TicketStatus;
  municipality: string;
  ward: string;
  timeline: AuditLogItem[];
}

<<<<<<< HEAD
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
=======
export interface SimulationAdvanceResponse {
>>>>>>> a9fd93c (Done with frontend)
  ticketId: number;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
  daysShifted: number;
  message: string;
  simulatedCreatedAt: string;
  newActions: AuditLogItem[];
}

<<<<<<< HEAD
export interface ResolveResponse {
  ticketId: number;
  status: TicketStatus;
  message: string;
  resolvedAt: string;
=======
export interface CitizenNode {
  name: string;
  nodeId: string;
  ward: string;
  district: string;
  consensusScore: number;
  phoneOrEmail: string;
  alertsEnabled: boolean;
  consensusProtocolEnabled: boolean;
  version: string;
>>>>>>> a9fd93c (Done with frontend)
}

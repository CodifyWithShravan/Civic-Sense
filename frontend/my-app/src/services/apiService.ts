import {
  AuditLogItem,
  SimulationAdvanceResponse,
  Ticket,
  TicketStatus,
  TimelineResponse,
} from '@/types/api';

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

// Default initial tickets matching the design mockup (Image 3)
const initialTickets: Ticket[] = [
  {
    id: 101,
    title: 'Exposed Electrical Conduit',
    hazardType: 'ELECTRICAL_HAZARD',
    status: 'SUBMITTED',
    municipality: 'District Municipal Works',
    ward: 'Ward 04 — Mission/SoMa Corridor',
    zone: 'South of Market Zone',
    severityScore: 9,
    imageUrl:
      'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=600&q=80',
    latitude: 37.7818,
    longitude: -122.4048,
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    description: 'Damaged power conduit sparking near pedestrian crossing on 4th & Mission.',
    citizenContact: 'shravan@civicpulse.org',
    botDispatchId: '#0482',
    etaMinutes: 18,
    consensusScore: 98,
    stage: 2,
  },
  {
    id: 102,
    title: 'Severe Pothole & Subsurface Void',
    hazardType: 'POTHOLE',
    status: 'TIER_1_ESCALATED',
    municipality: 'District Municipal Works',
    ward: 'Ward 04 — Mission/SoMa Corridor',
    zone: 'South of Market Zone',
    severityScore: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    latitude: 37.7832,
    longitude: -122.4075,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Deep road cavity causing vehicular tire damage and cyclist falls.',
    citizenContact: 'shravan@civicpulse.org',
    botDispatchId: '#0219',
    etaMinutes: 45,
    consensusScore: 94,
    stage: 3,
  },
];

const initialTimelines: Record<number, AuditLogItem[]> = {
  101: [
    {
      id: 1,
      fromStatus: null,
      toStatus: 'SUBMITTED',
      action: 'TICKET_CREATED',
      actor: 'CITIZEN_MOBILE',
      details:
        'Hazard ingested via mobile client. AI Vision verified ELECTRICAL_HAZARD with severity 9/10.',
      timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      fromStatus: 'SUBMITTED',
      toStatus: 'SUBMITTED',
      action: 'INTAKE_VERIFIED',
      actor: 'AUTONOMOUS_VISION_AGENT',
      details:
        'Sub-second edge analysis confirmed exposed conduit wiring. Geolocation verified within Ward 04.',
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      fromStatus: 'SUBMITTED',
      toStatus: 'SUBMITTED',
      action: 'BOT_DISPATCH_EN_ROUTE',
      actor: 'SWARM_DISPATCH_BOT',
      details:
        'Municipal Autonomous Bot Dispatch #0482 routing emergency repair crew. ETA 18 minutes.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
  ],
  102: [
    {
      id: 1,
      fromStatus: null,
      toStatus: 'SUBMITTED',
      action: 'TICKET_CREATED',
      actor: 'CITIZEN_MOBILE',
      details: 'Pothole detected via high-res camera. Severity calculated as 8/10.',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      fromStatus: 'SUBMITTED',
      toStatus: 'TIER_1_ESCALATED',
      action: 'WARD_OFFICER_NOTIFIED',
      actor: 'AUTONOMOUS_SLA_AGENT',
      details:
        'SLA Tier 1 breached (>3 days). Autonomous grievance email dispatched to ward04.officer@civicpulse.org.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

// In-memory persistent state store for frontend session
let ticketsState: Ticket[] = [...initialTickets];
let timelinesState: Record<number, AuditLogItem[]> = { ...initialTimelines };

export const apiService = {
  async getTickets(): Promise<Ticket[]> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/tickets`, {
        signal: AbortSignal.timeout(1500),
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // Fallback to local state
    }
    return [...ticketsState];
  },

  async getTicket(id: number): Promise<Ticket | null> {
    const local = ticketsState.find((t) => t.id === id);
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/tickets/${id}`, {
        signal: AbortSignal.timeout(1500),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback to local state
    }
    return local || null;
  },

  async getTimeline(ticketId: number): Promise<TimelineResponse> {
    const ticket = ticketsState.find((t) => t.id === ticketId);
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/tickets/${ticketId}/timeline`, {
        signal: AbortSignal.timeout(1500),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback
    }

    return {
      ticketId,
      title: ticket?.title || 'Civic Grievance',
      currentStatus: ticket?.status || 'SUBMITTED',
      municipality: ticket?.municipality || 'District Municipal Works',
      ward: ticket?.ward || 'Ward 04 — Mission/SoMa Corridor',
      timeline: timelinesState[ticketId] || [],
    };
  },

  async createTicket(payload: {
    title: string;
    hazardType: string;
    latitude: number;
    longitude: number;
    severityScore: number;
    description?: string;
    imageUrl?: string;
    citizenContact?: string;
  }): Promise<Ticket> {
    const newId = Date.now() % 10000;
    const newTicket: Ticket = {
      id: newId,
      title: payload.title,
      hazardType: payload.hazardType,
      status: 'SUBMITTED',
      municipality: 'District Municipal Works',
      ward: 'Ward 04 — Mission/SoMa Corridor',
      zone: 'South of Market Zone',
      severityScore: payload.severityScore,
      imageUrl:
        payload.imageUrl ||
        'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=600&q=80',
      latitude: payload.latitude,
      longitude: payload.longitude,
      createdAt: new Date().toISOString(),
      description: payload.description,
      citizenContact: payload.citizenContact || 'shravan@civicpulse.org',
      botDispatchId: `#${Math.floor(1000 + Math.random() * 9000)}`,
      etaMinutes: Math.floor(12 + Math.random() * 20),
      consensusScore: 98,
      stage: 1,
    };

    timelinesState[newId] = [
      {
        id: 1,
        fromStatus: null,
        toStatus: 'SUBMITTED',
        action: 'TICKET_CREATED',
        actor: 'CITIZEN_MOBILE',
        details: `Hazard ingested via mobile client. AI Vision verified ${payload.hazardType} with severity ${payload.severityScore}/10.`,
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        fromStatus: 'SUBMITTED',
        toStatus: 'SUBMITTED',
        action: 'VISION_GEO_VERIFIED',
        actor: 'AUTONOMOUS_VISION_AGENT',
        details: `Sub-second edge analysis confirmed hazard. Geolocation pinned at ${payload.latitude.toFixed(4)}, ${payload.longitude.toFixed(4)}.`,
        timestamp: new Date().toISOString(),
      },
    ];

    ticketsState = [newTicket, ...ticketsState];

    try {
      const formData = new FormData();
      formData.append('latitude', String(payload.latitude));
      formData.append('longitude', String(payload.longitude));
      formData.append('description', payload.description || payload.title);
      formData.append('citizenContact', payload.citizenContact || 'citizen@civicpulse.org');

      const response = await fetch(`${BACKEND_URL}/api/v1/tickets`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(2000),
      });
      if (response.ok) {
        const liveTicket = await response.json();
        return liveTicket;
      }
    } catch {
      // Offline mode fallback handled above
    }

    return newTicket;
  },

  async advanceSimulation(ticketId: number, days: number): Promise<SimulationAdvanceResponse> {
    const ticket = ticketsState.find((t) => t.id === ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const previousStatus = ticket.status;
    let newStatus: TicketStatus = previousStatus;
    let stage: 1 | 2 | 3 | 4 | 5 = ticket.stage || 2;
    let action = 'SLA_ADVANCE';
    let actor = 'SIMULATION_WARP_AGENT';
    let details = `Simulation fast-forward: ${days} days shifted.`;

    if (days >= 7 || previousStatus === 'TIER_2_ESCALATED') {
      newStatus = 'TIER_3_TWEETED';
      stage = 4;
      action = 'TWITTER_ACCOUNTABILITY_ALERT';
      actor = 'AUTONOMOUS_TWITTER_BOT';
      details = `SLA Tier 3 reached (>14d). Public alert published tagging @CityHall & @MunicipalWorks citing unresolved ${ticket.title} at ${ticket.ward}.`;
    } else if (days >= 4 || previousStatus === 'TIER_1_ESCALATED') {
      newStatus = 'TIER_2_ESCALATED';
      stage = 3;
      action = 'ZONAL_COMMISSIONER_ESCALATED';
      actor = 'AUTONOMOUS_SLA_AGENT';
      details = `SLA Tier 2 breached (>7d). High-priority administrative escalation notice dispatched to Zonal Commissioner citing past delays.`;
    } else if (days >= 3 || previousStatus === 'SUBMITTED') {
      newStatus = 'TIER_1_ESCALATED';
      stage = 3;
      action = 'WARD_OFFICER_NOTIFIED';
      actor = 'AUTONOMOUS_SLA_AGENT';
      details = `SLA Tier 1 breached (>3d). Autonomous grievance dossier emailed to Ward Officer with 72h rectification order.`;
    }

    ticket.status = newStatus;
    ticket.stage = stage;

    const newLogItem: AuditLogItem = {
      id: (timelinesState[ticketId]?.length || 0) + 1,
      fromStatus: previousStatus,
      toStatus: newStatus,
      action,
      actor,
      details,
      timestamp: new Date().toISOString(),
    };

    timelinesState[ticketId] = [...(timelinesState[ticketId] || []), newLogItem];

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/simulation/tickets/${ticketId}/advance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days }),
        signal: AbortSignal.timeout(2000),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Mock warp response
    }

    return {
      ticketId,
      previousStatus,
      newStatus,
      daysShifted: days,
      message: `Fast-forwarded ticket #${ticketId} by ${days} days. Triggered ${newStatus}.`,
      simulatedCreatedAt: new Date(Date.now() - days * 24 * 3600 * 1000).toISOString(),
      newActions: [newLogItem],
    };
  },

  async resolveTicket(ticketId: number): Promise<Ticket> {
    const ticket = ticketsState.find((t) => t.id === ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const previousStatus = ticket.status;
    ticket.status = 'RESOLVED';
    ticket.stage = 5;

    const resolveItem: AuditLogItem = {
      id: (timelinesState[ticketId]?.length || 0) + 1,
      fromStatus: previousStatus,
      toStatus: 'RESOLVED',
      action: 'HAZARD_RESOLVED',
      actor: 'MUNICIPAL_FIELD_CREW',
      details:
        'Field crew #0482 completed on-site rectification. Photographic proof validated by Autonomous Vision Agent.',
      timestamp: new Date().toISOString(),
    };

    timelinesState[ticketId] = [...(timelinesState[ticketId] || []), resolveItem];

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/tickets/${ticketId}/resolve`, {
        method: 'PATCH',
        signal: AbortSignal.timeout(2000),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Mock resolution
    }

    return ticket;
  },
};

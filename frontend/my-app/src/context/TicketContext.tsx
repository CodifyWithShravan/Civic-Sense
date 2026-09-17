import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Ticket, SimulationAdvanceResponse, TimelineResponse } from '@/types/api';
import { apiService } from '@/services/apiService';

interface TicketContextType {
  tickets: Ticket[];
  loading: boolean;
  selectedStage: number | null;
  setSelectedStage: (stage: number | null) => void;
  activeTicketId: number | null;
  setActiveTicketId: (id: number | null) => void;
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  activeTicket: Ticket | null;
  activeTimeline: TimelineResponse | null;
  timelineLoading: boolean;
  refreshTickets: () => Promise<void>;
  createReport: (payload: {
    title: string;
    hazardType: string;
    latitude: number;
    longitude: number;
    severityScore: number;
    description?: string;
    imageUrl?: string;
  }) => Promise<Ticket>;
  advanceWarp: (ticketId: number, days: number) => Promise<SimulationAdvanceResponse>;
  resolveHazard: (ticketId: number) => Promise<void>;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function TicketProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [activeTicketId, setActiveTicketId] = useState<number | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [activeTimeline, setActiveTimeline] = useState<TimelineResponse | null>(null);
  const [timelineLoading, setTimelineLoading] = useState<boolean>(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTickets();
      setTickets(data);
    } catch {
      // Handled in apiService
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (activeTicketId) {
      setTimelineLoading(true);
      apiService
        .getTimeline(activeTicketId)
        .then((res) => {
          setActiveTimeline(res);
        })
        .finally(() => {
          setTimelineLoading(false);
        });
    } else {
      setActiveTimeline(null);
    }
  }, [activeTicketId]);

  const activeTicket = tickets.find((t) => t.id === activeTicketId) || null;

  const createReport = async (payload: {
    title: string;
    hazardType: string;
    latitude: number;
    longitude: number;
    severityScore: number;
    description?: string;
    imageUrl?: string;
  }): Promise<Ticket> => {
    const created = await apiService.createTicket(payload);
    await fetchTickets();
    setActiveTicketId(created.id);
    return created;
  };

  const advanceWarp = async (
    ticketId: number,
    days: number
  ): Promise<SimulationAdvanceResponse> => {
    const result = await apiService.advanceSimulation(ticketId, days);
    await fetchTickets();
    const updatedTimeline = await apiService.getTimeline(ticketId);
    setActiveTimeline(updatedTimeline);
    return result;
  };

  const resolveHazard = async (ticketId: number) => {
    await apiService.resolveTicket(ticketId);
    await fetchTickets();
    const updatedTimeline = await apiService.getTimeline(ticketId);
    setActiveTimeline(updatedTimeline);
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        loading,
        selectedStage,
        setSelectedStage,
        activeTicketId,
        setActiveTicketId,
        isScannerOpen,
        setIsScannerOpen,
        activeTicket,
        activeTimeline,
        timelineLoading,
        refreshTickets: fetchTickets,
        createReport,
        advanceWarp,
        resolveHazard,
      }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets(): TicketContextType {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}

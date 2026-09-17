import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { LightningIcon, MapPinIcon } from '../civic-icons';
import { CivicPillBadge } from '../civic-ui';
import { useTickets } from '@/context/TicketContext';
import { TicketStatus } from '@/types/api';

export default function TicketDetailModal() {
  const {
    activeTicket,
    activeTicketId,
    setActiveTicketId,
    activeTimeline,
    timelineLoading,
    advanceWarp,
    resolveHazard,
  } = useTickets();

  const [warpMessage, setWarpMessage] = useState<string | null>(null);
  const [isWarping, setIsWarping] = useState(false);

  if (!activeTicketId || !activeTicket) return null;

  const handleAdvance = async (days: number) => {
    try {
      setIsWarping(true);
      const res = await advanceWarp(activeTicket.id, days);
      setWarpMessage(res.message);
      setTimeout(() => setWarpMessage(null), 5000);
    } catch {
      // Error
    } finally {
      setIsWarping(false);
    }
  };

  const handleResolve = async () => {
    try {
      setIsWarping(true);
      await resolveHazard(activeTicket.id);
      setWarpMessage('Hazard resolved by Municipal Field Crew. photographic proof verified.');
      setTimeout(() => setWarpMessage(null), 5000);
    } catch {
      // Error
    } finally {
      setIsWarping(false);
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return { bg: '#E0F2FE', text: '#0284C7' };
      case 'TIER_1_ESCALATED':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'TIER_2_ESCALATED':
        return { bg: '#FFEDD5', text: '#EA580C' };
      case 'TIER_3_TWEETED':
        return { bg: '#FEE2E2', text: '#DC2626' };
      case 'RESOLVED':
        return { bg: '#DCFCE7', text: '#16A34A' };
      default:
        return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  const statusStyle = getStatusColor(activeTicket.status);

  return (
    <Modal visible={!!activeTicketId} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setActiveTicketId(null)}>
            <Text style={styles.closeText}>✕ Close</Text>
          </TouchableOpacity>
          <CivicPillBadge
            text={`TICKET #${activeTicket.id}`}
            dot={true}
            dotColor="#18181B"
            style={{ backgroundColor: '#E5E7EB' }}
          />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Banner */}
          <View style={styles.heroBanner}>
            <Image source={{ uri: activeTicket.imageUrl }} style={styles.heroImage} />
            <View style={styles.heroOverlay}>
              <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
                  {activeTicket.status.replace(/_/g, ' ')}
                </Text>
              </View>
              <Text style={styles.heroTitle}>{activeTicket.title}</Text>
              <View style={styles.locationRow}>
                <MapPinIcon size={12} color="#D4D4D8" />
                <Text style={styles.locationText}>{activeTicket.ward}</Text>
              </View>
            </View>
          </View>

          {/* Hackathon Time-Travel Warp Controller (Phase 4 / Demo Script) */}
          <View style={styles.warpCard}>
            <View style={styles.warpHeader}>
              <View style={styles.warpTitleRow}>
                <LightningIcon size={14} color="#FBBF24" />
                <Text style={styles.warpTitle}>TIME-WARP CONTROLLER (DEMO)</Text>
              </View>
              <Text style={styles.warpSubtitle}>Fast-forward SLA escalation</Text>
            </View>

            {warpMessage && (
              <View style={styles.warpAlert}>
                <Text style={styles.warpAlertText}>{warpMessage}</Text>
              </View>
            )}

            <View style={styles.warpButtonsRow}>
              <TouchableOpacity
                style={[styles.warpBtn, activeTicket.status === 'SUBMITTED' && styles.warpBtnHighlight]}
                onPress={() => handleAdvance(3)}
                disabled={isWarping || activeTicket.status === 'RESOLVED'}>
                <Text style={styles.warpBtnText}>+3 Days</Text>
                <Text style={styles.warpBtnSub}>Ward Officer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.warpBtn, activeTicket.status === 'TIER_1_ESCALATED' && styles.warpBtnHighlight]}
                onPress={() => handleAdvance(4)}
                disabled={isWarping || activeTicket.status === 'RESOLVED'}>
                <Text style={styles.warpBtnText}>+4 Days</Text>
                <Text style={styles.warpBtnSub}>Zonal Comm.</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.warpBtn, activeTicket.status === 'TIER_2_ESCALATED' && styles.warpBtnHighlight]}
                onPress={() => handleAdvance(7)}
                disabled={isWarping || activeTicket.status === 'RESOLVED'}>
                <Text style={styles.warpBtnText}>+7 Days</Text>
                <Text style={styles.warpBtnSub}>Twitter/X Alert</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.warpBtn, styles.resolveBtn]}
                onPress={handleResolve}
                disabled={isWarping || activeTicket.status === 'RESOLVED'}>
                <Text style={styles.resolveBtnText}>✓ Resolve</Text>
                <Text style={styles.warpBtnSub}>Field Crew</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Grievance Metrics */}
          <View style={styles.metaCard}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Severity Score:</Text>
              <Text style={styles.metaValHighlight}>{activeTicket.severityScore}/10 (High Priority)</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Autonomous Bot Dispatch:</Text>
              <Text style={styles.metaVal}>{activeTicket.botDispatchId || '#0482'} (En Route)</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Estimated Field Arrival:</Text>
              <Text style={styles.metaVal}>{activeTicket.etaMinutes || 18} mins</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Decentralized Consensus:</Text>
              <Text style={styles.metaVal}>98% Block Approval</Text>
            </View>
          </View>

          {/* Immutable Audit Ledger */}
          <Text style={styles.timelineSectionTitle}>Immutable Audit Ledger & SLA Tracker</Text>

          {timelineLoading ? (
            <ActivityIndicator size="small" color="#18181B" style={{ marginVertical: 20 }} />
          ) : (
            <View style={styles.timelineList}>
              {activeTimeline?.timeline.map((item, index) => {
                const isLatest = index === activeTimeline.timeline.length - 1;
                return (
                  <View key={item.id || index} style={styles.timelineItem}>
                    {/* Stepper column */}
                    <View style={styles.stepColumn}>
                      <View
                        style={[
                          styles.stepDot,
                          isLatest ? styles.stepDotLatest : styles.stepDotCompleted,
                        ]}
                      />
                      {!isLatest && <View style={styles.stepConnector} />}
                    </View>

                    {/* Step details */}
                    <View style={styles.stepContent}>
                      <View style={styles.stepHeaderRow}>
                        <View style={styles.actorPill}>
                          <Text style={styles.actorText}>{item.actor}</Text>
                        </View>
                        <Text style={styles.timestampText}>
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                      <Text style={styles.actionTitle}>{item.action.replace(/_/g, ' ')}</Text>
                      <Text style={styles.stepDetails}>{item.details}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  scrollContent: {
    padding: 20,
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  heroBanner: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000000',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#D4D4D8',
  },
  warpCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  warpHeader: {
    marginBottom: 12,
  },
  warpTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  warpTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.8,
  },
  warpSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  warpAlert: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  warpAlertText: {
    fontSize: 11,
    color: '#FDE68A',
    fontWeight: '600',
  },
  warpButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  warpBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  warpBtnHighlight: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  resolveBtn: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: '#22C55E',
  },
  warpBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  resolveBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4ADE80',
  },
  warpBtnSub: {
    fontSize: 9,
    color: '#CBD5E1',
    marginTop: 2,
  },
  metaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  metaVal: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '700',
  },
  metaValHighlight: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '800',
  },
  timelineSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 14,
  },
  timelineList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepColumn: {
    alignItems: 'center',
    width: 24,
    marginRight: 10,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  stepDotCompleted: {
    backgroundColor: '#10B981',
  },
  stepDotLatest: {
    backgroundColor: '#F59E0B',
  },
  stepConnector: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 4,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  actorPill: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  actorText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
  },
  timestampText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  stepDetails: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
});

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';
import {
  CivicPulseLogo,
  BellIcon,
  UserAvatarIcon,
  LightningIcon,
  ShieldLockIcon,
  SpeedometerIcon,
  CameraIcon,
  MapPinIcon,
} from '../civic-icons';
import { CivicPillBadge } from '../civic-ui';
import { useAuth } from '@/context/AuthContext';
import { useTickets } from '@/context/TicketContext';
import { Ticket } from '@/types/api';

const CONDUIT_IMAGE =
  'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=400&q=80';

export default function DashboardScreen({ onOpenMap }: { onOpenMap?: () => void }) {
  const { user } = useAuth();
  const {
    tickets,
    selectedStage,
    setSelectedStage,
    setActiveTicketId,
    setIsScannerOpen,
  } = useTickets();

  // Workflow 5 stages definition
  const stages = [
    { number: 1, label: 'Report' },
    { number: 2, label: 'Verify' },
    { number: 3, label: 'Prioritize' },
    { number: 4, label: 'Assigned' },
    { number: 5, label: 'Resolved' },
  ];

  // Filtered tickets based on selected stage
  const filteredTickets = selectedStage
    ? tickets.filter((t) => (t.stage || 1) === selectedStage)
    : tickets;

  const handleStagePress = (stageNum: number) => {
    setSelectedStage(selectedStage === stageNum ? null : stageNum);
  };

  const getHazardTag = (ticket: Ticket) => {
    if (ticket.severityScore >= 8) {
      return { text: 'Critical Hazard', bg: '#FEE2E2', color: '#DC2626' };
    } else if (ticket.severityScore >= 5) {
      return { text: 'Elevated Risk', bg: '#FEF3C7', color: '#D97706' };
    }
    return { text: 'Standard Notice', bg: '#E0F2FE', color: '#0284C7' };
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* 1. App Navigation Header */}
        <View style={styles.appHeader}>
          <View style={styles.headerLeft}>
            <CivicPulseLogo size={36} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.brandTitle}>CivicPulse</Text>
              <Text style={styles.brandSubtitle}>Dashboard</Text>
            </View>
            <View style={styles.wardHeaderPill}>
              <Text style={styles.wardHeaderPillText}>Ward 04 • SoMa Corridor</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <BellIcon size={22} hasBadge={true} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarButton} activeOpacity={0.7}>
              <UserAvatarIcon size={34} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Status Row */}
        <View style={styles.statusRow}>
          <CivicPillBadge
            text={`Ward 04 Active • Consensus Score ${user.consensusScore}%`}
            dot={true}
            dotColor="#6B7280"
            style={styles.consensusPill}
          />
          <Text style={styles.nodeIdText}>{user.nodeId}</Text>
        </View>

        {/* 3. Hero Greeting */}
        <Text style={styles.greetingText}>
          Hello, Welcome {user.name || 'Shravan'}
        </Text>

        {/* 4. Dark Hero Action Card ("Real-Time Vision Mesh") */}
        <View style={styles.heroDarkCard}>
          {/* Card Top Tag Row */}
          <View style={styles.heroTopRow}>
            <View style={styles.meshPill}>
              <LightningIcon size={12} color="#FBBF24" />
              <Text style={styles.meshPillText}>Real-Time Vision Mesh</Text>
            </View>
            <Text style={styles.verifiedIcon}>⚙</Text>
          </View>

          {/* Hero Card Title & Subtitle */}
          <Text style={styles.heroCardTitle}>Report Real-Time Civic Issue</Text>
          <Text style={styles.heroCardDesc}>
            Point your camera at a pothole, broken streetlight, or hazard. Autonomous Vision Agent
            classifies, geolocates, and verifies instantly.
          </Text>

          {/* Big White Action CTA */}
          <TouchableOpacity
            style={styles.heroCtaBtn}
            activeOpacity={0.85}
            onPress={() => setIsScannerOpen(true)}>
            <CameraIcon size={18} color="#111827" />
            <Text style={styles.heroCtaText}>Launch Camera Scanner & Report</Text>
          </TouchableOpacity>

          {/* Card Footer Badges */}
          <View style={styles.heroFooterRow}>
            <View style={styles.heroFooterItem}>
              <ShieldLockIcon size={13} color="#9CA3AF" />
              <Text style={styles.heroFooterText}>Zero-Knowledge Anonymized</Text>
            </View>
            <View style={styles.heroFooterItem}>
              <SpeedometerIcon size={13} color="#9CA3AF" />
              <Text style={styles.heroFooterText}>Sub-Second Routing</Text>
            </View>
          </View>
        </View>

        {/* 5. Swarm Resolution Workflow (5 Stages) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Swarm Resolution Workflow</Text>
          <TouchableOpacity
            onPress={() => setSelectedStage(null)}
            activeOpacity={0.7}>
            <Text style={styles.sectionMeta}>
              {selectedStage ? `Stage ${selectedStage} (Reset)` : '5 Stages Active'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stagesContainer}>
          {stages.map((stage) => {
            // Default stages 1 & 2 are dark active in the screenshot
            const isDefaultActive = stage.number === 1 || stage.number === 2;
            const isSelected = selectedStage === stage.number;
            const isHighlighted = selectedStage ? isSelected : isDefaultActive;

            return (
              <TouchableOpacity
                key={stage.number}
                style={styles.stageCol}
                onPress={() => handleStagePress(stage.number)}
                activeOpacity={0.7}>
                <View
                  style={[
                    styles.stageCircle,
                    isHighlighted ? styles.stageCircleActive : styles.stageCircleInactive,
                  ]}>
                  <Text
                    style={[
                      styles.stageNumber,
                      isHighlighted ? styles.stageNumberActive : styles.stageNumberInactive,
                    ]}>
                    {stage.number}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stageLabel,
                    isHighlighted ? styles.stageLabelActive : styles.stageLabelInactive,
                  ]}>
                  {stage.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 6. Your Report Section */}
        <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Your Report</Text>
          <TouchableOpacity
            style={styles.mapLinkBtn}
            onPress={onOpenMap}
            activeOpacity={0.7}>
            <MapPinIcon size={14} color="#111827" />
            <Text style={styles.mapLinkText}>View on Map</Text>
          </TouchableOpacity>
        </View>

        {/* Render Reports */}
        {filteredTickets.map((ticket) => {
          const tag = getHazardTag(ticket);
          return (
            <TouchableOpacity
              key={ticket.id}
              style={styles.reportCard}
              activeOpacity={0.85}
              onPress={() => setActiveTicketId(ticket.id)}>
              <View style={styles.reportCardTop}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  {/* Tag Pill */}
                  <View style={[styles.hazardTag, { backgroundColor: tag.bg }]}>
                    <Text style={[styles.hazardTagText, { color: tag.color }]}>
                      {tag.text}
                    </Text>
                  </View>

                  {/* Title */}
                  <Text style={styles.reportTitle}>{ticket.title}</Text>

                  {/* Location & Time */}
                  <Text style={styles.reportSubtitle}>
                    4th & Mission St • Detected 14m ago
                  </Text>
                </View>

                {/* Right Image Thumbnail */}
                <Image
                  source={{ uri: ticket.imageUrl || CONDUIT_IMAGE }}
                  style={styles.reportThumb}
                />
              </View>

              {/* Bot Dispatch Status Bar */}
              <View style={styles.dispatchBar}>
                <View style={styles.dispatchLeft}>
                  <LightningIcon size={14} color="#111827" />
                  <Text style={styles.dispatchText}>
                    Bot Dispatch {ticket.botDispatchId || '#0482'} En Route
                  </Text>
                </View>
                <Text style={styles.etaText}>
                  ETA {ticket.etaMinutes || 18}m
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* 7. Skeleton / Queue Placeholders (from Layout 3) */}
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonCard} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 24 : 12,
    paddingBottom: 100,
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 18,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  wardHeaderPill: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginLeft: 10,
  },
  wardHeaderPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  avatarButton: {
    padding: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  consensusPill: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  nodeIdText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  greetingText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 18,
    letterSpacing: -0.4,
  },
  heroDarkCard: {
    backgroundColor: '#27272A',
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  meshPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    gap: 6,
  },
  meshPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F4F4F5',
  },
  verifiedIcon: {
    fontSize: 16,
    color: '#D4D4D8',
  },
  heroCardTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  heroCardDesc: {
    fontSize: 13,
    color: '#D4D4D8',
    lineHeight: 18,
    marginBottom: 20,
  },
  heroCtaBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  heroCtaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  heroFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  heroFooterText: {
    fontSize: 11,
    color: '#A1A1AA',
    fontWeight: '500',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.2,
  },
  sectionMeta: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  stagesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stageCol: {
    alignItems: 'center',
  },
  stageCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  stageCircleActive: {
    backgroundColor: '#4B5563',
  },
  stageCircleInactive: {
    backgroundColor: '#E5E7EB',
  },
  stageNumber: {
    fontSize: 13,
    fontWeight: '700',
  },
  stageNumberActive: {
    color: '#FFFFFF',
  },
  stageNumberInactive: {
    color: '#6B7280',
  },
  stageLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  stageLabelActive: {
    color: '#111827',
  },
  stageLabelInactive: {
    color: '#6B7280',
  },
  mapLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mapLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  reportCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  hazardTag: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  hazardTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  reportSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  reportThumb: {
    width: 68,
    height: 68,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  dispatchBar: {
    backgroundColor: '#F4F4F5',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dispatchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dispatchText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#18181B',
  },
  etaText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#18181B',
  },
  skeletonCard: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    opacity: 0.7,
  },
});

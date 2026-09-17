import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { CivicPulseLogo, LightningIcon, SpeedometerIcon } from '../civic-icons';
import { CivicPillBadge } from '../civic-ui';

export default function AgentSwarmScreen() {
  const agents = [
    {
      id: 'agent-1',
      name: 'Vision Triage Mesh',
      role: 'Hazard Classification & Depth Estimation',
      status: 'ONLINE',
      metric: '184ms sub-second inference',
      icon: '⚡',
    },
    {
      id: 'agent-2',
      name: 'Jurisdiction Polygon Router',
      role: 'Ward Boundary & Officer Contact Mapping',
      status: 'ONLINE',
      metric: 'Ward 04 Geo-Fence Locked',
      icon: '🌐',
    },
    {
      id: 'agent-3',
      name: 'Autonomous SLA Escalation Daemon',
      role: 'Continuous Tier 1, 2, 3 Time Monitor',
      status: 'ACTIVE',
      metric: 'T+3d / T+7d / T+14d SLA Rules',
      icon: '⏱️',
    },
    {
      id: 'agent-4',
      name: 'Field Bot Dispatch Fleet',
      role: 'Algorithmic Municipal Dispatching',
      status: 'DISPATCHED',
      metric: 'Bot #0482 En Route (ETA 18m)',
      icon: '🤖',
    },
    {
      id: 'agent-5',
      name: 'Twitter Accountability Broadcaster',
      role: 'Public Escalation Alert Publisher',
      status: 'STANDBY',
      metric: 'Tagging @CityHall & @MAUD',
      icon: '📢',
    },
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <CivicPulseLogo size={36} />
            <View>
              <Text style={styles.headerTitle}>Agent Swarm Grid</Text>
              <Text style={styles.headerSub}>Autonomous Municipal Intelligence</Text>
            </View>
          </View>
          <CivicPillBadge text="5 AGENTS LIVE" dot={true} dotColor="#10B981" />
        </View>

        {/* Overview Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statNumber}>98.4%</Text>
            <Text style={styles.statLabel}>Consensus Score</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statNumber}>&lt;800ms</Text>
            <Text style={styles.statLabel}>P95 Ingestion Latency</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>SLA Enforcement</Text>
          </View>
        </View>

        {/* Agents List */}
        <Text style={styles.sectionTitle}>Active Autonomous Swarm Agents</Text>

        {agents.map((agent) => (
          <View key={agent.id} style={styles.agentCard}>
            <View style={styles.agentTopRow}>
              <View style={styles.agentLeft}>
                <View style={styles.iconCircle}>
                  <Text style={{ fontSize: 16 }}>{agent.icon}</Text>
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.agentName}>{agent.name}</Text>
                  <Text style={styles.agentRole}>{agent.role}</Text>
                </View>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>{agent.status}</Text>
              </View>
            </View>

            <View style={styles.agentFooterRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <SpeedometerIcon size={12} color="#6B7280" />
                <Text style={styles.metricText}>{agent.metric}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <LightningIcon size={11} color="#10B981" />
                <Text style={styles.activePillText}>Operational</Text>
              </View>
            </View>
          </View>
        ))}
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
    padding: 20,
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  headerSub: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: '#18181B',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#A1A1AA',
    fontWeight: '600',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  agentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  agentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  agentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  agentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  agentRole: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  statusPill: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  agentFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  metricText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  activePillText: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '700',
  },
});

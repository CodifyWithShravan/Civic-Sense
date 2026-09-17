import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import { UserAvatarIcon } from '../civic-icons';
import { CivicButton, CivicPillBadge } from '../civic-ui';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user, updateUserPreferences, logout, setScreen } = useAuth();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <UserAvatarIcon size={64} />
          <Text style={styles.userName}>{user.name || 'Shravan'}</Text>
          <CivicPillBadge
            text={user.nodeId}
            dot={true}
            dotColor="#10B981"
            style={{ marginTop: 8 }}
          />
          <Text style={styles.userEmail}>{user.phoneOrEmail}</Text>
        </View>

        {/* Node Verification Details */}
        <Text style={styles.sectionTitle}>Verified Node Details</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Assigned Ward:</Text>
            <Text style={styles.detailVal}>{user.ward}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>District Sector:</Text>
            <Text style={styles.detailVal}>{user.district}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Consensus Score:</Text>
            <Text style={[styles.detailVal, { color: '#16A34A', fontWeight: '800' }]}>
              {user.consensusScore}% (High Trust)
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Municipal Protocol:</Text>
            <Text style={styles.detailVal}>{user.version} Autonomous Grid</Text>
          </View>
        </View>

        {/* Opt-in Controls */}
        <Text style={styles.sectionTitle}>Node Preferences</Text>
        <View style={styles.detailsCard}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.switchTitle}>AI Agent Dispatch Alerts</Text>
              <Text style={styles.switchDesc}>
                Real-time pings when civic bots dispatch repair tickets in your block.
              </Text>
            </View>
            <Switch
              value={user.alertsEnabled}
              onValueChange={(val) => updateUserPreferences({ alertsEnabled: val })}
              trackColor={{ false: '#D1D5DB', true: '#18181B' }}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.switchTitle}>Community Consensus Protocol</Text>
              <Text style={styles.switchDesc}>
                Participate in decentralized confirmation votes to escalate issues.
              </Text>
            </View>
            <Switch
              value={user.consensusProtocolEnabled}
              onValueChange={(val) => updateUserPreferences({ consensusProtocolEnabled: val })}
              trackColor={{ false: '#D1D5DB', true: '#18181B' }}
            />
          </View>
        </View>

        {/* Screen Switchers for presentation demo */}
        <Text style={styles.sectionTitle}>Layout Switcher (Presentation Mode)</Text>
        <View style={{ gap: 8, marginBottom: 20 }}>
          <CivicButton
            title="View Layout 1: Login Screen"
            variant="outline"
            onPress={() => setScreen('login')}
          />
          <CivicButton
            title="View Layout 2: Register Screen"
            variant="outline"
            onPress={() => setScreen('register')}
          />
          <CivicButton
            title="Sign Out of Node"
            variant="danger"
            onPress={logout}
          />
        </View>
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
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginTop: 12,
  },
  userEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 10,
    marginTop: 8,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailVal: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 6,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  switchDesc: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 15,
  },
});

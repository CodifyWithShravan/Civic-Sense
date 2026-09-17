import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { GridIcon, CameraIcon, SwarmNodesIcon, UserAvatarIcon } from './civic-icons';

export type CivicTab = 'dashboard' | 'report' | 'swarm' | 'profile';

interface CivicBottomNavProps {
  activeTab: CivicTab;
  onSelectTab: (tab: CivicTab) => void;
}

export default function CivicBottomNav({ activeTab, onSelectTab }: CivicBottomNavProps) {
  return (
    <View style={styles.navContainer}>
      {/* 1. Dashboard Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectTab('dashboard')}
        activeOpacity={0.7}>
        <GridIcon
          size={20}
          color={activeTab === 'dashboard' ? '#111827' : '#9CA3AF'}
        />
        <Text
          style={[
            styles.navLabel,
            activeTab === 'dashboard' ? styles.navLabelActive : styles.navLabelInactive,
          ]}>
          Dashboard
        </Text>
      </TouchableOpacity>

      {/* 2. Report Tab (Hero Camera Button) */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectTab('report')}
        activeOpacity={0.7}>
        <View style={styles.cameraCircle}>
          <CameraIcon size={18} color="#FFFFFF" />
        </View>
        <Text
          style={[
            styles.navLabel,
            activeTab === 'report' ? styles.navLabelActive : styles.navLabelInactive,
          ]}>
          Report
        </Text>
      </TouchableOpacity>

      {/* 3. Agent Swarm Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectTab('swarm')}
        activeOpacity={0.7}>
        <SwarmNodesIcon
          size={20}
          color={activeTab === 'swarm' ? '#111827' : '#9CA3AF'}
        />
        <Text
          style={[
            styles.navLabel,
            activeTab === 'swarm' ? styles.navLabelActive : styles.navLabelInactive,
          ]}>
          Agent Swarm
        </Text>
      </TouchableOpacity>

      {/* 4. Profile Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectTab('profile')}
        activeOpacity={0.7}>
        <View
          style={[
            styles.profileCircle,
            activeTab === 'profile' && { borderColor: '#111827' },
          ]}>
          <Text style={styles.profileInitial}>S</Text>
        </View>
        <Text
          style={[
            styles.navLabel,
            activeTab === 'profile' ? styles.navLabelActive : styles.navLabelInactive,
          ]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 20 : 6,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 100,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 4,
  },
  navLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  navLabelActive: {
    fontWeight: '800',
    color: '#111827',
  },
  navLabelInactive: {
    fontWeight: '500',
    color: '#9CA3AF',
  },
  cameraCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  profileInitial: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});

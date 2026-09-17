import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTickets } from '@/context/TicketContext';
import LoginScreen from '@/components/screens/LoginScreen';
import RegisterScreen from '@/components/screens/RegisterScreen';
import DashboardScreen from '@/components/screens/DashboardScreen';
import AgentSwarmScreen from '@/components/screens/AgentSwarmScreen';
import ProfileScreen from '@/components/screens/ProfileScreen';
import ReportScannerModal from '@/components/screens/ReportScannerModal';
import TicketDetailModal from '@/components/screens/TicketDetailModal';
import MapViewModal from '@/components/screens/MapViewModal';
import CivicBottomNav, { CivicTab } from '@/components/CivicBottomNav';

export default function AppMain() {
  const { currentScreen, isAuthenticated } = useAuth();
  const { setIsScannerOpen } = useTickets();
  const [activeTab, setActiveTab] = useState<CivicTab>('dashboard');
  const [isMapOpen, setIsMapOpen] = useState(false);

  // 1. If user is in Login view (Layout 1)
  if (!isAuthenticated || currentScreen === 'login') {
    return <LoginScreen />;
  }

  // 2. If user is in Register view (Layout 2)
  if (currentScreen === 'register') {
    return <RegisterScreen />;
  }

  // 3. Tab switching handler
  const handleSelectTab = (tab: CivicTab) => {
    if (tab === 'report') {
      setIsScannerOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <View style={styles.appContainer}>
      {/* Active Tab Screen */}
      <View style={styles.screenArea}>
        {activeTab === 'dashboard' && (
          <DashboardScreen onOpenMap={() => setIsMapOpen(true)} />
        )}
        {activeTab === 'swarm' && <AgentSwarmScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </View>

      {/* Persistent Bottom Navigation (Layout 3) */}
      <CivicBottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />

      {/* Screen 1 Ingestion Modal: Camera Scanner & AI Vision */}
      <ReportScannerModal />

      {/* Screen 3 & 4 Modal: Live Audit Timeline & Time-Warp Controller */}
      <TicketDetailModal />

      {/* Geofence Map Modal */}
      <MapViewModal visible={isMapOpen} onClose={() => setIsMapOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    position: 'relative',
  },
  screenArea: {
    flex: 1,
  },
});

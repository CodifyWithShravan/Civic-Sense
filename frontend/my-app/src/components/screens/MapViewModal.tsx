import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LightningIcon, MapPinIcon } from '../civic-icons';
import { CivicPillBadge } from '../civic-ui';
import { useTickets } from '@/context/TicketContext';

export default function MapViewModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { tickets } = useTickets();

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕ Close</Text>
          </TouchableOpacity>
          <CivicPillBadge text="WARD 04 GRID MAP" dot={true} dotColor="#10B981" />
        </View>

        {/* Map Canvas Simulation */}
        <View style={styles.mapCanvas}>
          {/* Grid lines */}
          <View style={styles.gridLineHorizontal1} />
          <View style={styles.gridLineHorizontal2} />
          <View style={styles.gridLineVertical1} />
          <View style={styles.gridLineVertical2} />

          {/* Road representations */}
          <View style={styles.street1}>
            <Text style={styles.streetLabel}>MISSION STREET</Text>
          </View>
          <View style={styles.street2}>
            <Text style={styles.streetLabel}>4TH STREET</Text>
          </View>

          {/* Hazard Pin (4th & Mission) */}
          <View style={styles.hazardPinWrapper}>
            <View style={styles.pulseRadar} />
            <View style={styles.hazardPin}>
              <Text style={{ fontSize: 16 }}>⚠️</Text>
            </View>
            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>Exposed Conduit</Text>
              <Text style={styles.calloutSub}>Critical (Sev 9/10)</Text>
            </View>
          </View>

          {/* Dispatch Bot Pin */}
          <View style={styles.botPinWrapper}>
            <View style={styles.botPin}>
              <LightningIcon size={14} color="#18181B" />
            </View>
            <View style={styles.botCallout}>
              <Text style={styles.botCalloutText}>Bot #0482 En Route</Text>
              <Text style={styles.botCalloutSub}>ETA 18 min</Text>
            </View>
          </View>
        </View>

        {/* Active Hazards list */}
        <View style={styles.bottomCard}>
          <Text style={styles.cardHeading}>Ward 04 Geofence Hazards ({tickets.length})</Text>
          {tickets.map((t) => (
            <View key={t.id} style={styles.hazardItem}>
              <MapPinIcon size={14} color="#EF4444" />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.itemTitle}>{t.title}</Text>
                <Text style={styles.itemMeta}>
                  {t.latitude.toFixed(4)}, {t.longitude.toFixed(4)} • {t.status}
                </Text>
              </View>
              <Text style={styles.itemSev}>Sev {t.severityScore}</Text>
            </View>
          ))}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
  mapCanvas: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#090D16',
    overflow: 'hidden',
  },
  gridLineHorizontal1: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  gridLineHorizontal2: {
    position: 'absolute',
    top: '70%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  gridLineVertical1: {
    position: 'absolute',
    left: '30%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  gridLineVertical2: {
    position: 'absolute',
    left: '70%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  street1: {
    position: 'absolute',
    top: '48%',
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  street2: {
    position: 'absolute',
    left: '46%',
    top: 0,
    bottom: 0,
    width: 36,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streetLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 2,
  },
  hazardPinWrapper: {
    position: 'absolute',
    top: '44%',
    left: '44%',
    alignItems: 'center',
  },
  pulseRadar: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    top: -10,
  },
  hazardPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  callout: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 6,
    alignItems: 'center',
  },
  calloutTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
  },
  calloutSub: {
    fontSize: 9,
    color: '#EF4444',
    fontWeight: '700',
  },
  botPinWrapper: {
    position: 'absolute',
    top: '55%',
    left: '20%',
    alignItems: 'center',
  },
  botPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FBBF24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botCallout: {
    backgroundColor: '#1E293B',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginTop: 4,
    alignItems: 'center',
  },
  botCalloutText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  botCalloutSub: {
    fontSize: 9,
    color: '#FBBF24',
  },
  bottomCard: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  cardHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  hazardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  itemMeta: {
    fontSize: 10,
    color: '#94A3B8',
  },
  itemSev: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F87171',
  },
});

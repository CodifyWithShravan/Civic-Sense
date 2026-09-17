import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { CameraIcon, LightningIcon, MapPinIcon } from '../civic-icons';
import { CivicButton, CivicPillBadge } from '../civic-ui';
import { useTickets } from '@/context/TicketContext';

interface PresetHazard {
  id: string;
  title: string;
  hazardType: string;
  severity: number;
  image: string;
  desc: string;
}

const PRESET_HAZARDS: PresetHazard[] = [
  {
    id: '1',
    title: 'Exposed Electrical Conduit',
    hazardType: 'ELECTRICAL_HAZARD',
    severity: 9,
    image:
      'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=600&q=80',
    desc: 'Uninsulated high-voltage conduit exposed to rainwater near pedestrian curb.',
  },
  {
    id: '2',
    title: 'Subsurface Pothole Crater',
    hazardType: 'POTHOLE',
    severity: 8,
    image:
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    desc: 'Deep asphalt collapse exceeding 12 inches; causing vehicular axle damage.',
  },
  {
    id: '3',
    title: 'Uncovered Stormwater Manhole',
    hazardType: 'OPEN_MANHOLE',
    severity: 10,
    image:
      'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=600&q=80',
    desc: 'Missing cast-iron lid poses extreme peril to cyclists and night pedestrians.',
  },
  {
    id: '4',
    title: 'Municipal Streetlight Failure',
    hazardType: 'STREETLIGHT_DEFECT',
    severity: 6,
    image:
      'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=600&q=80',
    desc: 'Entire block dark for 48 hours; elevated safety risk.',
  },
];

export default function ReportScannerModal() {
  const { isScannerOpen, setIsScannerOpen, createReport } = useTickets();
  const [selectedHazard, setSelectedHazard] = useState<PresetHazard>(PRESET_HAZARDS[0]);
  const [userNote, setUserNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isScannerOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createReport({
        title: selectedHazard.title,
        hazardType: selectedHazard.hazardType,
        latitude: 37.7818,
        longitude: -122.4048,
        severityScore: selectedHazard.severity,
        description: userNote || selectedHazard.desc,
        imageUrl: selectedHazard.image,
      });
      setIsScannerOpen(false);
    } catch {
      // Handled
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={isScannerOpen} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setIsScannerOpen(false)}>
            <Text style={styles.closeBtnText}>✕ Close</Text>
          </TouchableOpacity>
          <CivicPillBadge
            text="VISION MESH SCANNER"
            dot={true}
            dotColor="#10B981"
            style={styles.scannerBadge}
          />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Viewfinder simulation */}
          <View style={styles.viewfinderBox}>
            <Image source={{ uri: selectedHazard.image }} style={styles.hazardPhoto} />

            {/* Viewfinder crosshairs */}
            <View style={styles.viewfinderReticle}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>

            {/* Live AI Overlay Badge */}
            <View style={styles.aiOverlayBadge}>
              <LightningIcon size={12} color="#FBBF24" />
              <Text style={styles.aiOverlayText}>AI Vision Verified: 98.4% Confidence</Text>
            </View>

            {/* GPS Pin Overlay */}
            <View style={styles.gpsOverlay}>
              <MapPinIcon size={12} color="#FFFFFF" />
              <Text style={styles.gpsOverlayText}>37.7818° N, 122.4048° W • Ward 04</Text>
            </View>
          </View>

          {/* Hazard Selector Carousel */}
          <Text style={styles.sectionHeading}>Select Detected Hazard Preset:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
            {PRESET_HAZARDS.map((hazard) => {
              const isSelected = hazard.id === selectedHazard.id;
              return (
                <TouchableOpacity
                  key={hazard.id}
                  style={[styles.presetCard, isSelected && styles.presetCardSelected]}
                  onPress={() => setSelectedHazard(hazard)}
                  activeOpacity={0.7}>
                  <Image source={{ uri: hazard.image }} style={styles.presetThumb} />
                  <Text style={[styles.presetTitle, isSelected && styles.presetTitleSelected]}>
                    {hazard.title}
                  </Text>
                  <View style={styles.severityBadge}>
                    <Text style={styles.severityText}>Severity {hazard.severity}/10</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* AI Triage Information Box */}
          <View style={styles.triageBox}>
            <View style={styles.triageRow}>
              <Text style={styles.triageLabel}>Hazard Classification:</Text>
              <Text style={styles.triageVal}>{selectedHazard.hazardType}</Text>
            </View>
            <View style={styles.triageRow}>
              <Text style={styles.triageLabel}>Target Municipality:</Text>
              <Text style={styles.triageVal}>Ward 04 — Mission/SoMa Corridor</Text>
            </View>
            <View style={styles.triageRow}>
              <Text style={styles.triageLabel}>Severity Metric:</Text>
              <Text style={[styles.triageVal, { color: '#EF4444', fontWeight: '800' }]}>
                {selectedHazard.severity} / 10 (High Priority)
              </Text>
            </View>
          </View>

          {/* Citizen Description Field */}
          <View style={styles.descBox}>
            <Text style={styles.descLabel}>Additional Observations (Optional):</Text>
            <TextInput
              style={styles.descInput}
              placeholder="e.g. Near bus stop, sparks during commute hours..."
              placeholderTextColor="#9CA3AF"
              multiline
              value={userNote}
              onChangeText={setUserNote}
            />
          </View>

          {/* Submit CTA */}
          <CivicButton
            title={isSubmitting ? 'Ingesting Grievance...' : 'Submit Civic Grievance'}
            variant="primary"
            icon={<CameraIcon size={18} color="#FFFFFF" />}
            showArrow={true}
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={{ marginTop: 16 }}
          />
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
  header: {
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
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  scannerBadge: {
    backgroundColor: '#E5E7EB',
  },
  scrollContent: {
    padding: 20,
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  viewfinderBox: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000000',
    position: 'relative',
    marginBottom: 18,
  },
  hazardPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  viewfinderReticle: {
    position: 'absolute',
    top: 24,
    left: 24,
    right: 24,
    bottom: 24,
    pointerEvents: 'none',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#00F0FF',
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  aiOverlayBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 24, 27, 0.85)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 5,
  },
  aiOverlayText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  gpsOverlay: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 5,
  },
  gpsOverlayText: {
    color: '#E5E7EB',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  presetScroll: {
    marginBottom: 16,
  },
  presetCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    marginRight: 10,
  },
  presetCardSelected: {
    borderColor: '#18181B',
    backgroundColor: '#F4F4F5',
  },
  presetThumb: {
    width: '100%',
    height: 70,
    borderRadius: 8,
    marginBottom: 8,
  },
  presetTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
    height: 32,
  },
  presetTitleSelected: {
    color: '#111827',
  },
  severityBadge: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },
  triageBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    gap: 8,
  },
  triageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  triageLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  triageVal: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '700',
  },
  descBox: {
    marginBottom: 10,
  },
  descLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  descInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#111827',
    height: 64,
    textAlignVertical: 'top',
  },
});

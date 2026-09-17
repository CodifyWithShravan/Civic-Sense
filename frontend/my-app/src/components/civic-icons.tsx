import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 1. Municipal Grid Gold Seal Emblem (Layout 1)
export function MunicipalSealLogo({ size = 72 }: { size?: number }) {
  return (
    <View
      style={[
        styles.sealOuterRing,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}>
      <View
        style={[
          styles.sealInnerRing,
          {
            width: size - 8,
            height: size - 8,
            borderRadius: (size - 8) / 2,
          },
        ]}>
        {/* Arc of stars */}
        <View style={styles.starRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.starSmall}>★</Text>
          <Text style={styles.star}>★</Text>
        </View>

        {/* Neoclassical Municipal Building */}
        <View style={styles.buildingPediment} />
        <View style={styles.buildingEntablature} />
        <View style={styles.columnsContainer}>
          <View style={styles.column} />
          <View style={styles.column} />
          <View style={styles.column} />
          <View style={styles.column} />
          <View style={styles.column} />
        </View>
        <View style={styles.buildingBase} />
        <View style={styles.buildingBase2} />
      </View>
    </View>
  );
}

// 2. CivicPulse Cyan Waveform Logo (Layout 2 & 3)
export function CivicPulseLogo({ size = 48, iconOnly = false }: { size?: number; iconOnly?: boolean }) {
  return (
    <View
      style={[
        styles.pulseContainer,
        {
          width: size,
          height: size,
          borderRadius: size * 0.28,
        },
      ]}>
      {/* Neon Cyan Waveform */}
      <View style={styles.waveRow}>
        <View style={[styles.waveDot, { height: size * 0.16 }]} />
        <View style={[styles.waveLine, { height: size * 0.3 }]} />
        <View style={[styles.wavePeakUp, { height: size * 0.58 }]} />
        <View style={[styles.wavePeakDown, { height: size * 0.45 }]} />
        <View style={[styles.waveDotActive, { width: size * 0.16, height: size * 0.16 }]} />
        <View style={[styles.waveLine, { height: size * 0.22 }]} />
      </View>
    </View>
  );
}

// 3. Multicolored Google Icon
export function GoogleGIcon({ size = 20 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: size * 0.95, fontWeight: '700', color: '#4285F4' }}>G</Text>
    </View>
  );
}

// 4. Utility Icons (Crosshair, Mail, Key, Eye, etc.)
export function MailIcon({ size = 18, color = '#6B7280' }: { size?: number; color?: string }) {
  return (
    <View
      style={{
        width: size,
        height: size * 0.72,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: size * 0.6,
          height: 1.5,
          backgroundColor: color,
          transform: [{ rotate: '25deg' }, { translateX: -size * 0.1 }],
        }}
      />
    </View>
  );
}

export function KeyIcon({ size = 18, color = '#6B7280' }: { size?: number; color?: string }) {
  return (
    <View style={{ width: size, height: size, flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          width: size * 0.45,
          height: size * 0.45,
          borderRadius: size * 0.25,
          borderWidth: 1.5,
          borderColor: color,
        }}
      />
      <View
        style={{
          width: size * 0.45,
          height: 2,
          backgroundColor: color,
          marginLeft: -1,
        }}
      />
    </View>
  );
}

export function EyeIcon({
  size = 18,
  color = '#6B7280',
  crossed = false,
}: {
  size?: number;
  color?: string;
  crossed?: boolean;
}) {
  return (
    <View
      style={{
        width: size,
        height: size * 0.65,
        borderRadius: size * 0.4,
        borderWidth: 1.5,
        borderColor: color,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: size * 0.35,
          height: size * 0.35,
          borderRadius: size * 0.2,
          backgroundColor: color,
        }}
      />
      {crossed && (
        <View
          style={{
            position: 'absolute',
            width: size * 1.1,
            height: 1.5,
            backgroundColor: color,
            transform: [{ rotate: '-45deg' }],
          }}
        />
      )}
    </View>
  );
}

export function CrosshairIcon({ size = 16, color = '#111827' }: { size?: number; color?: string }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: color,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: size * 0.35,
          height: size * 0.35,
          borderRadius: size * 0.2,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

export function MapPinIcon({ size = 18, color = '#6B7280' }: { size?: number; color?: string }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center' }}>
      <View
        style={{
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: size * 0.35,
          borderWidth: 1.5,
          borderColor: color,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: size * 0.22,
            height: size * 0.22,
            borderRadius: size * 0.11,
            backgroundColor: color,
          }}
        />
      </View>
      <View
        style={{
          width: 2,
          height: size * 0.3,
          backgroundColor: color,
          marginTop: -1,
        }}
      />
    </View>
  );
}

export function CameraIcon({ size = 20, color = '#111827' }: { size?: number; color?: string }) {
  return (
    <View style={{ width: size, height: size * 0.8, alignItems: 'center' }}>
      <View
        style={{
          width: size * 0.35,
          height: 2.5,
          backgroundColor: color,
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
        }}
      />
      <View
        style={{
          width: size,
          height: size * 0.65,
          borderWidth: 1.8,
          borderColor: color,
          borderRadius: 4,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: size * 0.38,
            height: size * 0.38,
            borderRadius: size * 0.2,
            borderWidth: 1.5,
            borderColor: color,
          }}
        />
      </View>
    </View>
  );
}

export function LightningIcon({ size = 16, color = '#F59E0B' }: { size?: number; color?: string }) {
  return (
    <Text style={{ fontSize: size, color, fontWeight: '900', lineHeight: size * 1.1 }}>⚡</Text>
  );
}

export function ShieldLockIcon({ size = 14, color = '#6B7280' }: { size?: number; color?: string }) {
  return (
    <View
      style={{
        width: size,
        height: size * 0.9,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          position: 'absolute',
          top: -size * 0.35,
          width: size * 0.55,
          height: size * 0.45,
          borderWidth: 1.5,
          borderColor: color,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
        }}
      />
      <View
        style={{
          width: 2.5,
          height: 3,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
    </View>
  );
}

export function SpeedometerIcon({ size = 14, color = '#6B7280' }: { size?: number; color?: string }) {
  return (
    <View
      style={{
        width: size,
        height: size * 0.6,
        borderTopLeftRadius: size * 0.5,
        borderTopRightRadius: size * 0.5,
        borderWidth: 1.5,
        borderBottomWidth: 0,
        borderColor: color,
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: 1.5,
          height: size * 0.4,
          backgroundColor: color,
          transform: [{ rotate: '35deg' }],
          transformOrigin: 'bottom',
        }}
      />
    </View>
  );
}

export function BellIcon({
  size = 20,
  hasBadge = true,
  color = '#111827',
}: {
  size?: number;
  hasBadge?: boolean;
  color?: string;
}) {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: size * 0.9, color }}>🔔</Text>
      {hasBadge && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 7,
            height: 7,
            borderRadius: 3.5,
            backgroundColor: '#EF4444',
            borderWidth: 1,
            borderColor: '#FFFFFF',
          }}
        />
      )}
    </View>
  );
}

export function UserAvatarIcon({ size = 32 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#4B5563',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{ color: '#FFFFFF', fontSize: size * 0.5, fontWeight: '700' }}>S</Text>
    </View>
  );
}

export function GridIcon({ size = 20, color = '#111827' }: { size?: number; color?: string }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{ width: size * 0.38, height: size * 0.38, borderRadius: 2, backgroundColor: color }} />
      <View style={{ width: size * 0.38, height: size * 0.38, borderRadius: 2, backgroundColor: color }} />
      <View style={{ width: size * 0.38, height: size * 0.38, borderRadius: 2, backgroundColor: color }} />
      <View style={{ width: size * 0.38, height: size * 0.38, borderRadius: 2, backgroundColor: color }} />
    </View>
  );
}

export function SwarmNodesIcon({ size = 20, color = '#6B7280' }: { size?: number; color?: string }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: size * 0.32,
          height: size * 0.32,
          borderRadius: 2,
          borderWidth: 1.5,
          borderColor: color,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          gap: size * 0.3,
          marginTop: 2,
        }}
      >
        <View
          style={{
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: 2,
            borderWidth: 1.5,
            borderColor: color,
          }}
        />
        <View
          style={{
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: 2,
            borderWidth: 1.5,
            borderColor: color,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sealOuterRing: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2.5,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sealInnerRing: {
    backgroundColor: '#1E2433',
    borderWidth: 2,
    borderColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 2,
  },
  star: {
    color: '#F59E0B',
    fontSize: 9,
  },
  starSmall: {
    color: '#F59E0B',
    fontSize: 7,
    marginTop: -2,
  },
  buildingPediment: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FBBF24',
  },
  buildingEntablature: {
    width: 28,
    height: 2,
    backgroundColor: '#FBBF24',
    marginVertical: 1,
  },
  columnsContainer: {
    width: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    width: 2.5,
    height: 11,
    backgroundColor: '#F3F4F6',
    borderRadius: 0.5,
  },
  buildingBase: {
    width: 28,
    height: 2,
    backgroundColor: '#FBBF24',
    marginTop: 1,
  },
  buildingBase2: {
    width: 32,
    height: 2.5,
    backgroundColor: '#D97706',
    marginTop: 0.5,
    borderRadius: 1,
  },
  pulseContainer: {
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#06B6D4',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  waveDot: {
    width: 3,
    backgroundColor: '#06B6D4',
    borderRadius: 1.5,
  },
  waveLine: {
    width: 3,
    backgroundColor: '#06B6D4',
    borderRadius: 1.5,
  },
  wavePeakUp: {
    width: 3.5,
    backgroundColor: '#22D3EE',
    borderRadius: 1.5,
  },
  wavePeakDown: {
    width: 3.5,
    backgroundColor: '#06B6D4',
    borderRadius: 1.5,
  },
  waveDotActive: {
    borderRadius: 99,
    backgroundColor: '#38BDF8',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
});

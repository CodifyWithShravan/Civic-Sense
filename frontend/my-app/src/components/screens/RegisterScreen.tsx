import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  CivicPulseLogo,
  KeyIcon,
  MapPinIcon,
  CrosshairIcon,
} from '../civic-icons';
import {
  CivicButton,
  CivicInput,
  CivicPillBadge,
  CivicCheckboxCard,
} from '../civic-ui';
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
  const { register, setScreen } = useAuth();
  const [name, setName] = useState('Shravan');
  const [ward, setWard] = useState('Ward 04 — Mission/SoMa Corridor (94103)');
  const [phoneOrEmail, setPhoneOrEmail] = useState('alex.chen@civicmail.org');
  const [password, setPassword] = useState('SecurePass2026!');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [consensusEnabled, setConsensusEnabled] = useState(true);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const handleAutoDetect = () => {
    setIsDetectingLocation(true);
    setTimeout(() => {
      setWard('Ward 04 — Mission/SoMa Corridor (94103)');
      setIsDetectingLocation(false);
    }, 400);
  };

  const handleSignUp = async () => {
    await register({
      name: name || 'Shravan',
      ward,
      phoneOrEmail,
      alertsEnabled,
      consensusProtocolEnabled: consensusEnabled,
    });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setScreen('login')}
            activeOpacity={0.7}>
            <Text style={styles.backButtonText}>← Back to Login</Text>
          </TouchableOpacity>

          <CivicPillBadge
            text="NODE V2.4 ACTIVE"
            dot={true}
            dotColor="#10B981"
            style={styles.activeNodePill}
          />
        </View>

        {/* Logo & Headline */}
        <View style={styles.headerSection}>
          <CivicPulseLogo size={64} />
          <CivicPillBadge
            text="AUTONOMOUS CIVIC AGENT NETWORK"
            dot={false}
            icon={<Text style={{ fontSize: 11 }}>🌐</Text>}
            style={styles.agentNetworkPill}
          />
          <Text style={styles.titleText}>Create Your Civic Node</Text>
          <Text style={styles.subtitleText}>
            Connect to your district&apos;s autonomous AI resolution grid. Log real-time friction points,
            track algorithmic municipal dispatches, and validate neighborhood priorities.
          </Text>
        </View>

        {/* Operational Role Section */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionLabel}>OPERATIONAL ROLE</Text>

          {/* Google SSO */}
          <CivicButton
            title="Continue with Google"
            variant="google"
            onPress={() =>
              register({
                name: 'Shravan',
                phoneOrEmail: 'shravan@civicpulse.org',
              })
            }
          />

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR REGISTER NODE CREDENTIALS</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Name Field */}
          <CivicInput
            label="Name:"
            required={true}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            leadingIcon={
              <View style={styles.nameIconBox}>
                <Text style={{ fontSize: 13 }}>🪪</Text>
              </View>
            }
          />

          {/* Nearest Ward Details Field */}
          <CivicInput
            label="Nearest Ward Details:"
            trailingBadge={
              <TouchableOpacity
                onPress={handleAutoDetect}
                style={styles.autoDetectBtn}
                activeOpacity={0.7}>
                <CrosshairIcon size={13} color="#111827" />
                <Text style={styles.autoDetectText}>
                  {isDetectingLocation ? 'Locating...' : 'Auto-detect'}
                </Text>
              </TouchableOpacity>
            }
            placeholder="Ward 04 — Mission/SoMa Corridor"
            value={ward}
            onChangeText={setWard}
            leadingIcon={<MapPinIcon size={16} color="#6B7280" />}
            trailingIcon={
              <View style={styles.checkBadge}>
                <Text style={styles.checkBadgeText}>✓</Text>
              </View>
            }
          />

          {/* Phone Number / Email */}
          <CivicInput
            label="Phone Number:"
            placeholder="alex.chen@civicmail.org or +1 (555) 019-2..."
            value={phoneOrEmail}
            onChangeText={setPhoneOrEmail}
            autoCapitalize="none"
            leadingIcon={
              <View style={styles.nameIconBox}>
                <Text style={{ fontSize: 13 }}>🪪</Text>
              </View>
            }
          />

          {/* Password */}
          <CivicInput
            label="Password"
            placeholder="••••••••••••••••"
            value={password}
            onChangeText={setPassword}
            isPassword={true}
            leadingIcon={<KeyIcon size={16} color="#6B7280" />}
          />

          {/* Terms & Conditions Opt-in Controls */}
          <CivicCheckboxCard
            checkedAlerts={alertsEnabled}
            setCheckedAlerts={setAlertsEnabled}
            checkedConsensus={consensusEnabled}
            setCheckedConsensus={setConsensusEnabled}
          />

          {/* Sign Up CTA */}
          <CivicButton
            title="Sign Up"
            variant="primary"
            showArrow={true}
            onPress={handleSignUp}
            style={{ marginTop: 8 }}
          />

          {/* Legal Notice */}
          <Text style={styles.disclaimerText}>
            By activating this node, you agree to the CivicPulse Open Municipal Protocol and Citizen Privacy
            Directive. Verified with decentralized cryptographic consensus.
          </Text>

          {/* Already have a verified node link */}
          <View style={styles.signInPromptRow}>
            <Text style={styles.signInPromptText}>Already have a verified node? </Text>
            <TouchableOpacity onPress={() => setScreen('login')} activeOpacity={0.7}>
              <Text style={styles.signInLinkBold}>Sign In</Text>
            </TouchableOpacity>
          </View>
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 24 : 14,
    paddingBottom: 40,
    maxWidth: 460,
    alignSelf: 'center',
    width: '100%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  activeNodePill: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  agentNetworkPill: {
    backgroundColor: '#E5E7EB',
    marginTop: 14,
    marginBottom: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 13,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  formContainer: {
    width: '100%',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 0.8,
    marginTop: 12,
    marginBottom: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 0.6,
  },
  nameIconBox: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  autoDetectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  autoDetectText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  checkBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#374151',
    lineHeight: 12,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 16,
    paddingHorizontal: 8,
  },
  signInPromptRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signInPromptText: {
    fontSize: 13,
    color: '#4B5563',
  },
  signInLinkBold: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
});

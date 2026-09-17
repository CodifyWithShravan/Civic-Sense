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
import { MunicipalSealLogo, MailIcon, KeyIcon, ShieldLockIcon } from '../civic-icons';
import { CivicButton, CivicInput, CivicPillBadge } from '../civic-ui';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { login, setScreen } = useAuth();
  const [residentId, setResidentId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    await login(residentId || 'Shravan', passcode);
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await login('shravan@civicpulse.org', 'google_sso_token');
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Top Header & Emblem */}
        <View style={styles.headerSection}>
          <MunicipalSealLogo size={80} />
          <View style={styles.badgeWrapper}>
            <CivicPillBadge
              text="AUTONOMOUS MUNICIPAL GRID"
              dot={true}
              dotColor="#374151"
              style={styles.headerPill}
            />
            <Text style={styles.versionText}>v2.4</Text>
          </View>
          <Text style={styles.titleText}>Welcome, Citizen</Text>
        </View>

        {/* Main Card */}
        <View style={styles.card}>
          {/* Card Top Accent Line */}
          <View style={styles.cardTopBar} />

          {/* Google SSO Button */}
          <CivicButton
            title="Continue with Google"
            variant="google"
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          />

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR WITH CREDENTIALS</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email or Verified Resident ID */}
          <CivicInput
            label="Email or Verified Resident ID"
            trailingBadge={
              <View style={styles.protectedBadge}>
                <ShieldLockIcon size={12} color="#6B7280" />
                <Text style={styles.protectedText}>Protected</Text>
              </View>
            }
            leadingIcon={<MailIcon size={16} color="#6B7280" />}
            placeholder="name@neighborhood.org or RES-9483..."
            value={residentId}
            onChangeText={setResidentId}
            autoCapitalize="none"
          />

          {/* Passcode or Secure Key */}
          <CivicInput
            label="Passcode or Secure Key"
            trailingLabel="Forgot passcode?"
            leadingIcon={<KeyIcon size={16} color="#6B7280" />}
            placeholder="Enter cryptographic passcode"
            value={passcode}
            onChangeText={setPasscode}
            isPassword={true}
          />

          {/* Sign In CTA */}
          <CivicButton
            title="Sign In to CivicPulse"
            variant="primary"
            showArrow={true}
            onPress={handleSignIn}
            disabled={isLoading}
            style={{ marginTop: 14 }}
          />
        </View>

        {/* Bottom Registration & Legal Notice */}
        <View style={styles.footerSection}>
          <View style={styles.registerPromptRow}>
            <Text style={styles.footerPromptText}>No neighborhood account yet? </Text>
            <TouchableOpacity onPress={() => setScreen('register')} activeOpacity={0.7}>
              <Text style={styles.registerLinkBold}>Register Local Node</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.legalNoticeText}>
            By Connecting, You Agree to the CivicPulse Terms And Conditions
          </Text>
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
    paddingTop: Platform.OS === 'web' ? 40 : 20,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 440,
    alignSelf: 'center',
    width: '100%',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badgeWrapper: {
    alignItems: 'center',
    marginTop: 16,
  },
  headerPill: {
    backgroundColor: '#EAECEF',
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  versionText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  titleText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginTop: 8,
    letterSpacing: -0.5,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  cardTopBar: {
    width: 72,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 18,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
  },
  protectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  protectedText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  footerSection: {
    alignItems: 'center',
    marginTop: 28,
    width: '100%',
  },
  registerPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  footerPromptText: {
    fontSize: 13,
    color: '#4B5563',
  },
  registerLinkBold: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  legalNoticeText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 16,
  },
});

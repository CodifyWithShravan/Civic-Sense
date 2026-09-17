import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { EyeIcon, GoogleGIcon } from './civic-icons';

// 1. Pill Badge
export function CivicPillBadge({
  text,
  dot = true,
  dotColor = '#111827',
  icon,
  style,
}: {
  text: string;
  dot?: boolean;
  dotColor?: string;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.pillBadge, style]}>
      {dot && <View style={[styles.pillDot, { backgroundColor: dotColor }]} />}
      {icon && <View style={{ marginRight: 5 }}>{icon}</View>}
      <Text style={styles.pillText}>{text}</Text>
    </View>
  );
}

// 2. Button
export function CivicButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  showArrow = false,
  disabled = false,
  style,
}: {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'google' | 'white' | 'outline' | 'danger';
  icon?: React.ReactNode;
  showArrow?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  let buttonStyle: StyleProp<ViewStyle> = styles.btnPrimary;
  let textStyle: StyleProp<TextStyle> = styles.btnPrimaryText;

  if (variant === 'google') {
    buttonStyle = styles.btnGoogle;
    textStyle = styles.btnGoogleText;
  } else if (variant === 'white') {
    buttonStyle = styles.btnWhite;
    textStyle = styles.btnWhiteText;
  } else if (variant === 'outline') {
    buttonStyle = styles.btnOutline;
    textStyle = styles.btnOutlineText;
  } else if (variant === 'danger') {
    buttonStyle = styles.btnDanger;
    textStyle = styles.btnDangerText;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled}
      style={[styles.btnBase, buttonStyle, disabled ? { opacity: 0.6 } : null, style]}>
      {variant === 'google' && !icon ? <GoogleGIcon size={18} /> : icon}
      <Text style={[styles.btnBaseText, textStyle, (variant === 'google' || icon) ? { marginLeft: 10 } : null]}>
        {title}
      </Text>
      {showArrow && <Text style={[textStyle, styles.btnArrow]}> →</Text>}
    </TouchableOpacity>
  );
}

// 3. Form Input Field
interface CivicInputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  trailingLabel?: string;
  trailingBadge?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  isPassword?: boolean;
}

export function CivicInput({
  label,
  required,
  trailingLabel,
  trailingBadge,
  leadingIcon,
  trailingIcon,
  isPassword = false,
  ...inputProps
}: CivicInputProps) {
  const [showPassword, setShowPassword] = useState(!isPassword);

  return (
    <View style={styles.inputContainer}>
      {(label || trailingLabel || trailingBadge) && (
        <View style={styles.labelRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.inputLabel}>{label}</Text>
            {required && <Text style={styles.requiredText}> (Required)</Text>}
          </View>
          {trailingBadge || (trailingLabel ? <Text style={styles.trailingLabel}>{trailingLabel}</Text> : null)}
        </View>
      )}

      <View style={styles.inputWrapper}>
        {leadingIcon && <View style={styles.leadingIconWrapper}>{leadingIcon}</View>}
        <TextInput
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !showPassword}
          style={[styles.textInput, leadingIcon ? { paddingLeft: 40 } : null]}
          {...inputProps}
        />
        {isPassword ? (
          <TouchableOpacity
            style={styles.trailingIconWrapper}
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <EyeIcon size={18} color="#6B7280" crossed={!showPassword} />
          </TouchableOpacity>
        ) : (
          trailingIcon && <View style={styles.trailingIconWrapper}>{trailingIcon}</View>
        )}
      </View>
    </View>
  );
}

// 4. Terms & Conditions Card (Layout 2)
export function CivicCheckboxCard({
  checkedAlerts,
  setCheckedAlerts,
  checkedConsensus,
  setCheckedConsensus,
}: {
  checkedAlerts: boolean;
  setCheckedAlerts: (val: boolean) => void;
  checkedConsensus: boolean;
  setCheckedConsensus: (val: boolean) => void;
}) {
  return (
    <View style={styles.tcCard}>
      <View style={styles.tcHeaderRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 13, color: '#374151' }}>⚙</Text>
          <Text style={styles.tcTitle}>TERMS & CONDITIONS</Text>
        </View>
        <Text style={styles.tcOptIn}>Opt-in Controls</Text>
      </View>

      {/* Item 1 */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setCheckedAlerts(!checkedAlerts)}
        style={styles.tcItem}>
        <View style={[styles.checkbox, checkedAlerts && styles.checkboxActive]}>
          {checkedAlerts && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.tcItemTitle}>AI Agent Dispatch Alerts</Text>
          <Text style={styles.tcItemDesc}>
            Instant push pings when civic bots route pothole, electrical, or water repair tickets to field
            crews in your block.
          </Text>
        </View>
      </TouchableOpacity>

      {/* Item 2 */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setCheckedConsensus(!checkedConsensus)}
        style={[styles.tcItem, { marginTop: 14 }]}>
        <View style={[styles.checkbox, checkedConsensus && styles.checkboxActive]}>
          {checkedConsensus && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.tcItemTitle}>Community Consensus Protocol</Text>
          <Text style={styles.tcItemDesc}>
            Participate in decentralized confirmation votes to elevate critical neighborhood issues directly
            to City Hall.
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'center',
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  btnBase: {
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 6,
  },
  btnBaseText: {
    fontSize: 15,
    fontWeight: '600',
  },
  btnArrow: {
    fontSize: 16,
    fontWeight: '700',
  },
  btnPrimary: {
    backgroundColor: '#18181B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  btnGoogle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  btnGoogleText: {
    color: '#111827',
    fontWeight: '600',
  },
  btnWhite: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  btnWhiteText: {
    color: '#111827',
    fontWeight: '700',
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  btnOutlineText: {
    color: '#374151',
  },
  btnDanger: {
    backgroundColor: '#EF4444',
  },
  btnDangerText: {
    color: '#FFFFFF',
  },
  inputContainer: {
    marginVertical: 7,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  requiredText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  trailingLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  textInput: {
    height: 48,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#111827',
  },
  leadingIconWrapper: {
    position: 'absolute',
    left: 12,
    zIndex: 2,
  },
  trailingIconWrapper: {
    position: 'absolute',
    right: 12,
    zIndex: 2,
  },
  tcCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
  },
  tcHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  tcTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: 0.6,
  },
  tcOptIn: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  tcItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#18181B',
    borderColor: '#18181B',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 15,
  },
  tcItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  tcItemDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
  },
});

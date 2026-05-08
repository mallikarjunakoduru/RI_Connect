import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react-native';
import { colors, spacing, fontSize, borderRadius } from '../../constants';

type StatusType = 'success' | 'error' | 'warning' | 'info';

interface StatusMessageProps {
  type: StatusType;
  title?: string;
  message: string;
  visible?: boolean;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colorMap = {
  success: {
    bg: colors.successLight,
    border: colors.success,
    icon: colors.success,
    text: '#166534',
  },
  error: {
    bg: colors.errorLight,
    border: colors.error,
    icon: colors.error,
    text: '#991B1B',
  },
  warning: {
    bg: colors.warningLight,
    border: colors.warning,
    icon: colors.warning,
    text: '#92400E',
  },
  info: {
    bg: colors.infoLight,
    border: colors.info,
    icon: colors.info,
    text: '#1E40AF',
  },
};

export function StatusMessage({
  type,
  title,
  message,
  visible = true,
}: StatusMessageProps) {
  if (!visible) return null;

  const Icon = iconMap[type];
  const colorScheme = colorMap[type];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colorScheme.bg, borderColor: colorScheme.border },
      ]}
    >
      <Icon size={20} color={colorScheme.icon} style={styles.icon} />
      <View style={styles.content}>
        {title && (
          <Text style={[styles.title, { color: colorScheme.text }]}>{title}</Text>
        )}
        <Text style={[styles.message, { color: colorScheme.text }]}>
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  icon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
});

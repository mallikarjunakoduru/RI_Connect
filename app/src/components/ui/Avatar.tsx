import React from 'react';
import { View, Image, Text, StyleSheet, ImageStyle, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../../constants';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

const fontSizeMap: Record<AvatarSize, number> = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
};

export function Avatar({ source, name, size = 'md', style }: AvatarProps) {
  const dimension = sizeMap[size];

  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getBackgroundColor = (name?: string) => {
    if (!name) return colors.textTertiary;
    const charCode = name.charCodeAt(0);
    const colorOptions = [
      colors.primary,
      colors.secondary,
      colors.accent,
      '#8B5CF6',
      '#EC4899',
      '#14B8A6',
    ];
    return colorOptions[charCode % colorOptions.length];
  };

  if (source) {
    return (
      <View style={style}>
        <Image
          source={{ uri: source }}
          style={[
            styles.image,
            { width: dimension, height: dimension, borderRadius: dimension / 2 },
          ]}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: getBackgroundColor(name),
        },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize: fontSizeMap[size] }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceSecondary,
  },

  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  initials: {
    color: colors.textInverse,
    fontWeight: '600',
  },
});

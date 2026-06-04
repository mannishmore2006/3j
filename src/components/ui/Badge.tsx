import React from 'react';
import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, Fonts } from '@/constants/theme';

interface BadgeProps {
  text: string;
  status?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({ text, status = 'default', style, textStyle }: BadgeProps) {
  const theme = useTheme();

  const getStyles = () => {
    let backgroundColor = theme.backgroundElement;
    let color = theme.text;

    switch (status) {
      case 'success':
        backgroundColor = theme.successLight;
        color = theme.success;
        break;
      case 'warning':
        backgroundColor = theme.warningLight;
        color = theme.warning;
        break;
      case 'danger':
        backgroundColor = theme.dangerLight;
        color = theme.danger;
        break;
      case 'info':
        backgroundColor = theme.infoLight;
        color = theme.info;
        break;
      case 'default':
        backgroundColor = theme.backgroundElement;
        color = theme.textSecondary;
        break;
    }

    return {
      container: {
        backgroundColor,
        paddingHorizontal: Spacing.two,
        paddingVertical: Spacing.half,
        borderRadius: 12,
        alignSelf: 'flex-start' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
      },
      text: {
        color,
        fontSize: 11,
        fontWeight: '700' as const,
        textTransform: 'uppercase' as const,
        fontFamily: Fonts.sans,
      },
    };
  };

  const currentStyles = getStyles();

  return (
    <View style={[currentStyles.container, style]}>
      <Text style={[currentStyles.text, textStyle]}>{text}</Text>
    </View>
  );
}

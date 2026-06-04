import React from 'react';
import { StyleSheet, Pressable, View, ViewStyle, Platform } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  type?: 'default' | 'flat' | 'outline' | 'interactive';
  onPress?: () => void;
}

export function Card({ children, style, type = 'default', onPress }: CardProps) {
  const theme = useTheme();

  const isInteractive = type === 'interactive' || onPress !== undefined;

  const cardStyle: ViewStyle = {
    backgroundColor: theme.card,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    borderColor: theme.border,
    borderWidth: type === 'outline' ? 1 : 0,
  };

  // Add shadow styles for default/interactive types
  if (type === 'default' || type === 'interactive') {
    Object.assign(cardStyle, Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
      }
    }));
  }

  if (isInteractive) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          style,
          pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
}

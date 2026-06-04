import React from 'react';
import { StyleSheet, Pressable, Text, ActivityIndicator, View, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, Fonts } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const theme = useTheme();

  const getStyles = () => {
    let buttonBg = theme.primary;
    let buttonBorderColor = 'transparent';
    let textColor = '#FFFFFF';
    let borderWidth = 0;

    switch (variant) {
      case 'primary':
        buttonBg = theme.primary;
        textColor = '#FFFFFF';
        break;
      case 'secondary':
        buttonBg = theme.backgroundSelected;
        textColor = theme.primary;
        break;
      case 'outline':
        buttonBg = 'transparent';
        buttonBorderColor = theme.border;
        textColor = theme.text;
        borderWidth = 1;
        break;
      case 'danger':
        buttonBg = theme.danger;
        textColor = '#FFFFFF';
        break;
      case 'text':
        buttonBg = 'transparent';
        textColor = theme.primary;
        break;
    }

    if (disabled) {
      buttonBg = theme.backgroundElement;
      textColor = theme.textSecondary;
      buttonBorderColor = 'transparent';
      borderWidth = 0;
    }

    let paddingVertical = Spacing.two;
    let paddingHorizontal = Spacing.three;
    let fontSize = 14;
    let borderRadius = Spacing.two;

    if (size === 'small') {
      paddingVertical = Spacing.one * 1.5;
      paddingHorizontal = Spacing.two;
      fontSize = 12;
      borderRadius = Spacing.one * 1.5;
    } else if (size === 'large') {
      paddingVertical = Spacing.three;
      paddingHorizontal = Spacing.five;
      fontSize = 16;
      borderRadius = Spacing.three;
    }

    return {
      button: {
        backgroundColor: buttonBg,
        borderColor: buttonBorderColor,
        borderWidth,
        borderRadius,
        paddingVertical,
        paddingHorizontal,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        opacity: disabled || loading ? 0.6 : 1,
      },
      text: {
        color: textColor,
        fontSize,
        fontWeight: '600' as const,
        fontFamily: Fonts.sans,
      },
    };
  };

  const currentStyles = getStyles();

  return (
    <Pressable
      onPress={disabled || loading ? undefined : onPress}
      style={({ pressed }) => [
        currentStyles.button,
        style,
        pressed && !disabled && !loading && { transform: [{ scale: 0.98 }], opacity: 0.9 },
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'text' || variant === 'secondary' ? theme.primary : '#FFFFFF'}
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[currentStyles.text, textStyle]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: Spacing.two,
  },
});

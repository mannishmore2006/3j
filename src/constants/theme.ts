/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Standard keys
    text: '#0F172A', // Slate 900
    background: '#F8FAFC', // Slate 50
    backgroundElement: '#E2E8F0', // Slate 200
    backgroundSelected: '#DBEAFE', // Blue 100
    textSecondary: '#64748B', // Slate 500
    
    // Custom premium keys
    primary: '#2563EB', // Blue 600
    primaryLight: '#EFF6FF', // Blue 50
    card: '#FFFFFF',
    border: '#E2E8F0', // Slate 200
    success: '#10B981', // Emerald 500
    successLight: '#D1FAE5', // Emerald 100
    danger: '#EF4444', // Red 500
    dangerLight: '#FEE2E2', // Red 100
    warning: '#F59E0B', // Amber 500
    warningLight: '#FEF3C7', // Amber 100
    info: '#06B6D4', // Cyan 500
    infoLight: '#ECFEFF', // Cyan 100
  },
  dark: {
    // Standard keys
    text: '#F8FAFC', // Slate 50
    background: '#090D16', // Dark background
    backgroundElement: '#1E293B', // Slate 800
    backgroundSelected: '#1E3A8A', // Blue 900
    textSecondary: '#94A3B8', // Slate 400
    
    // Custom premium keys
    primary: '#3B82F6', // Blue 500
    primaryLight: '#172554', // Blue 950
    card: '#0F172A', // Slate 900
    border: '#1E293B', // Slate 800
    success: '#34D399', // Emerald 400
    successLight: '#064E3B', // Emerald 950
    danger: '#F87171', // Red 400
    dangerLight: '#7F1D1D', // Red 950
    warning: '#FBBF24', // Amber 400
    warningLight: '#78350F', // Amber 950
    info: '#22D3EE', // Cyan 400
    infoLight: '#083344', // Cyan 950
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Courier',
  },
  default: {
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },
  web: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    serif: 'Georgia, serif',
    rounded: 'Inter, system-ui, sans-serif',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 65, android: 75 }) ?? 0;
export const MaxContentWidth = 750;


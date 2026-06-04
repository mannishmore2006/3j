import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface IconProps {
  name:
    | 'home'
    | 'users'
    | 'calendar'
    | 'clock'
    | 'user'
    | 'search'
    | 'plus'
    | 'check'
    | 'x'
    | 'chevron-right'
    | 'chevron-left'
    | 'logout'
    | 'sun'
    | 'moon'
    | 'settings'
    | 'briefcase'
    | 'mail'
    | 'key';
  color?: string;
  size?: number;
  style?: ViewStyle;
}

export function Icon({ name, color = '#000000', size = 24, style }: IconProps) {
  const s = size;
  const strokeWidth = s * 0.085;

  const renderIconContent = () => {
    switch (name) {
      case 'home':
        return (
          <View style={[styles.center, { width: s, height: s }]}>
            {/* Roof */}
            <View
              style={{
                width: s * 0.7,
                height: s * 0.7,
                borderTopWidth: strokeWidth * 1.2,
                borderLeftWidth: strokeWidth * 1.2,
                borderColor: color,
                transform: [{ rotate: '45deg' }],
                position: 'absolute',
                top: s * 0.1,
              }}
            />
            {/* Body */}
            <View
              style={{
                width: s * 0.6,
                height: s * 0.5,
                borderWidth: strokeWidth,
                borderTopWidth: 0,
                borderColor: color,
                position: 'absolute',
                bottom: s * 0.15,
                backgroundColor: 'transparent',
              }}
            />
            {/* Door */}
            <View
              style={{
                width: s * 0.2,
                height: s * 0.25,
                backgroundColor: color,
                position: 'absolute',
                bottom: s * 0.15,
              }}
            />
          </View>
        );

      case 'users':
        return (
          <View style={[styles.center, { width: s, height: s }]}>
            {/* Main User */}
            <View
              style={{
                width: s * 0.35,
                height: s * 0.35,
                borderRadius: s * 0.2,
                borderWidth: strokeWidth,
                borderColor: color,
                position: 'absolute',
                top: s * 0.1,
                left: s * 0.32,
              }}
            />
            <View
              style={{
                width: s * 0.6,
                height: s * 0.3,
                borderTopLeftRadius: s * 0.25,
                borderTopRightRadius: s * 0.25,
                borderWidth: strokeWidth,
                borderColor: color,
                position: 'absolute',
                bottom: s * 0.1,
                left: s * 0.2,
              }}
            />
            {/* Secondary User (Background) */}
            <View
              style={{
                width: s * 0.28,
                height: s * 0.28,
                borderRadius: s * 0.15,
                borderWidth: strokeWidth,
                borderColor: color,
                opacity: 0.6,
                position: 'absolute',
                top: s * 0.18,
                left: s * 0.08,
              }}
            />
            <View
              style={{
                width: s * 0.45,
                height: s * 0.2,
                borderTopLeftRadius: s * 0.2,
                borderTopRightRadius: s * 0.2,
                borderWidth: strokeWidth,
                borderColor: color,
                opacity: 0.6,
                position: 'absolute',
                bottom: s * 0.18,
                left: s * 0.02,
              }}
            />
          </View>
        );

      case 'calendar':
        return (
          <View style={[styles.center, { width: s, height: s }]}>
            {/* Main Box */}
            <View
              style={{
                width: s * 0.8,
                height: s * 0.7,
                borderRadius: s * 0.1,
                borderWidth: strokeWidth,
                borderColor: color,
                position: 'absolute',
                bottom: s * 0.08,
              }}
            >
              {/* Grid Line */}
              <View
                style={{
                  width: '100%',
                  height: strokeWidth,
                  backgroundColor: color,
                  position: 'absolute',
                  top: s * 0.18,
                }}
              />
              {/* Event Dots */}
              <View
                style={{
                  width: s * 0.08,
                  height: s * 0.08,
                  borderRadius: s * 0.04,
                  backgroundColor: color,
                  position: 'absolute',
                  top: s * 0.35,
                  left: s * 0.15,
                }}
              />
              <View
                style={{
                  width: s * 0.08,
                  height: s * 0.08,
                  borderRadius: s * 0.04,
                  backgroundColor: color,
                  position: 'absolute',
                  top: s * 0.35,
                  left: s * 0.35,
                }}
              />
              <View
                style={{
                  width: s * 0.08,
                  height: s * 0.08,
                  borderRadius: s * 0.04,
                  backgroundColor: color,
                  position: 'absolute',
                  top: s * 0.35,
                  left: s * 0.55,
                }}
              />
            </View>
            {/* Left Binder peg */}
            <View
              style={{
                width: strokeWidth * 1.2,
                height: s * 0.2,
                backgroundColor: color,
                borderRadius: strokeWidth,
                position: 'absolute',
                top: s * 0.08,
                left: s * 0.25,
              }}
            />
            {/* Right Binder peg */}
            <View
              style={{
                width: strokeWidth * 1.2,
                height: s * 0.2,
                backgroundColor: color,
                borderRadius: strokeWidth,
                position: 'absolute',
                top: s * 0.08,
                right: s * 0.25,
              }}
            />
          </View>
        );

      case 'clock':
        return (
          <View style={[styles.center, { width: s, height: s }]}>
            {/* Outer Circle */}
            <View
              style={{
                width: s * 0.85,
                height: s * 0.85,
                borderRadius: (s * 0.85) / 2,
                borderWidth: strokeWidth,
                borderColor: color,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* Hour Hand */}
              <View
                style={{
                  width: strokeWidth,
                  height: s * 0.25,
                  backgroundColor: color,
                  borderRadius: strokeWidth / 2,
                  position: 'absolute',
                  top: s * 0.17,
                }}
              />
              {/* Minute Hand */}
              <View
                style={{
                  width: s * 0.25,
                  height: strokeWidth,
                  backgroundColor: color,
                  borderRadius: strokeWidth / 2,
                  position: 'absolute',
                  right: s * 0.17,
                }}
              />
              {/* Center Pin */}
              <View
                style={{
                  width: strokeWidth * 1.5,
                  height: strokeWidth * 1.5,
                  borderRadius: (strokeWidth * 1.5) / 2,
                  backgroundColor: color,
                }}
              />
            </View>
          </View>
        );

      case 'user':
        return (
          <View style={[styles.center, { width: s, height: s }]}>
            {/* Head */}
            <View
              style={{
                width: s * 0.45,
                height: s * 0.45,
                borderRadius: (s * 0.45) / 2,
                borderWidth: strokeWidth,
                borderColor: color,
                position: 'absolute',
                top: s * 0.08,
              }}
            />
            {/* Shoulders */}
            <View
              style={{
                width: s * 0.8,
                height: s * 0.35,
                borderTopLeftRadius: s * 0.3,
                borderTopRightRadius: s * 0.3,
                borderWidth: strokeWidth,
                borderColor: color,
                position: 'absolute',
                bottom: s * 0.08,
              }}
            />
          </View>
        );

      case 'search':
        return (
          <View style={[styles.center, { width: s, height: s }]}>
            {/* Lens */}
            <View
              style={{
                width: s * 0.55,
                height: s * 0.55,
                borderRadius: (s * 0.55) / 2,
                borderWidth: strokeWidth,
                borderColor: color,
                position: 'absolute',
                top: s * 0.1,
                left: s * 0.1,
              }}
            />
            {/* Handle */}
            <View
              style={{
                width: strokeWidth,
                height: s * 0.4,
                backgroundColor: color,
                borderRadius: strokeWidth / 2,
                transform: [{ rotate: '-45deg' }],
                position: 'absolute',
                bottom: s * 0.08,
                right: s * 0.15,
              }}
            />
          </View>
        );

      case 'plus':
        return (
          <View style={[styles.center, { width: s, height: s }]}>
            <View
              style={{
                width: s * 0.7,
                height: strokeWidth,
                backgroundColor: color,
                borderRadius: strokeWidth / 2,
                position: 'absolute',
              }}
            />
            <View
              style={{
                width: strokeWidth,
                height: s * 0.7,
                backgroundColor: color,
                borderRadius: strokeWidth / 2,
                position: 'absolute',
              }}
            />
          </View>
        );

      case 'check':
        return (
          <View style={[styles.center, { width: s, height: s }]}>
            <View
              style={{
                width: s * 0.3,
                height: strokeWidth,
                backgroundColor: color,
                borderRadius: strokeWidth / 2,
                transform: [{ rotate: '45deg' }],
                position: 'absolute',
                left: s * 0.18,
                bottom: s * 0.35,
              }}
            />
            <View
              style={{
                width: s * 0.6,
                height: strokeWidth,
                backgroundColor: color,
                borderRadius: strokeWidth / 2,
                transform: [{ rotate: '-45deg' }],
                position: 'absolute',
                right: s * 0.15,
                top: s * 0.42,
              }}
            />
          </View>
        );

      case 'x':
        return (
          <View style={[styles.center, { width: s, height: s }]}>
            <View
              style={{
                width: s * 0.7,
                height: strokeWidth,
                backgroundColor: color,
                borderRadius: strokeWidth / 2,
                transform: [{ rotate: '45deg' }],
                position: 'absolute',
              }}
            />
            <View
              style={{
                width: s * 0.7,
                height: strokeWidth,
                backgroundColor: color,
                borderRadius: strokeWidth / 2,
                transform: [{ rotate: '-45deg' }],
                position: 'absolute',
              }}
            />
          </View>
        );

      case 'chevron-right':
        return (
          <View style={[styles.center, { width: s, height: s }]}>
            <View
              style={{
                width: s * 0.4,
                height: s * 0.4,
                borderTopWidth: strokeWidth * 1.2,
                borderRightWidth: strokeWidth * 1.2,
                borderColor: color,
                transform: [{ rotate: '45deg' }],
                marginLeft: -s * 0.1,
              }}
            />
          </View>
        );

      case 'chevron-left':
        return (
          <View style={[styles.center, { width: s, height: s }]}>
            <View
              style={{
                width: s * 0.4,
                height: s * 0.4,
                borderBottomWidth: strokeWidth * 1.2,
                borderLeftWidth: strokeWidth * 1.2,
                borderColor: color,
                transform: [{ rotate: '45deg' }],
                marginRight: -s * 0.1,
              }}
            />
          </View>
        );

      case 'logout':
        return (
          <View style={[styles.center, { width: s, height: s }]}>
            {/* Box */}
            <View
              style={{
                width: s * 0.5,
                height: s * 0.7,
                borderWidth: strokeWidth,
                borderRightWidth: 0,
                borderColor: color,
                borderTopLeftRadius: s * 0.08,
                borderBottomLeftRadius: s * 0.08,
                position: 'absolute',
                left: s * 0.1,
              }}
            />
            {/* Arrow */}
            <View
              style={{
                width: s * 0.35,
                height: strokeWidth,
                backgroundColor: color,
                position: 'absolute',
                right: s * 0.18,
              }}
            />
            <View
              style={{
                width: s * 0.2,
                height: s * 0.2,
                borderTopWidth: strokeWidth,
                borderRightWidth: strokeWidth,
                borderColor: color,
                transform: [{ rotate: '45deg' }],
                position: 'absolute',
                right: s * 0.18,
              }}
            />
          </View>
        );

      case 'sun':
        return (
          <View style={[styles.center, { width: s, height: s }]}>
            <View
              style={{
                width: s * 0.45,
                height: s * 0.45,
                borderRadius: (s * 0.45) / 2,
                borderWidth: strokeWidth,
                borderColor: color,
              }}
            />
            {/* Rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <View
                key={deg}
                style={{
                  width: strokeWidth,
                  height: s * 0.15,
                  backgroundColor: color,
                  position: 'absolute',
                  borderRadius: strokeWidth / 2,
                  transform: [{ rotate: `${deg}deg` }, { translateY: -s * 0.35 }],
                }}
              />
            ))}
          </View>
        );

      case 'moon':
        return (
          <View style={[styles.center, { width: s, height: s }]}>
            <View
              style={{
                width: s * 0.65,
                height: s * 0.65,
                borderRadius: (s * 0.65) / 2,
                borderWidth: strokeWidth,
                borderColor: color,
                borderBottomColor: 'transparent',
                borderLeftColor: 'transparent',
                transform: [{ rotate: '-45deg' }],
              }}
            />
          </View>
        );

      case 'settings':
        return (
          <View style={[styles.center, { width: s, height: s }]}>
            {/* Gear Ring */}
            <View
              style={{
                width: s * 0.5,
                height: s * 0.5,
                borderRadius: (s * 0.5) / 2,
                borderWidth: strokeWidth * 1.2,
                borderColor: color,
              }}
            />
            {/* Gear teeth */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <View
                key={deg}
                style={{
                  width: strokeWidth * 1.5,
                  height: strokeWidth * 1.5,
                  backgroundColor: color,
                  position: 'absolute',
                  transform: [{ rotate: `${deg}deg` }, { translateY: -s * 0.28 }],
                  borderRadius: strokeWidth * 0.3,
                }}
              />
            ))}
          </View>
        );

      case 'briefcase':
        return (
          <View style={[styles.center, { width: s, height: s }]}>
            <View
              style={{
                width: s * 0.8,
                height: s * 0.55,
                borderWidth: strokeWidth,
                borderColor: color,
                borderRadius: s * 0.08,
                position: 'absolute',
                bottom: s * 0.1,
              }}
            >
              {/* Lock latch */}
              <View
                style={{
                  width: s * 0.12,
                  height: s * 0.1,
                  backgroundColor: color,
                  alignSelf: 'center',
                  marginTop: s * 0.15,
                }}
              />
            </View>
            {/* Handle */}
            <View
              style={{
                width: s * 0.35,
                height: s * 0.2,
                borderWidth: strokeWidth,
                borderBottomWidth: 0,
                borderColor: color,
                borderTopLeftRadius: s * 0.06,
                borderTopRightRadius: s * 0.06,
                position: 'absolute',
                top: s * 0.16,
              }}
            />
          </View>
        );

      case 'mail':
        return (
          <View style={[styles.center, { width: s, height: s }]}>
            <View
              style={{
                width: s * 0.8,
                height: s * 0.6,
                borderWidth: strokeWidth,
                borderColor: color,
                borderRadius: s * 0.08,
                justifyContent: 'center',
              }}
            >
              {/* Envelope flap lines */}
              <View
                style={{
                  width: s * 0.45,
                  height: s * 0.45,
                  borderRightWidth: strokeWidth,
                  borderBottomWidth: strokeWidth,
                  borderColor: color,
                  transform: [{ rotate: '45deg' }, { translateY: -s * 0.15 }, { translateX: -s * 0.05 }],
                  position: 'absolute',
                  alignSelf: 'center',
                }}
              />
            </View>
          </View>
        );

      case 'key':
        return (
          <View style={[styles.center, { width: s, height: s }]}>
            {/* Head Ring */}
            <View
              style={{
                width: s * 0.42,
                height: s * 0.42,
                borderRadius: (s * 0.42) / 2,
                borderWidth: strokeWidth,
                borderColor: color,
                position: 'absolute',
                top: s * 0.1,
                left: s * 0.1,
              }}
            />
            {/* Shaft */}
            <View
              style={{
                width: strokeWidth,
                height: s * 0.5,
                backgroundColor: color,
                position: 'absolute',
                bottom: s * 0.1,
                right: s * 0.25,
                transform: [{ rotate: '-45deg' }],
              }}
            >
              {/* Teeth */}
              <View
                style={{
                  width: s * 0.15,
                  height: strokeWidth,
                  backgroundColor: color,
                  position: 'absolute',
                  right: -s * 0.12,
                  top: s * 0.1,
                }}
              />
              <View
                style={{
                  width: s * 0.12,
                  height: strokeWidth,
                  backgroundColor: color,
                  position: 'absolute',
                  right: -s * 0.1,
                  top: s * 0.28,
                }}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return <View style={[styles.container, style]}>{renderIconContent()}</View>;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});

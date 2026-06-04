import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ViewStyle, TextStyle, KeyboardTypeOptions, Pressable } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, Fonts } from '@/constants/theme';
import { Icon } from './Icon';

interface InputFieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  iconName?: React.ComponentProps<typeof Icon>['name'];
  style?: ViewStyle;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  iconName,
  style,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true,
  multiline = false,
  numberOfLines = 1,
}: InputFieldProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(secureTextEntry);

  const togglePasswordVisibility = () => {
    setHidePassword(prev => !prev);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: error ? theme.danger : theme.textSecondary }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.card,
            borderColor: error
              ? theme.danger
              : isFocused
              ? theme.primary
              : theme.border,
          },
          multiline && { height: Spacing.four * numberOfLines },
        ]}
      >
        {iconName && (
          <View style={styles.iconContainer}>
            <Icon
              name={iconName}
              size={18}
              color={error ? theme.danger : isFocused ? theme.primary : theme.textSecondary}
            />
          </View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary + '80'}
          secureTextEntry={hidePassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            {
              color: editable ? theme.text : theme.textSecondary,
              fontFamily: Fonts.sans,
            },
            multiline && { textAlignVertical: 'top', paddingTop: Spacing.two },
          ]}
        />
        {secureTextEntry && (
          <Pressable onPress={togglePasswordVisibility} style={styles.eyeButton}>
            <Icon
              name={hidePassword ? 'key' : 'user'} // We can use key for hidden, user/default for visible
              size={18}
              color={theme.textSecondary}
            />
          </Pressable>
        )}
      </View>
      {error && (
        <Text style={[styles.errorText, { color: theme.danger }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing.three,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.one,
    marginLeft: Spacing.half,
  },
  inputContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  iconContainer: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    padding: 0,
    outlineStyle: 'none', // Remove web outline
  } as TextStyle & { outlineStyle?: string },
  eyeButton: {
    padding: Spacing.one,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: Spacing.one,
    marginLeft: Spacing.half,
  },
});

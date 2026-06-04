import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, Fonts } from '@/constants/theme';
import { Card } from '../ui/Card';
import { InputField } from '../ui/InputField';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

export function LoginScreen() {
  const { login, signup } = useApp();
  const theme = useTheme();

  // Mode states: login or signup
  const [isSignUp, setIsSignUp] = useState(false);

  // Form states
  const [role, setRole] = useState<'employer' | 'employee'>('employee');
  const [email, setEmail] = useState('john@company.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [error, setError] = useState('');

  const handleQuickLogin = (selectedRole: 'employer' | 'employee') => {
    setRole(selectedRole);
    if (selectedRole === 'employer') {
      setEmail('jane@company.com'); // HR Generalist / Employer Admin
    } else {
      setEmail('john@company.com'); // Employee
    }
    setPassword('password123');
    setError('');
  };

  const handleSignIn = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        // Backend login succeeded, sync with local context by calling login with token and user payload
        login(role, email, data.token, data.user);
        return;
      } else {
        setError(data.error || 'Invalid email or password');
        return;
      }
    } catch (err) {
      console.warn('Backend offline, running local login backup...', err);
      const success = login(role, email);
      if (!success) {
        setError(
          role === 'employer'
            ? 'Failed to log in as employer'
            : 'Employee not found with this email'
        );
      }
    }
  };

  const handleSignUp = async () => {
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    // Try backend signup first
    try {
      const response = await fetch('http://127.0.0.1:5000/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
          role,
          department: role === 'employee' ? department : undefined
        })
      });
      const data = await response.json();
      if (response.ok) {
        // Signup succeeded, sync with local context with token and user payload
        signup(role, email, name, role === 'employee' ? department : undefined, data.token, data.user);
        return;
      } else {
        setError(data.error || 'Failed to create account');
        return;
      }
    } catch (err) {
      console.warn('Backend offline, running local-only signup backup...', err);
      // Fallback to local context signup
      const success = signup(role, email, name, role === 'employee' ? department : undefined);
      if (!success) {
        setError('Failed to create account');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={{ backgroundColor: theme.background }}>
      <View style={styles.cardContainer}>
        {/* Brand Logo Header */}
        <View style={styles.logoHeader}>
          <View style={[styles.logoIcon, { backgroundColor: theme.primary }]}>
            <Icon name="briefcase" color="#FFFFFF" size={28} />
          </View>
          <Text style={[styles.brandText, { color: theme.text }]}>
            Sync<Text style={{ color: theme.primary }}>HR</Text>
          </Text>
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>
            Modern Workplace Management SaaS
          </Text>
        </View>

        <Card style={styles.card}>
          <Text style={[styles.title, { color: theme.text }]}>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {isSignUp ? 'Register to get started with SyncHR' : 'Enter your credentials to access the portal'}
          </Text>

          {/* Role Tab Switcher */}
          <View style={[styles.tabBar, { backgroundColor: theme.backgroundElement }]}>
            <Pressable
              onPress={() => handleQuickLogin('employee')}
              style={[
                styles.tab,
                role === 'employee' && [styles.activeTab, { backgroundColor: theme.card }],
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: role === 'employee' ? theme.primary : theme.textSecondary },
                ]}
              >
                Employee App
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleQuickLogin('employer')}
              style={[
                styles.tab,
                role === 'employer' && [styles.activeTab, { backgroundColor: theme.card }],
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: role === 'employer' ? theme.primary : theme.textSecondary },
                ]}
              >
                Employer Portal
              </Text>
            </Pressable>
          </View>

          {error ? (
            <View style={[styles.errorContainer, { backgroundColor: theme.dangerLight }]}>
              <Icon name="x" color={theme.danger} size={16} style={{ marginRight: Spacing.two }} />
              <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
            </View>
          ) : null}

          {/* Fields */}
          {isSignUp && (
            <InputField
              label="Full Name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError('');
              }}
              placeholder="Johnathan Davis"
              iconName="user"
              autoCapitalize="words"
            />
          )}

          <InputField
            label="Email Address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            placeholder="name@company.com"
            iconName="mail"
            keyboardType="email-address"
          />

          <InputField
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            placeholder="••••••••"
            iconName="key"
            secureTextEntry={true}
          />

          {isSignUp && role === 'employee' && (
            <View style={{ marginBottom: Spacing.three }}>
              <Text style={[styles.selectorLabel, { color: theme.textSecondary }]}>Department / Class</Text>
              <View style={styles.selectorGroup}>
                {['Engineering', 'Design', 'HR', 'Sales'].map((d) => (
                  <Pressable
                    key={d}
                    onPress={() => setDepartment(d)}
                    style={[
                      styles.selectorItem,
                      { borderColor: theme.border, backgroundColor: theme.background },
                      department === d && { borderColor: theme.primary, backgroundColor: theme.primaryLight },
                    ]}
                  >
                    <Text
                      style={[
                        styles.selectorText,
                        { color: theme.text },
                        department === d && { color: theme.primary, fontWeight: '700' },
                      ]}
                    >
                      {d}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {!isSignUp && (
            <View style={styles.forgotRow}>
              <Pressable onPress={() => setError('Password reset instructions sent to your email!')}>
                <Text style={[styles.forgotText, { color: theme.primary }]}>
                  Forgot Password?
                </Text>
              </Pressable>
            </View>
          )}

          <Button
            title={isSignUp ? 'Create Account' : `Sign In as ${role === 'employer' ? 'Employer' : 'Employee'}`}
            onPress={isSignUp ? handleSignUp : handleSignIn}
            size="large"
            style={styles.signInButton}
          />

          {/* Toggle Login/Signup mode */}
          <View style={styles.toggleModeRow}>
            <Text style={[styles.toggleModeText, { color: theme.textSecondary }]}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <Pressable onPress={() => { setIsSignUp(!isSignUp); setError(''); }}>
              <Text style={[styles.toggleModeLink, { color: theme.primary }]}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </Pressable>
          </View>

          {/* Demo Helper Card */}
          {!isSignUp && (
            <View style={[styles.demoCard, { borderColor: theme.border, backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.demoTitle, { color: theme.primary }]}>
                Demo Quick Connect
              </Text>
              <Text style={[styles.demoText, { color: theme.textSecondary }]}>
                Tap below to fill credentials and login instantly:
              </Text>
              <View style={styles.quickButtonsRow}>
                <Button
                  title="Jane (HR / Employer)"
                  onPress={() => handleQuickLogin('employer')}
                  variant="outline"
                  size="small"
                  style={styles.quickButton}
                  textStyle={{ fontSize: 11 }}
                />
                <Button
                  title="John (Employee)"
                  onPress={() => handleQuickLogin('employee')}
                  variant="outline"
                  size="small"
                  style={styles.quickButton}
                  textStyle={{ fontSize: 11 }}
                />
              </View>
            </View>
          )}
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  logoHeader: {
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.two,
    ...Platform.select({
      ios: {
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)',
      },
    }),
  },
  brandText: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: Fonts.sans,
  },
  tagline: {
    fontSize: 14,
    marginTop: Spacing.half,
    textAlign: 'center',
    fontWeight: '500',
  },
  card: {
    width: '100%',
    padding: Spacing.four,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: Fonts.sans,
  },
  subtitle: {
    fontSize: 14,
    marginTop: Spacing.one,
    marginBottom: Spacing.four,
    fontWeight: '500',
    lineHeight: 18,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: Spacing.two,
    padding: Spacing.one,
    marginBottom: Spacing.four,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    borderRadius: Spacing.one * 1.5,
  },
  activeTab: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.three,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
  },
  signInButton: {
    width: '100%',
    height: 48,
    marginBottom: Spacing.four,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.two,
    marginBottom: Spacing.three,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  toggleModeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.one,
    marginBottom: Spacing.three,
  },
  toggleModeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  toggleModeLink: {
    fontSize: 13,
    fontWeight: '700',
  },
  selectorLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.one,
    marginLeft: Spacing.half,
  },
  selectorGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  selectorItem: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 1.5,
  },
  selectorText: {
    fontSize: 13,
    fontWeight: '600',
  },
  demoCard: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    marginTop: Spacing.two,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: Spacing.half,
  },
  demoText: {
    fontSize: 11,
    marginBottom: Spacing.two,
    fontWeight: '500',
  },
  quickButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  quickButton: {
    flex: 1,
    paddingVertical: Spacing.one * 1.2,
    backgroundColor: '#FFFFFF',
  },
});

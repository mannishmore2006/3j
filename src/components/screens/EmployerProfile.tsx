import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch, Pressable, Platform, ScrollView } from 'react-native';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, Fonts, BottomTabInset } from '@/constants/theme';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';

export function EmployerProfile() {
  const { logout, themeMode, toggleTheme } = useApp();
  const theme = useTheme();

  // Mock setting states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [autoApproveLeaves, setAutoApproveLeaves] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Company Details Card */}
      <Card style={styles.companyCard} type="default">
        <View style={[styles.avatarCircle, { backgroundColor: theme.primaryLight }]}>
          <Icon name="briefcase" color={theme.primary} size={30} />
        </View>
        <Text style={[styles.companyName, { color: theme.text }]}>SyncHR SaaS Corp</Text>
        <Text style={[styles.workspaceId, { color: theme.textSecondary }]}>
          Workspace ID: synchr-corp-premium
        </Text>
        <Text style={[styles.statusText, { color: theme.success }]}>
          ● Enterprise Tier License
        </Text>
      </Card>

      {/* Settings Sections */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Portal Preferences</Text>
      <Card style={styles.settingsCard} type="outline">
        {/* Theme mode toggle */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Icon name={themeMode === 'dark' ? 'moon' : 'sun'} color={theme.text} size={20} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>Toggle dark visual theme</Text>
            </View>
          </View>
          <Switch
            value={themeMode === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Notifications toggle */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Icon name="calendar" color={theme.text} size={20} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Push Notifications</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>Alert on new leave requests</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Biometrics */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Icon name="shield" color={theme.text} size={20} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Secure Access</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>Require passcode on portal entry</Text>
            </View>
          </View>
          <Switch
            value={biometricsEnabled}
            onValueChange={setBiometricsEnabled}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Auto Approve Leaves */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Icon name="check" color={theme.text} size={20} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Smart Approvals</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>Auto-approve sick leaves under 1 day</Text>
            </View>
          </View>
          <Switch
            value={autoApproveLeaves}
            onValueChange={setAutoApproveLeaves}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
          />
        </View>
      </Card>

      {/* Sign Out Card */}
      <Button
        title="Sign Out of Portal"
        onPress={logout}
        variant="danger"
        size="large"
        icon={<Icon name="logout" color="#FFFFFF" size={18} />}
        style={styles.signOutBtn}
      />

      <View style={styles.footerInfo}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          SyncHR HR-Portal v1.2.0 • Powered by Expo SaaS Shell
        </Text>
        <Text style={[styles.footerText, { color: theme.textSecondary, marginTop: 4 }]}>
          Licensed for SyncHR Corp (Enterprise Workspace)
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  companyCard: {
    alignItems: 'center',
    paddingVertical: Spacing.five,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: Fonts.sans,
  },
  workspaceId: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: Spacing.half,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: Spacing.two,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.two,
    marginLeft: Spacing.one,
  },
  settingsCard: {
    padding: 0, // Let rows handle padding
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: Spacing.three,
  },
  settingIcon: {
    marginRight: Spacing.three,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingDesc: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  divider: {
    height: 1,
  },
  signOutBtn: {
    marginTop: Spacing.two,
    height: 48,
  },
  footerInfo: {
    alignItems: 'center',
    marginTop: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.five,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});

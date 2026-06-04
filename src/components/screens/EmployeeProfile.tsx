import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch, ScrollView, Platform } from 'react-native';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, Fonts, BottomTabInset } from '@/constants/theme';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';

export function EmployeeProfile() {
  const { currentUser, logout, themeMode, toggleTheme } = useApp();
  const theme = useTheme();

  // Mock settings states
  const [notifications, setNotifications] = useState(true);
  const [biometricCheckIn, setBiometricCheckIn] = useState(true);

  if (!currentUser) return null;

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: theme.background }}>
      {/* Profile Card */}
      <Card style={styles.profileCard} type="default">
        <View style={[styles.avatarCircle, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>{currentUser.avatar}</Text>
        </View>
        <Text style={[styles.userName, { color: theme.text }]}>{currentUser.name}</Text>
        <Text style={[styles.userId, { color: theme.textSecondary }]}>{currentUser.id}</Text>
        <Text style={[styles.userRole, { color: theme.primary, backgroundColor: theme.primaryLight }]}>
          {currentUser.role}
        </Text>
      </Card>

      {/* Personal & Job Details */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Employment Information</Text>
      <Card style={styles.detailsCard} type="outline">
        <View style={styles.detailRowItem}>
          <Icon name="mail" color={theme.textSecondary} size={18} style={styles.detailIcon} />
          <View style={styles.detailContent}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Email Address</Text>
            <Text style={[styles.detailVal, { color: theme.text }]}>{currentUser.email}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.detailRowItem}>
          <Icon name="briefcase" color={theme.textSecondary} size={18} style={styles.detailIcon} />
          <View style={styles.detailContent}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Department</Text>
            <Text style={[styles.detailVal, { color: theme.text }]}>{currentUser.department}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.detailRowItem}>
          <Icon name="calendar" color={theme.textSecondary} size={18} style={styles.detailIcon} />
          <View style={styles.detailContent}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Joined Date</Text>
            <Text style={[styles.detailVal, { color: theme.text }]}>{currentUser.joinDate}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.detailRowItem}>
          <Icon name="shield" color={theme.textSecondary} size={18} style={styles.detailIcon} />
          <View style={styles.detailContent}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Direct Manager</Text>
            <Text style={[styles.detailVal, { color: theme.text }]}>Jane Smith (HR Generalist)</Text>
          </View>
        </View>
      </Card>

      {/* Settings Switches */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>
      <Card style={styles.settingsCard} type="outline">
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Icon name={themeMode === 'dark' ? 'moon' : 'sun'} color={theme.text} size={18} style={{ marginRight: Spacing.three }} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>Toggle dark user theme mode</Text>
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

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Icon name="calendar" color={theme.text} size={18} style={{ marginRight: Spacing.three }} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Shift Notifications</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>Remind before shifts end</Text>
            </View>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Icon name="clock" color={theme.text} size={18} style={{ marginRight: Spacing.three }} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Biometric Clock In</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>Verify face/fingerprint on punch</Text>
            </View>
          </View>
          <Switch
            value={biometricCheckIn}
            onValueChange={setBiometricCheckIn}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
          />
        </View>
      </Card>

      {/* Logout button */}
      <Button
        title="Sign Out of SyncHR"
        onPress={logout}
        variant="outline"
        size="large"
        icon={<Icon name="logout" color={theme.text} size={18} />}
        style={[styles.signOutBtn, { borderColor: theme.border }]}
        textStyle={{ color: theme.text }}
      />

      <View style={styles.footerContainer}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          SyncHR Employee Portal v1.2.0 • Build 430
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
  profileCard: {
    alignItems: 'center',
    paddingVertical: Spacing.five,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: Fonts.sans,
  },
  userId: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  userRole: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 8,
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
  detailsCard: {
    padding: 0,
  },
  detailRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  detailIcon: {
    marginRight: Spacing.three,
  },
  detailContent: {
    gap: 2,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  detailVal: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingsCard: {
    padding: 0,
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
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingDesc: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  divider: {
    height: 1,
  },
  signOutBtn: {
    marginTop: Spacing.two,
    height: 48,
    backgroundColor: 'transparent',
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.five,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});

import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform, ScrollView } from 'react-native';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, Fonts } from '@/constants/theme';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Badge } from '../ui/Badge';

interface EmployerDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenAddEmployeeModal: () => void;
}

export function EmployerDashboard({ onNavigate, onOpenAddEmployeeModal }: EmployerDashboardProps) {
  const { employees, attendance, leaves } = useApp();
  const theme = useTheme();

  // Metrics calculations
  const totalEmployees = employees.length;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const presentToday = attendance.filter(
    (a) => a.date === todayStr && (a.status === 'Present' || a.status === 'Late')
  ).length;

  const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;

  const presentPercentage = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0;

  // Format today's date
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Welcome Card */}
      <Card style={[styles.welcomeCard, { backgroundColor: theme.primary }]}>
        <View style={styles.welcomeInfo}>
          <Text style={styles.welcomeDate}>{formattedDate}</Text>
          <Text style={styles.welcomeTitle}>Welcome Back, HR Portal</Text>
          <Text style={styles.welcomeSubtitle}>
            SyncHR Enterprise SaaS • Manage employee check-ins, approvals, and payroll logs.
          </Text>
        </View>
        <View style={styles.welcomeHeaderIcon}>
          <Icon name="shield" color="#FFFFFF" size={40} />
        </View>
      </Card>

      {/* Analytics KPIs Grid */}
      <View style={styles.gridRow}>
        <Card style={styles.kpiCard} type="default">
          <View style={styles.kpiHeader}>
            <View style={[styles.iconBg, { backgroundColor: theme.primaryLight }]}>
              <Icon name="users" color={theme.primary} size={20} />
            </View>
            <Text style={[styles.kpiTitle, { color: theme.textSecondary }]}>Total Staff</Text>
          </View>
          <Text style={[styles.kpiValue, { color: theme.text }]}>{totalEmployees}</Text>
          <Text style={[styles.kpiFootnote, { color: theme.success }]}>Active Contracts</Text>
        </Card>

        <Card style={styles.kpiCard} type="default">
          <View style={styles.kpiHeader}>
            <View style={[styles.iconBg, { backgroundColor: theme.successLight }]}>
              <Icon name="clock" color={theme.success} size={20} />
            </View>
            <Text style={[styles.kpiTitle, { color: theme.textSecondary }]}>Present Today</Text>
          </View>
          <Text style={[styles.kpiValue, { color: theme.text }]}>{presentToday}</Text>
          <Text style={[styles.kpiFootnote, { color: theme.textSecondary }]}>
            {presentPercentage}% Attendance
          </Text>
        </Card>

        <Card style={styles.kpiCard} type="default">
          <View style={styles.kpiHeader}>
            <View style={[styles.iconBg, { backgroundColor: theme.warningLight }]}>
              <Icon name="calendar" color={theme.warning} size={20} />
            </View>
            <Text style={[styles.kpiTitle, { color: theme.textSecondary }]}>Pending Leaves</Text>
          </View>
          <Text style={[styles.kpiValue, { color: theme.text }]}>{pendingLeaves}</Text>
          <Text style={[styles.kpiFootnote, { color: theme.warning }]}>Requires Review</Text>
        </Card>
      </View>

      {/* Attendance Overview Progress bar */}
      <Card style={styles.chartCard}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Attendance Overview</Text>
          <Badge text="Live" status="info" />
        </View>
        <View style={styles.barRow}>
          <Text style={[styles.barLabel, { color: theme.textSecondary }]}>Checked In Status</Text>
          <Text style={[styles.barValue, { color: theme.text }]}>
            {presentToday} / {totalEmployees} Present
          </Text>
        </View>
        <View style={[styles.barTrack, { backgroundColor: theme.backgroundElement }]}>
          <View
            style={[
              styles.barFill,
              {
                backgroundColor: theme.success,
                width: `${presentPercentage}%`,
              },
            ]}
          />
        </View>
        <Text style={[styles.barHint, { color: theme.textSecondary }]}>
          Daily attendance target is 95%. Currently tracking at {presentPercentage}% for today.
        </Text>
      </Card>

      {/* Quick Action buttons */}
      <Text style={[styles.actionHeader, { color: theme.text }]}>Quick Actions</Text>
      <View style={styles.actionGrid}>
        <Card
          type="interactive"
          onPress={onOpenAddEmployeeModal}
          style={styles.actionCard}
        >
          <View style={[styles.actionIconBg, { backgroundColor: theme.primaryLight }]}>
            <Icon name="plus" color={theme.primary} size={22} />
          </View>
          <Text style={[styles.actionLabel, { color: theme.text }]}>Add Employee</Text>
          <Text style={[styles.actionDesc, { color: theme.textSecondary }]}>Create profile</Text>
        </Card>

        <Card
          type="interactive"
          onPress={() => onNavigate('leaves')}
          style={styles.actionCard}
        >
          <View style={[styles.actionIconBg, { backgroundColor: theme.warningLight }]}>
            <Icon name="calendar" color={theme.warning} size={22} />
          </View>
          <Text style={[styles.actionLabel, { color: theme.text }]}>Approve Leaves</Text>
          <Text style={[styles.actionDesc, { color: theme.textSecondary }]}>
            {pendingLeaves} pending request{pendingLeaves !== 1 ? 's' : ''}
          </Text>
        </Card>

        <Card
          type="interactive"
          onPress={() => onNavigate('attendance')}
          style={styles.actionCard}
        >
          <View style={[styles.actionIconBg, { backgroundColor: theme.infoLight }]}>
            <Icon name="clock" color={theme.info} size={22} />
          </View>
          <Text style={[styles.actionLabel, { color: theme.text }]}>View Records</Text>
          <Text style={[styles.actionDesc, { color: theme.textSecondary }]}>Daily punch logs</Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.four,
    borderRadius: Spacing.three,
  },
  welcomeInfo: {
    flex: 1,
    paddingRight: Spacing.three,
  },
  welcomeDate: {
    color: '#E0E7FF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: Fonts.sans,
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: Spacing.one,
    fontFamily: Fonts.sans,
  },
  welcomeSubtitle: {
    color: '#EFF6FF',
    fontSize: 13,
    fontWeight: '500',
    marginTop: Spacing.one,
    lineHeight: 18,
    fontFamily: Fonts.sans,
  },
  welcomeHeaderIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  kpiCard: {
    flex: 1,
    minHeight: 110,
    justifyContent: 'space-between',
  },
  kpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: Spacing.one * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kpiTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    fontFamily: Fonts.sans,
  },
  kpiValue: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: Spacing.two,
    fontFamily: Fonts.sans,
  },
  kpiFootnote: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: Spacing.one,
    fontFamily: Fonts.sans,
  },
  chartCard: {
    gap: Spacing.two,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Fonts.sans,
  },
  barRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  barValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  barTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: Spacing.half,
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  barHint: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  actionHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: Spacing.two,
    fontFamily: Fonts.sans,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: Spacing.four,
    gap: Spacing.one,
  },
  actionIconBg: {
    width: 44,
    height: 44,
    borderRadius: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Fonts.sans,
  },
  actionDesc: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});

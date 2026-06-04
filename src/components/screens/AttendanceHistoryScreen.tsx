import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useApp, AttendanceRecord } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, Fonts, BottomTabInset } from '@/constants/theme';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Badge } from '../ui/Badge';

export function AttendanceHistoryScreen() {
  const { currentUser, attendance } = useApp();
  const theme = useTheme();

  if (!currentUser) return null;

  // Filter attendance records to just current user
  const personalRecords = attendance.filter((a) => a.employeeId === currentUser.id);

  // Stats calculation
  const totalLogs = personalRecords.length;
  const presentDays = personalRecords.filter((a) => a.status === 'Present').length;
  const lateDays = personalRecords.filter((a) => a.status === 'Late').length;
  const leaveDays = personalRecords.filter((a) => a.status === 'On Leave').length;
  const absentDays = Math.max(0, 20 - (presentDays + lateDays + leaveDays)); // Assuming 20 working days in a month simulation

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'Present':
        return <Badge text="Present" status="success" />;
      case 'Late':
        return <Badge text="Late" status="warning" />;
      case 'On Leave':
        return <Badge text="On Leave" status="info" />;
      default:
        return <Badge text="Absent" status="danger" />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Monthly Statistics Overview */}
      <View style={styles.headerStatsRow}>
        <Card style={styles.metricCard} type="outline">
          <Text style={[styles.metricVal, { color: theme.primary }]}>{presentDays + lateDays}</Text>
          <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Worked</Text>
        </Card>
        <Card style={styles.metricCard} type="outline">
          <Text style={[styles.metricVal, { color: theme.warning }]}>{lateDays}</Text>
          <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Late</Text>
        </Card>
        <Card style={styles.metricCard} type="outline">
          <Text style={[styles.metricVal, { color: theme.info }]}>{leaveDays}</Text>
          <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>On Leave</Text>
        </Card>
        <Card style={styles.metricCard} type="outline">
          <Text style={[styles.metricVal, { color: theme.danger }]}>{absentDays}</Text>
          <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Absent</Text>
        </Card>
      </View>

      {/* Historical List */}
      <Text style={[styles.title, { color: theme.text }]}>Personal Attendance Log</Text>
      <FlatList
        data={personalRecords}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Icon name="clock" color={theme.textSecondary} size={48} style={{ marginBottom: Spacing.two, opacity: 0.5 }} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No history records logged</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.logCard} type="outline">
            <View style={styles.cardHeader}>
              <View style={styles.dateCol}>
                <Text style={[styles.dateText, { color: theme.text }]}>{item.date}</Text>
                <Text style={[styles.dayLabel, { color: theme.textSecondary }]}>
                  {new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' })}
                </Text>
              </View>
              {getStatusBadge(item.status)}
            </View>

            <View style={[styles.cardDivider, { backgroundColor: theme.border }]} />

            <View style={styles.timesRow}>
              <View style={styles.timeInfo}>
                <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>Clocked In</Text>
                <Text style={[styles.timeValText, { color: item.status === 'Late' ? theme.warning : theme.text }]}>
                  {item.checkIn}
                </Text>
              </View>
              <View style={styles.timeInfo}>
                <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>Clocked Out</Text>
                <Text style={[styles.timeValText, { color: theme.text }]}>
                  {item.checkOut ? item.checkOut : '--:--'}
                </Text>
              </View>
              <View style={[styles.timeInfo, { flex: 1.5 }]}>
                <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>Location Punch</Text>
                <Text style={[styles.timeValText, { color: theme.textSecondary, fontSize: 11 }]} numberOfLines={1}>
                  {item.coordinates ? item.coordinates : 'N/A'}
                </Text>
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStatsRow: {
    flexDirection: 'row',
    padding: Spacing.three,
    gap: Spacing.two,
  },
  metricCard: {
    flex: 1,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricVal: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: Fonts.sans,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.two,
    marginBottom: Spacing.one,
    fontFamily: Fonts.sans,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContainer: {
    padding: Spacing.three,
    gap: Spacing.two,
    paddingBottom: BottomTabInset + Spacing.five,
  },
  logCard: {
    padding: Spacing.three,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateCol: {
    gap: 2,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  cardDivider: {
    height: 1,
    marginVertical: Spacing.two,
  },
  timesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInfo: {
    flex: 1,
    gap: 2,
  },
  timeLabel: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  timeValText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyView: {
    paddingVertical: Spacing.six,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

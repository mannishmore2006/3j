import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, Fonts, BottomTabInset } from '@/constants/theme';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface EmployeeDashboardProps {
  onNavigate: (tab: string) => void;
}

export function EmployeeDashboard({ onNavigate }: EmployeeDashboardProps) {
  const { currentUser, attendance, holidays, leaves } = useApp();
  const theme = useTheme();

  if (!currentUser) return null;

  // Fetch today's record
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find((a) => a.employeeId === currentUser.id && a.date === todayStr);

  // Fetch employee attendance history
  const personalRecords = attendance.filter((a) => a.employeeId === currentUser.id);

  // Calculate leave balances (mock)
  const approvedLeavesCount = leaves
    .filter((l) => l.employeeId === currentUser.id && l.status === 'Approved')
    .reduce((acc, l) => {
      const days = Math.ceil(
        (new Date(l.endDate).getTime() - new Date(l.startDate).getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
      return acc + days;
    }, 0);

  const leaveBalances = {
    paid: 15 - (leaves.filter(l => l.employeeId === currentUser.id && l.type === 'Paid Leave' && l.status === 'Approved').length * 2), // Mock
    sick: 10 - (leaves.filter(l => l.employeeId === currentUser.id && l.type === 'Sick Leave' && l.status === 'Approved').length),
    casual: 8 - (leaves.filter(l => l.employeeId === currentUser.id && l.type === 'Casual Leave' && l.status === 'Approved').length),
  };

  // Welcome greeting based on time
  const hours = new Date().getHours();
  const greeting = hours < 12 ? 'Good Morning' : hours < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Greeting Header */}
      <View style={styles.header}>
        <Text style={[styles.greetingText, { color: theme.textSecondary }]}>{greeting},</Text>
        <Text style={[styles.userName, { color: theme.text }]}>{currentUser.name}</Text>
        <Text style={[styles.userMeta, { color: theme.textSecondary }]}>
          {currentUser.department} • {currentUser.role}
        </Text>
      </View>

      {/* Today's Punch Card */}
      <Card style={styles.punchStatusCard} type="default">
        <View style={styles.punchHeader}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Today{"'"}s Attendance</Text>
          {todayRecord ? (
            <Badge
              text={todayRecord.status}
              status={todayRecord.status === 'Present' ? 'success' : todayRecord.status === 'Late' ? 'warning' : 'info'}
            />
          ) : (
            <Badge text="Not Checked In" status="danger" />
          )}
        </View>

        <View style={styles.punchTimesRow}>
          <View style={styles.punchTimeCol}>
            <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>Check In</Text>
            <Text style={[styles.timeValue, { color: theme.text }]}>
              {todayRecord ? todayRecord.checkIn : '--:--'}
            </Text>
          </View>
          <View style={styles.timeDivider} />
          <View style={styles.punchTimeCol}>
            <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>Check Out</Text>
            <Text style={[styles.timeValue, { color: theme.text }]}>
              {todayRecord?.checkOut ? todayRecord.checkOut : '--:--'}
            </Text>
          </View>
        </View>

        <Button
          title={todayRecord ? (todayRecord.checkOut ? "View Log Details" : "Clock Out Now") : "Clock In Now"}
          onPress={() => onNavigate('check-in')}
          variant={todayRecord && !todayRecord.checkOut ? 'secondary' : 'primary'}
          size="medium"
          style={styles.punchButton}
          icon={<Icon name="clock" color={todayRecord && !todayRecord.checkOut ? theme.primary : '#FFFFFF'} size={18} />}
        />
      </Card>

      {/* Leave Balances Grid */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Leave Balances</Text>
      <View style={styles.balanceGrid}>
        <Card style={styles.balanceCard} type="outline">
          <Text style={[styles.balanceNum, { color: theme.primary }]}>{leaveBalances.paid}</Text>
          <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>Paid Days</Text>
          <Text style={[styles.balanceTotal, { color: theme.textSecondary }]}>of 15 days</Text>
        </Card>
        <Card style={styles.balanceCard} type="outline">
          <Text style={[styles.balanceNum, { color: theme.danger }]}>{leaveBalances.sick}</Text>
          <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>Sick Days</Text>
          <Text style={[styles.balanceTotal, { color: theme.textSecondary }]}>of 10 days</Text>
        </Card>
        <Card style={styles.balanceCard} type="outline">
          <Text style={[styles.balanceNum, { color: theme.warning }]}>{leaveBalances.casual}</Text>
          <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>Casual Days</Text>
          <Text style={[styles.balanceTotal, { color: theme.textSecondary }]}>of 8 days</Text>
        </Card>
      </View>

      {/* Upcoming Holidays */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 0 }]}>Upcoming Holidays</Text>
      </View>
      <Card style={styles.holidaysCard} type="outline">
        {holidays.slice(0, 2).map((item, idx) => (
          <View key={item.id}>
            {idx > 0 && <View style={[styles.listDivider, { backgroundColor: theme.border }]} />}
            <View style={styles.holidayRow}>
              <View style={styles.holidayInfo}>
                <Text style={[styles.holidayName, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.holidayDate, { color: theme.textSecondary }]}>
                  {item.date} • {item.day}
                </Text>
              </View>
              <Badge text="Holiday" status="info" />
            </View>
          </View>
        ))}
      </Card>

      {/* Recent Activity Timeline */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activities</Text>
      <Card style={styles.activityCard} type="outline">
        {personalRecords.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No recent activity logs</Text>
        ) : (
          personalRecords.slice(0, 3).map((item, idx) => (
            <View key={item.id} style={styles.timelineRow}>
              <View style={styles.timelinePointCol}>
                <View style={[styles.timelineDot, { backgroundColor: item.status === 'Present' ? theme.success : theme.warning }]} />
                {idx < Math.min(personalRecords.length, 3) - 1 && (
                  <View style={[styles.timelineLine, { backgroundColor: theme.border }]} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.activityTitle, { color: theme.text }]}>
                  Clocked In - {item.status}
                </Text>
                <Text style={[styles.activityTime, { color: theme.textSecondary }]}>
                  {item.date} at {item.checkIn}
                  {item.checkOut ? ` • Checked Out at ${item.checkOut}` : ''}
                </Text>
              </View>
            </View>
          ))
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    paddingVertical: Spacing.one,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: Fonts.sans,
    marginTop: 2,
  },
  userMeta: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: Spacing.half,
  },
  punchStatusCard: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  punchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Fonts.sans,
  },
  punchTimesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.one,
  },
  punchTimeCol: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one,
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  timeValue: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: Fonts.sans,
  },
  timeDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  punchButton: {
    height: 44,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.two,
    fontFamily: Fonts.sans,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  balanceGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  balanceCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.three,
  },
  balanceNum: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: Fonts.sans,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: Spacing.one,
  },
  balanceTotal: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  holidaysCard: {
    padding: 0,
  },
  holidayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
  },
  holidayInfo: {
    gap: 2,
  },
  holidayName: {
    fontSize: 14,
    fontWeight: '700',
  },
  holidayDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  listDivider: {
    height: 1,
  },
  activityCard: {
    padding: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: Spacing.two,
    fontWeight: '500',
  },
  timelineRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  timelinePointCol: {
    width: 12,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: Spacing.three,
    gap: 2,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  activityTime: {
    fontSize: 11,
    fontWeight: '500',
  },
});

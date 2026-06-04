import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, Pressable } from 'react-native';
import { useApp, AttendanceRecord } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, Fonts, BottomTabInset } from '@/constants/theme';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Badge } from '../ui/Badge';

export function AttendanceScreen() {
  const { attendance, employees } = useApp();
  const theme = useTheme();

  const [search, setSearch] = useState('');
  const todayStr = new Date().toISOString().split('T')[0];

  // Daily statistics for today
  const todayRecords = attendance.filter((a) => a.date === todayStr);
  const totalEmployees = employees.length;

  const presentCount = todayRecords.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const lateCount = todayRecords.filter((a) => a.status === 'Late').length;
  const leaveCount = todayRecords.filter((a) => a.status === 'On Leave').length;
  const absentCount = totalEmployees - (presentCount + leaveCount);

  // Generate lists of all employees today with their status
  const dailyLogs = employees.map((emp) => {
    const record = attendance.find((a) => a.employeeId === emp.id && a.date === todayStr);

    return {
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      checkIn: record ? record.checkIn : '--:--',
      checkOut: record?.checkOut ? record.checkOut : '--:--',
      status: record ? record.status : ('Absent' as const),
      coordinates: record?.coordinates,
    };
  });

  // Filter daily logs based on search query
  const filteredLogs = dailyLogs.filter((log) =>
    log.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    log.employeeId.toLowerCase().includes(search.toLowerCase()) ||
    log.department.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: AttendanceRecord['status'] | 'Absent') => {
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
      {/* Attendance Analytics Grid */}
      <View style={styles.analyticsRow}>
        <Card style={styles.statCard} type="outline">
          <Text style={[styles.statValue, { color: theme.success }]}>{presentCount}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Present</Text>
        </Card>
        <Card style={styles.statCard} type="outline">
          <Text style={[styles.statValue, { color: theme.warning }]}>{lateCount}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Late Arrivals</Text>
        </Card>
        <Card style={styles.statCard} type="outline">
          <Text style={[styles.statValue, { color: theme.danger }]}>{absentCount < 0 ? 0 : absentCount}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Absent</Text>
        </Card>
        <Card style={styles.statCard} type="outline">
          <Text style={[styles.statValue, { color: theme.info }]}>{leaveCount}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>On Leave</Text>
        </Card>
      </View>

      {/* Filter and Search */}
      <View style={styles.headerSearch}>
        <View style={[styles.searchBox, { borderColor: theme.border, backgroundColor: theme.card }]}>
          <Icon name="search" color={theme.textSecondary} size={18} style={{ marginRight: Spacing.two }} />
          <TextInput
            placeholder="Search attendance by name, ID..."
            placeholderTextColor={theme.textSecondary + '80'}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: theme.text, fontFamily: Fonts.sans }]}
          />
        </View>
      </View>

      {/* Daily Attendance logs */}
      <Text style={[styles.tableTitle, { color: theme.text }]}>Today{"'"}s Log Registry</Text>
      <FlatList
        data={filteredLogs}
        keyExtractor={(item) => item.employeeId}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No records match your query</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.logCard} type="outline">
            <View style={styles.logHeader}>
              <View>
                <Text style={[styles.empName, { color: theme.text }]}>{item.employeeName}</Text>
                <Text style={[styles.empDept, { color: theme.textSecondary }]}>
                  {item.employeeId} • {item.department}
                </Text>
              </View>
              {getStatusBadge(item.status)}
            </View>

            <View style={[styles.cardDivider, { backgroundColor: theme.border }]} />

            <View style={styles.logDetails}>
              <View style={styles.detailCol}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Check In</Text>
                <Text style={[styles.detailValue, { color: item.status === 'Late' ? theme.warning : theme.text }]}>
                  {item.checkIn}
                </Text>
              </View>
              <View style={styles.detailCol}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Check Out</Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>{item.checkOut}</Text>
              </View>
              {item.coordinates ? (
                <View style={[styles.detailCol, { flex: 1.5 }]}>
                  <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Location Punch</Text>
                  <Text style={[styles.detailValue, { color: theme.textSecondary, fontSize: 11 }]} numberOfLines={1}>
                    {item.coordinates}
                  </Text>
                </View>
              ) : null}
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
  analyticsRow: {
    flexDirection: 'row',
    padding: Spacing.three,
    gap: Spacing.two,
  },
  statCard: {
    flex: 1,
    padding: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: Fonts.sans,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  headerSearch: {
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.two,
  },
  searchBox: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    padding: 0,
    outlineStyle: 'none',
  } as TextStyle & { outlineStyle?: string },
  tableTitle: {
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
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  empName: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Fonts.sans,
  },
  empDept: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    marginVertical: Spacing.two,
  },
  logDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailCol: {
    flex: 1,
    gap: 2,
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  detailValue: {
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

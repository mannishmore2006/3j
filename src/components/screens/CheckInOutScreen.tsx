import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList, Platform } from 'react-native';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, Fonts, BottomTabInset } from '@/constants/theme';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Badge } from '../ui/Badge';

export function CheckInOutScreen() {
  const { currentUser, attendance, checkIn, checkOut } = useApp();
  const theme = useTheme();

  const [currentTime, setCurrentTime] = useState(new Date());

  // Digital Clock timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentUser) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find((a) => a.employeeId === currentUser.id && a.date === todayStr);

  const formatClock = () => {
    return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDay = () => {
    return currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Coordinates mock (simulating GPS geo-fence)
  const mockCoordinates = "37.7749° N, 122.4194° W (Office HQ)";

  const handlePunch = () => {
    if (!todayRecord) {
      // Check In
      checkIn(currentUser.id, mockCoordinates);
    } else if (!todayRecord.checkOut) {
      // Check Out
      checkOut(currentUser.id);
    }
  };

  // Determine button state
  let buttonText = "Clock In";
  let buttonSub = "Tap to check in for today";
  let buttonColor = theme.primary;
  let isPunchedOut = false;

  if (todayRecord) {
    if (todayRecord.checkOut) {
      buttonText = "Shift Completed";
      buttonSub = `Checked out at ${todayRecord.checkOut}`;
      buttonColor = theme.backgroundElement;
      isPunchedOut = true;
    } else {
      buttonText = "Clock Out";
      buttonSub = "Tap to end your shift";
      buttonColor = theme.danger;
    }
  }

  // Filter logs for today
  const todaysLogs = attendance.filter((a) => a.employeeId === currentUser.id && a.date === todayStr);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Clock Panel */}
      <Card style={styles.clockCard} type="default">
        <Text style={[styles.dateText, { color: theme.textSecondary }]}>{formatDay()}</Text>
        <Text style={[styles.timeText, { color: theme.text }]}>{formatClock()}</Text>
        <View style={styles.gpsRow}>
          <Icon name="users" color={theme.textSecondary} size={14} style={{ marginRight: Spacing.one }} />
          <Text style={[styles.gpsText, { color: theme.textSecondary }]}>
            GPS Status: Active • {mockCoordinates}
          </Text>
        </View>
      </Card>

      {/* Pulsing Punch Button */}
      <View style={styles.punchButtonArea}>
        <Pressable
          onPress={isPunchedOut ? undefined : handlePunch}
          style={({ pressed }) => [
            styles.punchOuterCircle,
            { backgroundColor: buttonColor + '15' },
            pressed && !isPunchedOut && { transform: [{ scale: 0.96 }] },
          ]}
        >
          <View style={[styles.punchInnerCircle, { backgroundColor: buttonColor }]}>
            <Icon name="clock" color="#FFFFFF" size={48} style={{ marginBottom: Spacing.two }} />
            <Text style={styles.punchText}>{buttonText}</Text>
          </View>
        </Pressable>
        <Text style={[styles.punchSubText, { color: theme.textSecondary }]}>{buttonSub}</Text>
      </View>

      {/* Punch History List */}
      <Text style={[styles.historyTitle, { color: theme.text }]}>Today{"'"}s Punch History</Text>
      <FlatList
        data={todaysLogs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No punches logged today</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.logCard} type="outline">
            <View style={styles.logRow}>
              <View style={styles.logIconCol}>
                <View style={[styles.logIndicator, { backgroundColor: theme.success }]} />
                <View style={[styles.logConnector, { backgroundColor: theme.border }]} />
              </View>
              <View style={styles.logContent}>
                <Text style={[styles.logTitle, { color: theme.text }]}>Checked In</Text>
                <Text style={[styles.logSub, { color: theme.textSecondary }]}>
                  Punch time: {item.checkIn}
                </Text>
              </View>
              <Badge text={item.status} status="success" />
            </View>

            {item.checkOut ? (
              <View style={[styles.logRow, { marginTop: Spacing.two }]}>
                <View style={styles.logIconCol}>
                  <View style={[styles.logIndicator, { backgroundColor: theme.danger }]} />
                </View>
                <View style={styles.logContent}>
                  <Text style={[styles.logTitle, { color: theme.text }]}>Checked Out</Text>
                  <Text style={[styles.logSub, { color: theme.textSecondary }]}>
                    Punch time: {item.checkOut}
                  </Text>
                </View>
                <Badge text="Completed" status="default" />
              </View>
            ) : null}
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.three,
  },
  clockCard: {
    alignItems: 'center',
    paddingVertical: Spacing.four,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: Fonts.sans,
  },
  timeText: {
    fontSize: 36,
    fontWeight: '800',
    marginVertical: Spacing.one,
    fontFamily: Fonts.sans,
    letterSpacing: 1,
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gpsText: {
    fontSize: 11,
    fontWeight: '600',
  },
  punchButtonArea: {
    alignItems: 'center',
    marginVertical: Spacing.five,
  },
  punchOuterCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
      },
      web: {
        boxShadow: '0 8px 32px rgba(15, 23, 42, 0.08)',
      },
    }),
  },
  punchInnerCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    justifyContent: 'center',
    alignItems: 'center',
  },
  punchText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    fontFamily: Fonts.sans,
  },
  punchSubText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: Spacing.three,
    textAlign: 'center',
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.two,
    fontFamily: Fonts.sans,
  },
  listContainer: {
    gap: Spacing.two,
    paddingBottom: BottomTabInset + Spacing.five,
  },
  logCard: {
    padding: Spacing.three,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logIconCol: {
    width: 20,
    alignItems: 'center',
    position: 'relative',
  },
  logIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  logConnector: {
    width: 2,
    height: 35,
    position: 'absolute',
    top: 10,
  },
  logContent: {
    flex: 1,
    marginLeft: Spacing.two,
    gap: 2,
  },
  logTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  logSub: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyView: {
    paddingVertical: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '500',
  },
});

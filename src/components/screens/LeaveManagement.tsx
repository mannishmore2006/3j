import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useApp, LeaveRequest } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, Fonts, BottomTabInset } from '@/constants/theme';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function LeaveManagement() {
  const { leaves, approveLeave, rejectLeave } = useApp();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  const pendingRequests = leaves.filter((l) => l.status === 'Pending');
  const historyRequests = leaves.filter((l) => l.status !== 'Pending');

  const getStatusBadge = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'Approved':
        return <Badge text="Approved" status="success" />;
      case 'Rejected':
        return <Badge text="Rejected" status="danger" />;
      default:
        return <Badge text="Pending" status="warning" />;
    }
  };

  const getLeaveTypeBadge = (type: LeaveRequest['type']) => {
    switch (type) {
      case 'Sick Leave':
        return <Badge text={type} status="danger" />;
      case 'Paid Leave':
        return <Badge text={type} status="info" />;
      case 'Casual Leave':
        return <Badge text={type} status="warning" />;
      default:
        return <Badge text={type} status="default" />;
    }
  };

  const renderLeaveCard = (item: LeaveRequest, showActions: boolean) => {
    const totalDays = Math.ceil(
      (new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

    return (
      <Card style={styles.requestCard} type="outline">
        <View style={styles.cardHeader}>
          <View style={styles.empInfo}>
            <Text style={[styles.empName, { color: theme.text }]}>{item.employeeName}</Text>
            <Text style={[styles.empId, { color: theme.textSecondary }]}>{item.employeeId}</Text>
          </View>
          {getLeaveTypeBadge(item.type)}
        </View>

        <View style={styles.dateRow}>
          <Icon name="calendar" color={theme.textSecondary} size={15} style={{ marginRight: Spacing.two }} />
          <Text style={[styles.dateText, { color: theme.text }]}>
            {item.startDate} to {item.endDate}
          </Text>
          <Text style={[styles.daysCount, { color: theme.primary, backgroundColor: theme.primaryLight }]}>
            {totalDays} Day{totalDays !== 1 ? 's' : ''}
          </Text>
        </View>

        <View style={[styles.reasonBox, { backgroundColor: theme.background }]}>
          <Text style={[styles.reasonLabel, { color: theme.textSecondary }]}>Reason:</Text>
          <Text style={[styles.reasonText, { color: theme.text }]}>{item.reason}</Text>
        </View>

        <View style={styles.footerRow}>
          <Text style={[styles.appliedDate, { color: theme.textSecondary }]}>
            Applied on {item.appliedOn}
          </Text>
          {!showActions && getStatusBadge(item.status)}
        </View>

        {showActions && (
          <View style={styles.actionButtons}>
            <Button
              title="Reject"
              onPress={() => rejectLeave(item.id)}
              variant="outline"
              size="small"
              style={[styles.actionBtn, { borderColor: theme.danger }]}
              textStyle={{ color: theme.danger }}
            />
            <Button
              title="Approve"
              onPress={() => approveLeave(item.id)}
              variant="primary"
              size="small"
              style={styles.actionBtn}
            />
          </View>
        )}
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Sub Tabs Toggle */}
      <View style={styles.tabToggleRow}>
        <Pressable
          onPress={() => setActiveTab('pending')}
          style={[
            styles.subTab,
            { borderBottomColor: 'transparent' },
            activeTab === 'pending' && [styles.activeSubTab, { borderBottomColor: theme.primary }],
          ]}
        >
          <Text
            style={[
              styles.subTabText,
              { color: theme.textSecondary },
              activeTab === 'pending' && { color: theme.primary, fontWeight: '700' },
            ]}
          >
            Pending Review ({pendingRequests.length})
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('history')}
          style={[
            styles.subTab,
            { borderBottomColor: 'transparent' },
            activeTab === 'history' && [styles.activeSubTab, { borderBottomColor: theme.primary }],
          ]}
        >
          <Text
            style={[
              styles.subTabText,
              { color: theme.textSecondary },
              activeTab === 'history' && { color: theme.primary, fontWeight: '700' },
            ]}
          >
            Processed Logs ({historyRequests.length})
          </Text>
        </Pressable>
      </View>

      {/* Requests List */}
      <FlatList
        data={activeTab === 'pending' ? pendingRequests : historyRequests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Icon name="calendar" color={theme.textSecondary} size={48} style={{ marginBottom: Spacing.two, opacity: 0.5 }} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No {activeTab === 'pending' ? 'pending' : 'historical'} requests found
            </Text>
          </View>
        }
        renderItem={({ item }) => renderLeaveCard(item, activeTab === 'pending')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabToggleRow: {
    flexDirection: 'row',
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  subTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2.5,
  },
  activeSubTab: {},
  subTabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContainer: {
    padding: Spacing.three,
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.five,
  },
  requestCard: {
    padding: Spacing.three,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  empInfo: {
    gap: 2,
  },
  empName: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: Fonts.sans,
  },
  empId: {
    fontSize: 11,
    fontWeight: '500',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
  },
  daysCount: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  reasonBox: {
    borderRadius: Spacing.one,
    padding: Spacing.two,
    marginTop: Spacing.two,
    gap: 2,
  },
  reasonLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  reasonText: {
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  appliedDate: {
    fontSize: 11,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  actionBtn: {
    flex: 1,
    height: 38,
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

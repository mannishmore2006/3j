import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useApp, LeaveRequest } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, Fonts } from '@/constants/theme';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { InputField } from '../ui/InputField';
import { Badge } from '../ui/Badge';

const LEAVE_TYPES: LeaveRequest['type'][] = ['Paid Leave', 'Sick Leave', 'Casual Leave', 'Unpaid Leave'];

export function LeaveRequestScreen() {
  const { currentUser, submitLeave } = useApp();
  const theme = useTheme();

  const [leaveType, setLeaveType] = useState<LeaveRequest['type']>('Paid Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  // Form states
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!currentUser) return null;

  // Auto-format dates (YYYY-MM-DD) helper
  const handleDateChange = (text: string, setter: (val: string) => void) => {
    // Basic format filter
    let cleaned = text.replace(/[^0-9-]/g, '');
    if (cleaned.length === 4 && text.length > 4 && !cleaned.includes('-', 4)) {
      cleaned = cleaned.slice(0, 4) + '-' + cleaned.slice(4);
    }
    if (cleaned.length === 7 && text.length > 7 && cleaned.split('-').length === 2) {
      cleaned = cleaned.slice(0, 7) + '-' + cleaned.slice(7);
    }
    setter(cleaned.slice(0, 10));
    setFormError('');
  };

  const handleCreateRequest = () => {
    if (!startDate || !endDate) {
      setFormError('Please enter start and end dates');
      return;
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      setFormError('Use YYYY-MM-DD date format (e.g. 2026-06-15)');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setFormError('Start date cannot be after end date');
      return;
    }
    if (!reason.trim()) {
      setFormError('Please provide a reason for the leave');
      return;
    }

    submitLeave(currentUser.id, leaveType, startDate, endDate, reason);
    setSuccess(true);
    setFormError('');

    // Reset fields
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: theme.background }}>
      {success ? (
        <Card style={styles.successCard}>
          <View style={[styles.successIconBg, { backgroundColor: theme.successLight }]}>
            <Icon name="check" color={theme.success} size={30} />
          </View>
          <Text style={[styles.successTitle, { color: theme.text }]}>Request Submitted!</Text>
          <Text style={[styles.successDesc, { color: theme.textSecondary }]}>
            Your {leaveType} request has been sent to HR for approval. You can track its status in the Dashboard or History.
          </Text>
          <Button
            title="File Another Request"
            onPress={() => setSuccess(false)}
            variant="secondary"
            size="medium"
            style={styles.anotherBtn}
          />
        </Card>
      ) : (
        <Card style={styles.formCard} type="default">
          <Text style={[styles.title, { color: theme.text }]}>Apply for Leave</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Fill out the form below. Approval responses are typically delivered within 24 hours.
          </Text>

          {formError ? (
            <View style={[styles.errorBox, { backgroundColor: theme.dangerLight }]}>
              <Icon name="x" color={theme.danger} size={15} style={{ marginRight: Spacing.two }} />
              <Text style={[styles.errorText, { color: theme.danger }]}>{formError}</Text>
            </View>
          ) : null}

          {/* Leave Type Selector */}
          <Text style={[styles.label, { color: theme.textSecondary }]}>Leave Classification</Text>
          <View style={styles.typeGrid}>
            {LEAVE_TYPES.map((type) => {
              const isSelected = leaveType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => setLeaveType(type)}
                  style={[
                    styles.typeItem,
                    { borderColor: theme.border, backgroundColor: theme.background },
                    isSelected && { borderColor: theme.primary, backgroundColor: theme.primaryLight },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      { color: theme.text },
                      isSelected && { color: theme.primary, fontWeight: '700' },
                    ]}
                  >
                    {type}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Date Picker Row */}
          <View style={styles.datesRow}>
            <View style={{ flex: 1 }}>
              <InputField
                label="Start Date"
                value={startDate}
                onChangeText={(val) => handleDateChange(val, setStartDate)}
                placeholder="YYYY-MM-DD"
                iconName="calendar"
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.three }}>
              <InputField
                label="End Date"
                value={endDate}
                onChangeText={(val) => handleDateChange(val, setEndDate)}
                placeholder="YYYY-MM-DD"
                iconName="calendar"
                keyboardType="numeric"
              />
            </View>
          </View>
          <Text style={[styles.hintText, { color: theme.textSecondary }]}>
            Tip: Standard date inputs must use the YYYY-MM-DD structure (e.g. 2026-06-12).
          </Text>

          {/* Reason multiline */}
          <InputField
            label="Reason / Explanation"
            value={reason}
            onChangeText={(val) => {
              setReason(val);
              setFormError('');
            }}
            placeholder="Please write details about your leave request..."
            iconName="users"
            multiline={true}
            numberOfLines={4}
          />

          <Button
            title="Submit Leave Request"
            onPress={handleCreateRequest}
            size="large"
            style={styles.submitBtn}
          />
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    justifyContent: 'center',
    flexGrow: 1,
  },
  formCard: {
    padding: Spacing.four,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: Fonts.sans,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: Spacing.one,
    marginBottom: Spacing.four,
    lineHeight: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.two,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  typeItem: {
    width: '48%',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    borderWidth: 1.5,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  datesRow: {
    flexDirection: 'row',
  },
  hintText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: -Spacing.two,
    marginBottom: Spacing.four,
    marginLeft: Spacing.half,
  },
  submitBtn: {
    height: 48,
    marginTop: Spacing.two,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.two,
    marginBottom: Spacing.three,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
  },
  successCard: {
    alignItems: 'center',
    padding: Spacing.five,
    textAlign: 'center',
  },
  successIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: Fonts.sans,
  },
  successDesc: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: Spacing.two,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: Spacing.two,
  },
  anotherBtn: {
    marginTop: Spacing.four,
    width: '80%',
  },
});

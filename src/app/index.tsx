import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, Fonts, BottomTabInset } from '@/constants/theme';
import { Icon } from '@/components/ui/Icon';

// Screens
import { LoginScreen } from '@/components/screens/LoginScreen';
import { EmployerDashboard } from '@/components/screens/EmployerDashboard';
import { EmployeeManagement } from '@/components/screens/EmployeeManagement';
import { LeaveManagement } from '@/components/screens/LeaveManagement';
import { AttendanceScreen } from '@/components/screens/AttendanceScreen';
import { EmployerProfile } from '@/components/screens/EmployerProfile';

import { EmployeeDashboard } from '@/components/screens/EmployeeDashboard';
import { CheckInOutScreen } from '@/components/screens/CheckInOutScreen';
import { LeaveRequestScreen } from '@/components/screens/LeaveRequestScreen';
import { AttendanceHistoryScreen } from '@/components/screens/AttendanceHistoryScreen';
import { EmployeeProfile } from '@/components/screens/EmployeeProfile';

export default function HomeScreen() {
  const { currentRole, themeMode, toggleTheme } = useApp();
  const theme = useTheme();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Navigation state
  const [employerTab, setEmployerTab] = useState<'dashboard' | 'employees' | 'leaves' | 'attendance' | 'profile'>('dashboard');
  const [employeeTab, setEmployeeTab] = useState<'dashboard' | 'check-in' | 'leave-req' | 'history' | 'profile'>('dashboard');

  // Employee Add Modal state (controlled here so it can be triggered from dashboard actions)
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);

  // Is Desktop Web Viewport
  const isDesktopWeb = Platform.OS === 'web' && windowWidth > 800;

  const renderActiveScreen = () => {
    if (currentRole === 'employer') {
      switch (employerTab) {
        case 'dashboard':
          return (
            <EmployerDashboard
              onNavigate={(tab) => setEmployerTab(tab as any)}
              onOpenAddEmployeeModal={() => setIsAddEmployeeModalOpen(true)}
            />
          );
        case 'employees':
          return (
            <EmployeeManagement
              isAddModalOpen={isAddEmployeeModalOpen}
              onCloseAddModal={() => setIsAddEmployeeModalOpen(false)}
            />
          );
        case 'leaves':
          return <LeaveManagement />;
        case 'attendance':
          return <AttendanceScreen />;
        case 'profile':
          return <EmployerProfile />;
        default:
          return <EmployerDashboard onNavigate={(tab) => setEmployerTab(tab as any)} onOpenAddEmployeeModal={() => setIsAddEmployeeModalOpen(true)} />;
      }
    } else {
      switch (employeeTab) {
        case 'dashboard':
          return <EmployeeDashboard onNavigate={(tab) => setEmployeeTab(tab as any)} />;
        case 'check-in':
          return <CheckInOutScreen />;
        case 'leave-req':
          return <LeaveRequestScreen />;
        case 'history':
          return <AttendanceHistoryScreen />;
        case 'profile':
          return <EmployeeProfile />;
        default:
          return <EmployeeDashboard onNavigate={(tab) => setEmployeeTab(tab as any)} />;
      }
    }
  };

  const getScreenTitle = () => {
    if (currentRole === 'employer') {
      switch (employerTab) {
        case 'dashboard':
          return 'HR Dashboard';
        case 'employees':
          return 'Staff Registry';
        case 'leaves':
          return 'Leave Approvals';
        case 'attendance':
          return 'Daily Logs';
        case 'profile':
          return 'Workspace Settings';
      }
    } else {
      switch (employeeTab) {
        case 'dashboard':
          return 'SyncHR Mobile';
        case 'check-in':
          return 'Check In / Out';
        case 'leave-req':
          return 'Request Leave';
        case 'history':
          return 'My Logs';
        case 'profile':
          return 'My Profile';
      }
    }
  };

  if (currentRole === 'guest') {
    return (
      <View style={[styles.rootContainer, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
        {isDesktopWeb ? (
          <View style={styles.webContainer}>
            <View style={[styles.phoneSimulator, { borderColor: theme.border, backgroundColor: theme.background }]}>
              <LoginScreen />
            </View>
          </View>
        ) : (
          <SafeAreaView style={{ flex: 1 }}>
            <LoginScreen />
          </SafeAreaView>
        )}
      </View>
    );
  }

  // Bottom Tabs navigation triggers mapping
  const employerTabsList = [
    { key: 'dashboard', label: 'Home', icon: 'home' as const },
    { key: 'employees', label: 'Staff', icon: 'users' as const },
    { key: 'leaves', label: 'Leaves', icon: 'calendar' as const },
    { key: 'attendance', label: 'Logs', icon: 'clock' as const },
    { key: 'profile', label: 'Settings', icon: 'settings' as const },
  ];

  const employeeTabsList = [
    { key: 'dashboard', label: 'Home', icon: 'home' as const },
    { key: 'check-in', label: 'Punch', icon: 'clock' as const },
    { key: 'leave-req', label: 'Leave', icon: 'calendar' as const },
    { key: 'history', label: 'Logs', icon: 'users' as const },
    { key: 'profile', label: 'Profile', icon: 'user' as const },
  ];

  const tabsList = currentRole === 'employer' ? employerTabsList : employeeTabsList;
  const activeTab = currentRole === 'employer' ? employerTab : employeeTab;
  const setActiveTab = currentRole === 'employer' ? setEmployerTab : setEmployeeTab;

  const appLayout = (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={[styles.header, { borderColor: theme.border, backgroundColor: theme.card }]}>
        <View style={styles.headerTitleRow}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>{getScreenTitle()}</Text>
          {currentRole === 'employer' && (
            <View style={[styles.adminBadge, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.adminBadgeText, { color: theme.primary }]}>Portal</Text>
            </View>
          )}
        </View>

        {/* Action icons right (theme toggle) */}
        <Pressable onPress={toggleTheme} style={styles.themeToggle}>
          <Icon name={themeMode === 'dark' ? 'sun' : 'moon'} color={theme.text} size={20} />
        </Pressable>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>{renderActiveScreen()}</View>

      {/* Custom Bottom Tab Bar */}
      <View style={[styles.tabBar, { borderColor: theme.border, backgroundColor: theme.card }]}>
        {tabsList.map((tab) => {
          const isFocused = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key as any)}
              style={styles.tabButton}
            >
              <Icon
                name={tab.icon}
                color={isFocused ? theme.primary : theme.textSecondary}
                size={22}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? theme.primary : theme.textSecondary },
                  isFocused && { fontWeight: '700' },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={[styles.rootContainer, { backgroundColor: themeMode === 'dark' ? '#020617' : '#F1F5F9' }]}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      {isDesktopWeb ? (
        <View style={styles.webContainer}>
          <View style={[styles.phoneSimulator, { borderColor: theme.border, backgroundColor: theme.background }]}>
            {appLayout}
          </View>
          {/* Side Web Presentation Helper Info */}
          <View style={styles.presentationCard}>
            <View style={[styles.logoIcon, { backgroundColor: theme.primary }]}>
              <Icon name="briefcase" color="#FFFFFF" size={32} />
            </View>
            <Text style={[styles.presTitle, { color: themeMode === 'dark' ? '#F8FAFC' : '#0F172A' }]}>
              SyncHR Management SaaS
            </Text>
            <Text style={[styles.presText, { color: themeMode === 'dark' ? '#94A3B8' : '#475569' }]}>
              This responsive prototype showcases both Employee and Employer workspaces.
            </Text>

            <View style={[styles.presTipCard, { backgroundColor: themeMode === 'dark' ? '#1E293B' : '#E2E8F0' }]}>
              <Text style={[styles.presTipTitle, { color: theme.primary }]}>💡 Evaluation Guide</Text>
              <Text style={[styles.presTipDesc, { color: themeMode === 'dark' ? '#CBD5E1' : '#334155' }]}>
                1. Sign in as <Text style={{ fontWeight: '700' }}>Employee</Text>, tap the <Text style={{ fontWeight: '700' }}>Punch</Text> tab to Check In.{'\n'}
                2. Tap <Text style={{ fontWeight: '700' }}>Leave</Text>, submit a Leave Request.{'\n'}
                3. Go to profile, <Text style={{ fontWeight: '700' }}>Sign Out</Text>.{'\n'}
                4. Sign in as <Text style={{ fontWeight: '700' }}>Employer</Text>. You will see the Live dashboard has updated details!{'\n'}
                5. Check Leaves to <Text style={{ fontWeight: '700' }}>Approve</Text> the employee request, and see it sync!
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
          {appLayout}
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.six,
  },
  phoneSimulator: {
    width: 375,
    height: 760,
    borderWidth: 8,
    borderRadius: 40,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
      },
    }),
  },
  header: {
    height: 60,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    ...Platform.select({
      ios: {
        paddingTop: 10,
        height: 70,
      },
    }),
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: Fonts.sans,
  },
  adminBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 6,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  themeToggle: {
    padding: Spacing.one * 1.5,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    height: 65,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Spacing.one,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    fontFamily: Fonts.sans,
  },
  presentationCard: {
    width: 340,
    alignSelf: 'center',
    gap: Spacing.three,
  },
  logoIcon: {
    width: 52,
    height: 52,
    borderRadius: Spacing.two * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presTitle: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: Fonts.sans,
  },
  presText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  presTipCard: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  presTipTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  presTipDesc: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
});

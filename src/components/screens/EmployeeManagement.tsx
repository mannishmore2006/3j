import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Pressable, Modal, FlatList, Platform } from 'react-native';
import { useApp, Employee } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, Fonts, BottomTabInset } from '@/constants/theme';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { InputField } from '../ui/InputField';

interface EmployeeManagementProps {
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
}

const DEPARTMENTS = ['All', 'Engineering', 'Design', 'HR', 'Sales'];

export function EmployeeManagement({ isAddModalOpen, onCloseAddModal }: EmployeeManagementProps) {
  const { employees, addEmployee } = useApp();
  const theme = useTheme();

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  // Add Employee Form States
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('Engineering');
  const [newRole, setNewRole] = useState<'Employee' | 'HR' | 'Admin'>('Employee');
  const [formError, setFormError] = useState('');

  const handleSaveEmployee = () => {
    if (!newName) {
      setFormError('Please enter a name');
      return;
    }
    if (!newEmail || !newEmail.includes('@')) {
      setFormError('Please enter a valid email address');
      return;
    }
    // Check if email already exists
    if (employees.some(e => e.email.toLowerCase() === newEmail.toLowerCase())) {
      setFormError('An employee with this email already exists');
      return;
    }

    addEmployee(newName, newEmail, newDept, newRole);
    // Reset
    setNewName('');
    setNewEmail('');
    setNewDept('Engineering');
    setNewRole('Employee');
    setFormError('');
    onCloseAddModal();
  };

  // Filter logic
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
                          emp.email.toLowerCase().includes(search.toLowerCase()) ||
                          emp.id.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const getAvatarBg = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];
    return colors[hash % colors.length];
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Header */}
      <View style={styles.headerArea}>
        <View style={[styles.searchBox, { borderColor: theme.border, backgroundColor: theme.card }]}>
          <Icon name="search" color={theme.textSecondary} size={18} style={{ marginRight: Spacing.two }} />
          <TextInput
            placeholder="Search by name, ID, email..."
            placeholderTextColor={theme.textSecondary + '80'}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: theme.text, fontFamily: Fonts.sans }]}
          />
          {search ? (
            <Pressable onPress={() => setSearch('')}>
              <Icon name="x" color={theme.textSecondary} size={16} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Department Tabs horizontal scroll */}
      <View style={styles.tabScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {DEPARTMENTS.map((dept) => {
            const isActive = selectedDept === dept;
            return (
              <Pressable
                key={dept}
                onPress={() => setSelectedDept(dept)}
                style={[
                  styles.deptTab,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  isActive && { backgroundColor: theme.primary, borderColor: theme.primary },
                ]}
              >
                <Text
                  style={[
                    styles.deptTabText,
                    { color: theme.textSecondary },
                    isActive && { color: '#FFFFFF', fontWeight: '700' },
                  ]}
                >
                  {dept}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Employee List */}
      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Icon name="users" color={theme.textSecondary} size={48} style={{ marginBottom: Spacing.two, opacity: 0.5 }} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No employees found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.employeeCard} type="outline">
            <View style={styles.cardHeader}>
              <View style={[styles.avatarCircle, { backgroundColor: getAvatarBg(item.id) }]}>
                <Text style={styles.avatarText}>{item.avatar}</Text>
              </View>
              <View style={styles.empDetails}>
                <Text style={[styles.empName, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.empMeta, { color: theme.textSecondary }]}>
                  {item.id} • {item.role}
                </Text>
                <Text style={[styles.empEmail, { color: theme.textSecondary }]}>{item.email}</Text>
              </View>
              <Badge
                text={item.status}
                status={
                  item.status === 'Active'
                    ? 'success'
                    : item.status === 'On Leave'
                    ? 'warning'
                    : 'danger'
                }
              />
            </View>
            <View style={[styles.cardDivider, { backgroundColor: theme.border }]} />
            <View style={styles.cardFooter}>
              <View style={styles.footerCol}>
                <Text style={[styles.footerLabel, { color: theme.textSecondary }]}>Department</Text>
                <Text style={[styles.footerValue, { color: theme.text }]}>{item.department}</Text>
              </View>
              <View style={styles.footerCol}>
                <Text style={[styles.footerLabel, { color: theme.textSecondary }]}>Joined Date</Text>
                <Text style={[styles.footerValue, { color: theme.text }]}>{item.joinDate}</Text>
              </View>
            </View>
          </Card>
        )}
      />

      {/* Add Employee Modal */}
      <Modal
        visible={isAddModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={onCloseAddModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Add New Employee</Text>
              <Pressable onPress={onCloseAddModal} style={styles.closeButton}>
                <Icon name="x" color={theme.text} size={20} />
              </Pressable>
            </View>

            {formError ? (
              <View style={[styles.modalError, { backgroundColor: theme.dangerLight }]}>
                <Text style={{ color: theme.danger, fontWeight: '600', fontSize: 13 }}>{formError}</Text>
              </View>
            ) : null}

            <ScrollView contentContainerStyle={styles.formContainer}>
              <InputField
                label="Full Name"
                value={newName}
                onChangeText={(text) => {
                  setNewName(text);
                  setFormError('');
                }}
                placeholder="Johnathan Davis"
                iconName="user"
                autoCapitalize="words"
              />

              <InputField
                label="Email Address"
                value={newEmail}
                onChangeText={(text) => {
                  setNewEmail(text);
                  setFormError('');
                }}
                placeholder="johnathan@company.com"
                iconName="mail"
                keyboardType="email-address"
              />

              {/* Department Picker mock */}
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Department</Text>
              <View style={styles.selectorGroup}>
                {['Engineering', 'Design', 'HR', 'Sales'].map((d) => (
                  <Pressable
                    key={d}
                    onPress={() => setNewDept(d)}
                    style={[
                      styles.selectorItem,
                      { borderColor: theme.border, backgroundColor: theme.background },
                      newDept === d && { borderColor: theme.primary, backgroundColor: theme.primaryLight },
                    ]}
                  >
                    <Text
                      style={[
                        styles.selectorText,
                        { color: theme.text },
                        newDept === d && { color: theme.primary, fontWeight: '700' },
                      ]}
                    >
                      {d}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Role Picker mock */}
              <Text style={[styles.fieldLabel, { color: theme.textSecondary, marginTop: Spacing.three }]}>Role</Text>
              <View style={styles.selectorGroup}>
                {(['Employee', 'HR', 'Admin'] as const).map((r) => (
                  <Pressable
                    key={r}
                    onPress={() => setNewRole(r)}
                    style={[
                      styles.selectorItem,
                      { borderColor: theme.border, backgroundColor: theme.background },
                      newRole === r && { borderColor: theme.primary, backgroundColor: theme.primaryLight },
                    ]}
                  >
                    <Text
                      style={[
                        styles.selectorText,
                        { color: theme.text },
                        newRole === r && { color: theme.primary, fontWeight: '700' },
                      ]}
                    >
                      {r}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Button
                title="Create Employee Profile"
                onPress={handleSaveEmployee}
                size="large"
                style={styles.submitBtn}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerArea: {
    padding: Spacing.three,
    paddingBottom: Spacing.two,
  },
  searchBox: {
    height: 48,
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
  tabScrollContainer: {
    height: 44,
    marginBottom: Spacing.two,
  },
  tabScroll: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    alignItems: 'center',
  },
  deptTab: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one * 1.5,
    borderRadius: Spacing.two,
    borderWidth: 1,
  },
  deptTabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    padding: Spacing.three,
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.five,
  },
  employeeCard: {
    padding: Spacing.three,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  empDetails: {
    flex: 1,
    marginLeft: Spacing.three,
  },
  empName: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: Fonts.sans,
  },
  empMeta: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  empEmail: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '400',
  },
  cardDivider: {
    height: 1,
    marginVertical: Spacing.two,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerCol: {
    gap: Spacing.half,
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  footerValue: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '80%',
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    padding: Spacing.four,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      web: {
        boxShadow: '0 -8px 24px rgba(15, 23, 42, 0.1)',
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Fonts.sans,
  },
  closeButton: {
    padding: Spacing.one,
  },
  modalError: {
    padding: Spacing.two,
    borderRadius: Spacing.one,
    marginBottom: Spacing.three,
  },
  formContainer: {
    gap: Spacing.two,
    paddingBottom: Spacing.six,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Spacing.one,
  },
  selectorGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  selectorItem: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 1.5,
  },
  selectorText: {
    fontSize: 13,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: Spacing.four,
    height: 48,
  },
});

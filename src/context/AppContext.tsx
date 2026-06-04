import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Suspended';
  avatar: string;
  joinDate: string;
  role: 'Employee' | 'HR' | 'Admin';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  checkIn: string; // e.g. "09:05 AM"
  checkOut?: string; // e.g. "05:30 PM"
  date: string; // e.g. "2026-06-04"
  status: 'Present' | 'Late' | 'Absent' | 'On Leave';
  coordinates?: string; // e.g. "37.7749° N, 122.4194° W"
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'Paid Leave' | 'Sick Leave' | 'Unpaid Leave' | 'Casual Leave';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  day: string;
}

interface AppContextType {
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  holidays: Holiday[];
  currentRole: 'guest' | 'employer' | 'employee';
  currentUser: Employee | null;
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
  login: (role: 'employer' | 'employee', email: string) => boolean;
  logout: () => void;
  checkIn: (employeeId: string, coordinates?: string) => void;
  checkOut: (employeeId: string) => void;
  submitLeave: (employeeId: string, type: LeaveRequest['type'], startDate: string, endDate: string, reason: string) => void;
  approveLeave: (leaveId: string) => void;
  rejectLeave: (leaveId: string) => void;
  addEmployee: (name: string, email: string, department: string, role: Employee['role']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SEED_EMPLOYEES: Employee[] = [
  { id: 'EMP-01', name: 'Sarah Connor', email: 'sarah@company.com', department: 'Engineering', status: 'Active', avatar: 'SC', joinDate: '2024-01-15', role: 'Admin' },
  { id: 'EMP-02', name: 'John Doe', email: 'john@company.com', department: 'Design', status: 'Active', avatar: 'JD', joinDate: '2024-03-10', role: 'Employee' },
  { id: 'EMP-03', name: 'Jane Smith', email: 'jane@company.com', department: 'HR', status: 'Active', avatar: 'JS', joinDate: '2023-11-01', role: 'HR' },
  { id: 'EMP-04', name: 'David Miller', email: 'david@company.com', department: 'Sales', status: 'Active', avatar: 'DM', joinDate: '2024-05-20', role: 'Employee' },
  { id: 'EMP-05', name: 'Marcus Wright', email: 'marcus@company.com', department: 'Engineering', status: 'Active', avatar: 'MW', joinDate: '2024-02-18', role: 'Employee' },
];

const SEED_ATTENDANCE: AttendanceRecord[] = [
  // Current day: 2026-06-04
  { id: 'ATT-101', employeeId: 'EMP-01', employeeName: 'Sarah Connor', checkIn: '08:52 AM', date: '2026-06-04', status: 'Present', coordinates: '37.7749° N, 122.4194° W' },
  { id: 'ATT-102', employeeId: 'EMP-02', employeeName: 'John Doe', checkIn: '09:05 AM', checkOut: '05:00 PM', date: '2026-06-04', status: 'Present', coordinates: '37.7749° N, 122.4194° W' },
  { id: 'ATT-103', employeeId: 'EMP-03', employeeName: 'Jane Smith', checkIn: '09:12 AM', date: '2026-06-04', status: 'Present', coordinates: '37.7749° N, 122.4194° W' },
  // EMP-04 (David Miller) is absent
  // EMP-05 (Marcus Wright) is on Leave today
  { id: 'ATT-104', employeeId: 'EMP-05', employeeName: 'Marcus Wright', checkIn: '--:--', date: '2026-06-04', status: 'On Leave' },

  // Previous days
  { id: 'ATT-091', employeeId: 'EMP-01', employeeName: 'Sarah Connor', checkIn: '09:00 AM', checkOut: '05:30 PM', date: '2026-06-03', status: 'Present' },
  { id: 'ATT-092', employeeId: 'EMP-02', employeeName: 'John Doe', checkIn: '09:35 AM', checkOut: '06:00 PM', date: '2026-06-03', status: 'Late' },
  { id: 'ATT-093', employeeId: 'EMP-03', employeeName: 'Jane Smith', checkIn: '08:45 AM', checkOut: '05:00 PM', date: '2026-06-03', status: 'Present' },
  { id: 'ATT-094', employeeId: 'EMP-04', employeeName: 'David Miller', checkIn: '09:02 AM', checkOut: '05:15 PM', date: '2026-06-03', status: 'Present' },
  { id: 'ATT-095', employeeId: 'EMP-05', employeeName: 'Marcus Wright', checkIn: '08:50 AM', checkOut: '05:00 PM', date: '2026-06-03', status: 'Present' },
];

const SEED_LEAVES: LeaveRequest[] = [
  { id: 'LV-001', employeeId: 'EMP-05', employeeName: 'Marcus Wright', type: 'Sick Leave', startDate: '2026-06-04', endDate: '2026-06-05', reason: 'Dental Surgery Recovery', status: 'Approved', appliedOn: '2026-06-02' },
  { id: 'LV-002', employeeId: 'EMP-04', employeeName: 'David Miller', type: 'Paid Leave', startDate: '2026-06-08', endDate: '2026-06-12', reason: 'Family vacation to Hawaii', status: 'Pending', appliedOn: '2026-06-03' },
  { id: 'LV-003', employeeId: 'EMP-02', employeeName: 'John Doe', type: 'Casual Leave', startDate: '2026-06-15', endDate: '2026-06-15', reason: 'Personal work at home', status: 'Pending', appliedOn: '2026-06-04' },
];

const SEED_HOLIDAYS: Holiday[] = [
  { id: 'H-1', name: 'Independence Day', date: '2026-07-04', day: 'Saturday' },
  { id: 'H-2', name: 'Labor Day', date: '2026-09-07', day: 'Monday' },
  { id: 'H-3', name: 'Thanksgiving Day', date: '2026-11-26', day: 'Thursday' },
  { id: 'H-4', name: 'Christmas Day', date: '2026-12-25', day: 'Friday' },
];

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(SEED_EMPLOYEES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(SEED_ATTENDANCE);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(SEED_LEAVES);
  const [currentRole, setCurrentRole] = useState<'guest' | 'employer' | 'employee'>('guest');
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);

  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(
    systemScheme === 'dark' ? 'dark' : 'light'
  );

  useEffect(() => {
    if (systemScheme) {
      const target = systemScheme === 'dark' ? 'dark' : 'light';
      const timer = setTimeout(() => {
        setThemeMode(target);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [systemScheme]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const login = (role: 'employer' | 'employee', email: string): boolean => {
    if (role === 'employer') {
      // In this demo, if they choose employer, log them in as HR/Admin admin profile
      const adminEmp = employees.find(e => e.role === 'Admin' || e.role === 'HR') || employees[0];
      setCurrentRole('employer');
      setCurrentUser(adminEmp);
      return true;
    } else {
      const found = employees.find(e => e.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setCurrentRole('employee');
        setCurrentUser(found);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setCurrentRole('guest');
    setCurrentUser(null);
  };

  const checkIn = (employeeId: string, coordinates?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check if record already exists for today
    const existingIndex = attendance.findIndex(a => a.employeeId === employeeId && a.date === today);

    if (existingIndex >= 0) {
      // Already checked in, update it
      const updated = [...attendance];
      updated[existingIndex] = {
        ...updated[existingIndex],
        checkIn: timeStr,
        status: 'Present',
        coordinates: coordinates || '37.7749° N, 122.4194° W'
      };
      setAttendance(updated);
    } else {
      // New record
      const emp = employees.find(e => e.id === employeeId);
      const newRecord: AttendanceRecord = {
        id: `ATT-${Date.now()}`,
        employeeId,
        employeeName: emp ? emp.name : 'Unknown Employee',
        checkIn: timeStr,
        date: today,
        status: now.getHours() >= 9 && now.getMinutes() > 15 ? 'Late' : 'Present',
        coordinates: coordinates || '37.7749° N, 122.4194° W'
      };
      setAttendance(prev => [newRecord, ...prev]);
    }
  };

  const checkOut = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAttendance(prev => {
      return prev.map(rec => {
        if (rec.employeeId === employeeId && rec.date === today) {
          return {
            ...rec,
            checkOut: timeStr
          };
        }
        return rec;
      });
    });
  };

  const submitLeave = (
    employeeId: string,
    type: LeaveRequest['type'],
    startDate: string,
    endDate: string,
    reason: string
  ) => {
    const emp = employees.find(e => e.id === employeeId);
    const newRequest: LeaveRequest = {
      id: `LV-${Date.now()}`,
      employeeId,
      employeeName: emp ? emp.name : 'Unknown Employee',
      type,
      startDate,
      endDate,
      reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0]
    };
    setLeaves(prev => [newRequest, ...prev]);
  };

  const approveLeave = (leaveId: string) => {
    setLeaves(prev =>
      prev.map(lv => {
        if (lv.id === leaveId) {
          // If the approved leave starts today, update employee status to On Leave
          const today = new Date().toISOString().split('T')[0];
          if (lv.startDate <= today && lv.endDate >= today) {
            setEmployees(prevEmp =>
              prevEmp.map(e => (e.id === lv.employeeId ? { ...e, status: 'On Leave' } : e))
            );
            // Add leave record to today's attendance
            setAttendance(prevAtt => {
              const existingIdx = prevAtt.findIndex(a => a.employeeId === lv.employeeId && a.date === today);
              if (existingIdx >= 0) {
                const updated = [...prevAtt];
                updated[existingIdx] = { ...updated[existingIdx], status: 'On Leave' };
                return updated;
              } else {
                return [
                  {
                    id: `ATT-${Date.now()}`,
                    employeeId: lv.employeeId,
                    employeeName: lv.employeeName,
                    checkIn: '--:--',
                    date: today,
                    status: 'On Leave'
                  },
                  ...prevAtt
                ];
              }
            });
          }
          return { ...lv, status: 'Approved' };
        }
        return lv;
      })
    );
  };

  const rejectLeave = (leaveId: string) => {
    setLeaves(prev =>
      prev.map(lv => (lv.id === leaveId ? { ...lv, status: 'Rejected' } : lv))
    );
  };

  const addEmployee = (name: string, email: string, department: string, role: Employee['role']) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    const newEmp: Employee = {
      id: `EMP-0${employees.length + 1}`,
      name,
      email,
      department,
      status: 'Active',
      avatar: initials || 'EE',
      joinDate: new Date().toISOString().split('T')[0],
      role
    };
    setEmployees(prev => [...prev, newEmp]);
  };

  return (
    <AppContext.Provider
      value={{
        employees,
        attendance,
        leaves,
        holidays: SEED_HOLIDAYS,
        currentRole,
        currentUser,
        themeMode,
        toggleTheme,
        login,
        logout,
        checkIn,
        checkOut,
        submitLeave,
        approveLeave,
        rejectLeave,
        addEmployee,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
};

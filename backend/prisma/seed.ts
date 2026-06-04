import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.holiday.deleteMany({});
  await prisma.leave.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding users and employees...');
  const passwordHash = await bcrypt.hash('password123', 10);

  const employeesSeed = [
    { id: 'EMP-01', name: 'Sarah Connor', email: 'sarah@company.com', department: 'Engineering', initials: 'SC', joinDate: '2024-01-15', role: 'Admin' },
    { id: 'EMP-02', name: 'John Doe', email: 'john@company.com', department: 'Design', initials: 'JD', joinDate: '2024-03-10', role: 'Employee' },
    { id: 'EMP-03', name: 'Jane Smith', email: 'jane@company.com', department: 'HR', initials: 'JS', joinDate: '2023-11-01', role: 'HR' },
    { id: 'EMP-04', name: 'David Miller', email: 'david@company.com', department: 'Sales', initials: 'DM', joinDate: '2024-05-20', role: 'Employee' },
    { id: 'EMP-05', name: 'Marcus Wright', email: 'marcus@company.com', department: 'Engineering', initials: 'MW', joinDate: '2024-02-18', role: 'Employee' },
  ];

  for (const emp of employeesSeed) {
    const user = await prisma.user.create({
      data: {
        email: emp.email,
        password: passwordHash,
        role: emp.role,
      },
    });

    await prisma.employee.create({
      data: {
        id: emp.id,
        userId: user.id,
        name: emp.name,
        department: emp.department,
        avatarInitials: emp.initials,
        joinDate: emp.joinDate,
        status: 'Active',
      },
    });
  }

  console.log('Seeding holidays...');
  const holidays = [
    { name: 'Independence Day', date: '2026-07-04', day: 'Saturday' },
    { name: 'Labor Day', date: '2026-09-07', day: 'Monday' },
    { name: 'Thanksgiving Day', date: '2026-11-26', day: 'Thursday' },
    { name: 'Christmas Day', date: '2026-12-25', day: 'Friday' },
  ];

  for (const holiday of holidays) {
    await prisma.holiday.create({ data: holiday });
  }

  console.log('Seeding attendance...');
  const attendanceLogs = [
    // Today 2026-06-04
    { employeeId: 'EMP-01', date: '2026-06-04', checkIn: '08:52 AM', checkOut: null, status: 'Present', coordinates: '37.7749° N, 122.4194° W' },
    { employeeId: 'EMP-02', date: '2026-06-04', checkIn: '09:05 AM', checkOut: '05:00 PM', status: 'Present', coordinates: '37.7749° N, 122.4194° W' },
    { employeeId: 'EMP-03', date: '2026-06-04', checkIn: '09:12 AM', checkOut: null, status: 'Present', coordinates: '37.7749° N, 122.4194° W' },
    { employeeId: 'EMP-05', date: '2026-06-04', checkIn: '--:--', checkOut: null, status: 'On Leave', coordinates: null },

    // Yesterday 2026-06-03
    { employeeId: 'EMP-01', date: '2026-06-03', checkIn: '09:00 AM', checkOut: '05:30 PM', status: 'Present', coordinates: '37.7749° N, 122.4194° W' },
    { employeeId: 'EMP-02', date: '2026-06-03', checkIn: '09:35 AM', checkOut: '06:00 PM', status: 'Late', coordinates: '37.7749° N, 122.4194° W' },
    { employeeId: 'EMP-03', date: '2026-06-03', checkIn: '08:45 AM', checkOut: '05:00 PM', status: 'Present', coordinates: '37.7749° N, 122.4194° W' },
    { employeeId: 'EMP-04', date: '2026-06-03', checkIn: '09:02 AM', checkOut: '05:15 PM', status: 'Present', coordinates: '37.7749° N, 122.4194° W' },
    { employeeId: 'EMP-05', date: '2026-06-03', checkIn: '08:50 AM', checkOut: '05:00 PM', status: 'Present', coordinates: '37.7749° N, 122.4194° W' },
  ];

  for (const log of attendanceLogs) {
    await prisma.attendance.create({ data: log });
  }

  console.log('Seeding leave requests...');
  const leaves = [
    { employeeId: 'EMP-05', type: 'Sick Leave', startDate: '2026-06-04', endDate: '2026-06-05', reason: 'Dental Surgery Recovery', status: 'Approved', appliedOn: '2026-06-02' },
    { employeeId: 'EMP-04', type: 'Paid Leave', startDate: '2026-06-08', endDate: '2026-06-12', reason: 'Family vacation to Hawaii', status: 'Pending', appliedOn: '2026-06-03' },
    { employeeId: 'EMP-02', type: 'Casual Leave', startDate: '2026-06-15', endDate: '2026-06-15', reason: 'Personal work at home', status: 'Pending', appliedOn: '2026-06-04' },
  ];

  for (const leave of leaves) {
    await prisma.leave.create({ data: leave });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

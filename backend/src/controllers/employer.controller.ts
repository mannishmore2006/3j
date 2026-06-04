import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Restrict all routes inside this router to Admin and HR roles
router.use(authenticateJWT, requireRole(['Admin', 'HR']));

// 1. Dashboard aggregates
router.get('/dashboard', async (req, res) => {
  const todayStr = new Date().toISOString().split('T')[0];

  try {
    const totalEmployees = await prisma.employee.count();

    const presentToday = await prisma.attendance.count({
      where: {
        date: todayStr,
        status: { in: ['Present', 'Late'] },
      },
    });

    const pendingLeaves = await prisma.leave.count({
      where: { status: 'Pending' },
    });

    res.json({
      totalEmployees,
      presentToday,
      pendingLeaves,
    });
  } catch (err) {
    console.error('Error fetching HR dashboard metrics:', err);
    res.status(500).json({ error: 'Failed to retrieve manager dashboard metrics' });
  }
});

// 2. Staff List Registry
router.get('/employees', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    // Remap to match client model
    const result = employees.map(emp => ({
      id: emp.id,
      name: emp.name,
      email: emp.user.email,
      department: emp.department,
      status: emp.status,
      avatar: emp.avatarInitials,
      joinDate: emp.joinDate,
      role: emp.user.role,
    }));

    res.json(result);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Failed to retrieve staff list' });
  }
});

// 3. Create Employee
router.post('/employees', async (req, res) => {
  const { name, email, department, role } = req.body;

  if (!name || !email || !department || !role) {
    return res.status(400).json({ error: 'All fields (name, email, department, role) are required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email address already exists' });
    }

    // Default password encryption
    const passwordHash = await bcrypt.hash('password123', 10);
    const totalCount = await prisma.employee.count();
    const newEmpId = `EMP-0${totalCount + 1}`;
    const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: passwordHash,
          role: role,
        },
      });

      const employee = await tx.employee.create({
        data: {
          id: newEmpId,
          userId: user.id,
          name,
          department,
          avatarInitials: initials || 'EE',
          joinDate: new Date().toISOString().split('T')[0],
          status: 'Active',
        },
      });

      return { user, employee };
    });

    res.json({
      id: result.employee.id,
      name: result.employee.name,
      email: result.user.email,
      department: result.employee.department,
      status: result.employee.status,
      avatar: result.employee.avatarInitials,
      joinDate: result.employee.joinDate,
      role: result.user.role,
    });
  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(500).json({ error: 'Failed to create new employee profile' });
  }
});

// 4. Leave requests management
router.get('/leaves', async (req, res) => {
  try {
    const leaves = await prisma.leave.findMany({
      include: {
        employee: true,
      },
      orderBy: { startDate: 'desc' },
    });

    const result = leaves.map(l => ({
      id: l.id,
      employeeId: l.employeeId,
      employeeName: l.employee.name,
      type: l.type,
      startDate: l.startDate,
      endDate: l.endDate,
      reason: l.reason,
      status: l.status,
      appliedOn: l.appliedOn,
    }));

    res.json(result);
  } catch (err) {
    console.error('Error fetching leave history:', err);
    res.status(500).json({ error: 'Failed to retrieve leave requests list' });
  }
});

// 5. Approve/Reject Leave status patch
router.patch('/leaves/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'Approved' | 'Rejected'

  if (status !== 'Approved' && status !== 'Rejected') {
    return res.status(400).json({ error: 'Status must be Approved or Rejected' });
  }

  try {
    const leave = await prisma.leave.findUnique({
      where: { id },
      include: { employee: true },
    });

    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    const updatedLeave = await prisma.leave.update({
      where: { id },
      data: { status },
    });

    // Side effect: If approved and active today, mark employee "On Leave"
    if (status === 'Approved') {
      const todayStr = new Date().toISOString().split('T')[0];
      if (leave.startDate <= todayStr && leave.endDate >= todayStr) {
        // Update employee status to On Leave
        await prisma.employee.update({
          where: { id: leave.employeeId },
          data: { status: 'On Leave' },
        });

        // Upsert today's attendance log as On Leave
        await prisma.attendance.upsert({
          where: {
            employeeId_date: {
              employeeId: leave.employeeId,
              date: todayStr,
            },
          },
          update: { status: 'On Leave', checkIn: '--:--' },
          create: {
            employeeId: leave.employeeId,
            date: todayStr,
            checkIn: '--:--',
            status: 'On Leave',
          },
        });
      }
    }

    res.json(updatedLeave);
  } catch (err) {
    console.error('Error updating leave status:', err);
    res.status(500).json({ error: 'Failed to update leave request status' });
  }
});

// 6. Today's daily attendance list
router.get('/attendance/today', async (req, res) => {
  const todayStr = new Date().toISOString().split('T')[0];

  try {
    const employees = await prisma.employee.findMany();
    const records = await prisma.attendance.findMany({
      where: { date: todayStr },
    });

    const dailyLogs = employees.map((emp) => {
      const record = records.find((rec) => rec.employeeId === emp.id);
      return {
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        checkIn: record ? record.checkIn : '--:--',
        checkOut: record?.checkOut ? record.checkOut : '--:--',
        status: record ? record.status : 'Absent',
        coordinates: record?.coordinates || null,
      };
    });

    res.json(dailyLogs);
  } catch (err) {
    console.error('Error fetching today\'s attendance logs:', err);
    res.status(500).json({ error: 'Failed to compile daily attendance list' });
  }
});

export default router;

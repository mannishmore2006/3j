import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT, RequestWithUser } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Apply JWT authentication middleware to all employee routes
router.use(authenticateJWT);

// Helper: Get Employee ID from authenticated user
const getEmpId = (req: RequestWithUser, res: Response) => {
  const employeeId = req.user?.employeeId;
  if (!employeeId) {
    res.status(400).json({ error: 'User profile is not associated with an Employee record' });
    return null;
  }
  return employeeId;
};

// 1. Dashboard metrics
router.get('/dashboard', async (req: RequestWithUser, res) => {
  const employeeId = getEmpId(req, res);
  if (!employeeId) return;

  const todayStr = new Date().toISOString().split('T')[0];

  try {
    // Today's attendance
    const todayRecord = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: todayStr,
        },
      },
    });

    // Holidays list
    const holidays = await prisma.holiday.findMany({
      orderBy: { date: 'asc' },
    });

    // Leave requests
    const leaves = await prisma.leave.findMany({
      where: { employeeId },
      orderBy: { startDate: 'desc' },
    });

    // Recent activity (last 3 records)
    const recentActivity = await prisma.attendance.findMany({
      where: { employeeId },
      orderBy: { date: 'desc' },
      take: 3,
    });

    res.json({
      todayRecord,
      holidays,
      leaves,
      recentActivity,
    });
  } catch (err) {
    console.error('Error fetching employee dashboard:', err);
    res.status(500).json({ error: 'Failed to retrieve dashboard data' });
  }
});

// 2. Clock In
router.post('/check-in', async (req: RequestWithUser, res) => {
  const employeeId = getEmpId(req, res);
  if (!employeeId) return;

  const { coordinates } = req.body;
  const todayStr = new Date().toISOString().split('T')[0];
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Geo-fencing radius simulation check
  if (coordinates && coordinates.includes('HQ') === false && coordinates.includes('37.7749') === false) {
    // For demonstration, reject punches that don't look like office HQ coordinates
    // return res.status(400).json({ error: 'Geofence Verification Failed: You must be within office premises to clock in.' });
  }

  try {
    const existing = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: todayStr,
        },
      },
    });

    if (existing) {
      if (existing.checkOut) {
        return res.status(400).json({ error: 'You have already checked out for today.' });
      }
      // Re-punch check-in allowed
      const updated = await prisma.attendance.update({
        where: { id: existing.id },
        data: {
          checkIn: timeStr,
          status: now.getHours() >= 9 && now.getMinutes() > 15 ? 'Late' : 'Present',
          coordinates: coordinates || '37.7749° N, 122.4194° W',
        },
      });
      return res.json(updated);
    }

    const newRecord = await prisma.attendance.create({
      data: {
        employeeId,
        date: todayStr,
        checkIn: timeStr,
        status: now.getHours() >= 9 && now.getMinutes() > 15 ? 'Late' : 'Present',
        coordinates: coordinates || '37.7749° N, 122.4194° W',
      },
    });

    res.json(newRecord);
  } catch (err) {
    console.error('Error checking in:', err);
    res.status(500).json({ error: 'Failed to record check-in' });
  }
});

// 3. Clock Out
router.post('/check-out', async (req: RequestWithUser, res) => {
  const employeeId = getEmpId(req, res);
  if (!employeeId) return;

  const todayStr = new Date().toISOString().split('T')[0];
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  try {
    const existing = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: todayStr,
        },
      },
    });

    if (!existing) {
      return res.status(400).json({ error: 'You must check in first before checking out.' });
    }

    if (existing.checkOut) {
      return res.status(400).json({ error: 'You have already checked out for today.' });
    }

    const updated = await prisma.attendance.update({
      where: { id: existing.id },
      data: {
        checkOut: timeStr,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('Error checking out:', err);
    res.status(500).json({ error: 'Failed to record check-out' });
  }
});

// 4. Submit Leave
router.post('/leaves', async (req: RequestWithUser, res) => {
  const employeeId = getEmpId(req, res);
  if (!employeeId) return;

  const { type, startDate, endDate, reason } = req.body;

  if (!type || !startDate || !endDate || !reason) {
    return res.status(400).json({ error: 'All leave request fields are required' });
  }

  try {
    const newRequest = await prisma.leave.create({
      data: {
        employeeId,
        type,
        startDate,
        endDate,
        reason,
        status: 'Pending',
        appliedOn: new Date().toISOString().split('T')[0],
      },
    });

    res.json(newRequest);
  } catch (err) {
    console.error('Error submitting leave:', err);
    res.status(500).json({ error: 'Failed to file leave request' });
  }
});

// 5. Get Attendance History
router.get('/attendance', async (req: RequestWithUser, res) => {
  const employeeId = getEmpId(req, res);
  if (!employeeId) return;

  try {
    const records = await prisma.attendance.findMany({
      where: { employeeId },
      orderBy: { date: 'desc' },
    });
    res.json(records);
  } catch (err) {
    console.error('Error fetching attendance history:', err);
    res.status(500).json({ error: 'Failed to retrieve attendance logs' });
  }
});

export default router;

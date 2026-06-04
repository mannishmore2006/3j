import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'sync_hr_saas_portal_jwt_secret_key_2026';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { employee: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employee?.id,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.employee?.id,
        name: user.employee?.name,
        email: user.email,
        department: user.employee?.department,
        role: user.role,
        avatar: user.employee?.avatarInitials,
        joinDate: user.employee?.joinDate,
        status: user.employee?.status,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'An error occurred during sign-in' });
  }
});

router.post('/signup', async (req, res) => {
  const { email, password, name, role, department } = req.body;

  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: 'Email, password, name, and role are required' });
  }

  if (role !== 'employer' && role !== 'employee') {
    return res.status(400).json({ error: 'Role must be employer or employee' });
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const dbRole = role === 'employer' ? 'HR' : 'Employee';
    const dbDept = role === 'employer' ? 'HR' : (department || 'Engineering');
    
    const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
    
    // Auto-generate employee ID
    const count = await prisma.employee.count();
    const newEmpId = `EMP-0${count + 1}`;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: passwordHash,
          role: dbRole,
        },
      });

      const employee = await tx.employee.create({
        data: {
          id: newEmpId,
          userId: user.id,
          name,
          department: dbDept,
          avatarInitials: initials || 'EE',
          joinDate: new Date().toISOString().split('T')[0],
          status: 'Active',
        },
      });

      return { user, employee };
    });

    const tokenPayload = {
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
      employeeId: result.employee.id,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: result.employee.id,
        name: result.employee.name,
        email: result.user.email,
        department: result.employee.department,
        role: result.user.role,
        avatar: result.employee.avatarInitials,
        joinDate: result.employee.joinDate,
        status: result.employee.status,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'An error occurred during account creation' });
  }
});

export default router;

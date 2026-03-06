import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '&78ab';
const SALT_ROUNDS = 10;
const TOKEN_EXPIRES_IN = '1d';
const COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const users = new Map();

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: COOKIE_MAX_AGE_MS,
  });
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    if (users.has(normalizedEmail)) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    users.set(normalizedEmail, { email: normalizedEmail, passwordHash });

    const token = jwt.sign({ email: normalizedEmail }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
    setAuthCookie(res, token);

    return res.status(201).json({
      message: 'Signup successful',
      user: { email: normalizedEmail },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to signup' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = users.get(normalizedEmail);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ email: normalizedEmail }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
    setAuthCookie(res, token);

    return res.json({
      message: 'Login successful',
      user: { email: normalizedEmail },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to login' });
  }
};

export const getCurrentUser = (req, res) => {
  return res.json({
    user: { email: req.user.email },
  });
};

export const logout = (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Logged out successfully' });
};

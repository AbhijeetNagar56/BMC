import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || '&78ab';
const SALT_ROUNDS = 10;
const TOKEN_EXPIRES_IN = '1d';
const COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE_MS,
  });
};

export const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const normalizedUsername = String(username || normalizedEmail.split('@')[0])
      .toLowerCase()
      .trim();

    if (!normalizedUsername) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const existingUsername = await User.findOne({ username: normalizedUsername });
    if (existingUsername) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
    });

    const token = jwt.sign(
      {
        id: newUser._id.toString(),
        email: normalizedEmail,
        username: normalizedUsername,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN },
    );
    setAuthCookie(res, token);

    return res.status(201).json({
      message: 'Signup successful',
      user: {
        id: newUser._id,
        email: normalizedEmail,
        username: normalizedUsername,
        role: newUser.role,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'User already exists' });
    }
    return res.status(500).json({ message: 'Failed to signup' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, identifier, password } = req.body;
    const loginIdentifier = String(identifier || email || '')
      .toLowerCase()
      .trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: 'Username/email and password are required' });
    }

    const user = await User.findOne({
      $or: [{ email: loginIdentifier }, { username: loginIdentifier }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN },
    );
    setAuthCookie(res, token);

    return res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to login' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id).select('_id email username role');
    if (!currentUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return res.json({
      user: {
        id: currentUser._id,
        email: currentUser.email,
        username: currentUser.username,
        role: currentUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load user' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Logged out successfully' });
};

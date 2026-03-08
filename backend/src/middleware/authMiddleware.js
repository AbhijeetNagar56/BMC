import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '&78ab';

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: missing token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
      role: decoded.role || 'user',
    };

    if (!req.user.id || !req.user.email) {
      return res.status(401).json({ message: 'Unauthorized: invalid token payload' });
    }

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: invalid token' });
  }
};

export default authMiddleware;

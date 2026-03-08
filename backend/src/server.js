import './config/env.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import { connectDB } from './config/db.js';
import { initializeRedis } from './redis/redis.js';
import { seedProducts } from './data/seedProducts.js';
import { seedAdmin } from './data/seedAdmin.js';

const app = express();
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  }),
);

app.get('/api', (req, res) => {
  res.json({ msg: 'Backend running successfully' });
});

app.use('/api/auth', authRoutes);
app.use('/api/shop', shopRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();
    await seedProducts();
    await initializeRedis();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

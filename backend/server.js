import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Database
import db from './config/database.js';

// Middlewares
import { errorHandler } from './middlewares/errorHandler.js';
import { apiRateLimiter } from './middlewares/rateLimiter.js';

// Routes
import authRoutes          from './routes/authRoutes.js';
import appointmentRoutes   from './routes/appointmentRoutes.js';
import animalRoutes        from './routes/animalRoutes.js';
import ownerRoutes         from './routes/ownerRoutes.js';
import invoiceRoutes       from './routes/invoiceRoutes.js';
import paymentRoutes       from './routes/paymentRoutes.js';
import messageRoutes       from './routes/messageRoutes.js';
import consultationRoutes  from './routes/consultationRoutes.js';   // NEW
import labRoutes           from './routes/labRoutes.js';            // NEW
import prescriptionRoutes  from './routes/prescriptionRoutes.js';   // NEW
import inventoryRoutes from './routes/inventoryRoutes.js';
import followUpRoutes from './routes/followUpRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

/* ---------- CORS ---------- */
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:5173',
];
if (process.env.CLIENT_URL) ALLOWED_ORIGINS.push(process.env.CLIENT_URL);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    console.warn(`⚠️  CORS blocked: ${origin}`);
    cb(new Error(`Origin ${origin} not allowed`));
  },
  credentials: true,
}));

/* ---------- Middleware ---------- */
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api/', apiRateLimiter);
app.use('/api/v1/follow-ups', followUpRoutes);

/* ---------- Health ---------- */
app.get('/health', async (req, res, next) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'OK', database: 'Connected', time: new Date() });
  } catch (err) { next(err); }
});

/* ============================================================
   API ROUTES
============================================================ */
app.use('/api/v1/auth',          authRoutes);
app.use('/api/v1/appointments',  appointmentRoutes);
app.use('/api/v1/animals',       animalRoutes);
app.use('/api/v1/owners',        ownerRoutes);
app.use('/api/v1/invoices',      invoiceRoutes);
app.use('/api/v1/payments',      paymentRoutes);
app.use('/api/v1/messages',      messageRoutes);
app.use('/api/v1/consultations', consultationRoutes);   // NEW
app.use('/api/v1/lab',           labRoutes);            // NEW
app.use('/api/v1/prescriptions', prescriptionRoutes);   // NEW

// ...
app.use('/api/v1/inventory', inventoryRoutes);
/* ---------- 404 ---------- */
app.use((req, res) => {
  console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, message: 'Route not found' });
});

/* ---------- Error handler ---------- */
app.use(errorHandler);

/* ---------- Start ---------- */
const server = app.listen(PORT, () => {
  console.log(`\n🚀 VetraCare API Server running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   API:    http://localhost:${PORT}/api/v1\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} in use. Set PORT in .env.`);
    return;
  }
  console.error('❌ Failed to start:', err);
});
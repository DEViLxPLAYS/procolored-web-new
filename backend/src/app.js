const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const adminRoutes = require('./routes/admin');
const newsletterRoutes = require('./routes/newsletter');
const orderRoutes = require('./routes/orders');
const checkoutRoutes = require('./routes/checkout');
const analyticsRoutes = require('./routes/analytics');
const paymentKeysRouter = require('./routes/paymentKeys');
const paypalRoutes = require('./routes/paypal');
const contactRoutes = require('./routes/contact');

const app = express();

// ================================
// Security Headers (Helmet)
// ================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-origin" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "deny" },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true,
}));

// ================================
// CORS — Only allow your frontend
// ================================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  optionsSuccessStatus: 200,
  maxAge: 86400
};
app.use(cors(corsOptions));
// Handle all preflight requests before hitting other middleware
app.options('*', cors(corsOptions));

// ================================
// Global Rate Limiter
// ================================
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// ================================
// Body Parsing
// ================================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ================================
// Logging (production safe)
// ================================
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ================================
// Remove fingerprinting headers
// ================================
app.disable('x-powered-by');

// ================================
// Routes
// ================================
app.use('/api/admin', adminRoutes);
app.use('/api/admin/payment-keys', paymentKeysRouter);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/contact', contactRoutes);

// ================================
// Health check (no sensitive data)
// ================================
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ================================
// 404 Handler
// ================================
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ================================
// Global Error Handler
// ================================
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  // Never expose error details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;
  res.status(err.status || 500).json({ error: message });
});

module.exports = app;

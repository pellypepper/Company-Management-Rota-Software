const express = require('express');
require('dotenv').config();
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./backend/db');
const passport = require('passport');
const { initializePassport } = require('./backend/auth');
const shiftRoute = require('./backend/routes/shiftRoute');
const staffRoute = require('./backend/routes/staffRoute');
const leaveRoute = require('./backend/routes/leaveRoute');
const managerRoute = require('./backend/routes/managerRoute');
const { isAuthenticated, checkRole } = require('./backend/middleware/middleware');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, 'frontend/build')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
const sessionStore = new pgSession({
  pool: pool,
  tableName: 'session',
  createTableIfMissing: true,
});

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
    },
  })
);

// CORS configuration
app.use(cors({
  origin: 'https://companyrotasoftware-3f6dcaa37799.herokuapp.com',
  credentials: true,
}));

// Initialize Passport for authentication
initializePassport(passport);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/shifts', shiftRoute);
app.use('/staff', staffRoute);
app.use('/leave', leaveRoute);
app.use('/manager', managerRoute);

// Serve frontend
app.get("/managerdash", isAuthenticated, checkRole(['manager']), (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'managerdash.html'));
});
app.get("/staffdash", isAuthenticated, checkRole(['staff']), (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'staffdash.html'));
});
app.get("/hrdash", isAuthenticated, checkRole(['hr']), (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'hrdash.html'));
});

// Catch-all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

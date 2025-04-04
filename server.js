const express = require('express');
require('dotenv').config();
const path = require('path');
const session = require("express-session");
const passport = require("passport");

const pool = require('./backend/db');
const app = express();
const pgSession = require('connect-pg-simple')(session);
const cors = require('cors');
const { initializePassport } = require('./backend/auth');
const shiftRoute = require('./backend/routes/shiftRoute');
const staffRoute = require('./backend/routes/staffRoute');
const leaveRoute = require('./backend/routes/leaveRoute');
const managerRoute = require('./backend/routes/managerRoute');
const authRoute = require('./backend/routes/auth');
const { isAuthenticated, checkRole } = require('./backend/middleware/middleware');


const { Pool } = require('pg');
const PORT = process.env.PORT || 10000;


app.use(express.static(path.join(__dirname, 'frontend/build')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const pgPool = require('pg').Pool; 
const sessionStore = new pgSession({
    pool: pool, 
    tableName: 'session' ,
    createTableIfMissing: true
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
      secure: false,
      sameSite: 'strict'
    },
  })
);

app.use(cors({
  origin: 'https://companyrotasoftware-3f6dcaa37799.herokuapp.com',
  credentials: true
}));


initializePassport(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use('/shifts', shiftRoute);
app.use('/staff', staffRoute);
app.use('/leave', leaveRoute);
app.use('/manager', managerRoute);
app.use('/auth', authRoute);






app.post('/addrole', async (req, res) => {
  const { position, role, pay, name } = req.body;

   
  try {
    const roleCheck = await pool.query(
      `SELECT CAST(id AS VARCHAR) AS identifier FROM managerrole WHERE name = $1
      UNION
      SELECT name FROM staffrole WHERE name = $1;
      `,
      [name]
  );

  if (roleCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Role already exists' });
  }
      let result = await pool.query('SELECT * FROM staff WHERE name = $1', [name]);
      let tableName;
      let id;

      if (result.rows.length > 0) {
        
          id = result.rows[0].id; 
          tableName = 'staffrole';
      } else {
    
          result = await pool.query('SELECT * FROM manager WHERE name = $1', [name]);
          if (result.rows.length > 0) {
      
              id = result.rows[0].id; 
              tableName = 'managerrole'; 
          } else {
          
              return res.status(404).json({ message: 'User not found' });
          }
      }

      
      const insert = await pool.query(`INSERT INTO ${tableName} (staff_id,name, pay, role, position) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [id,name, pay, role, position]);
      
      if (insert.rows.length > 0) {
        
          return res.json(insert.rows[0]);
      } else {

          return res.status(500).json({ message: 'Internal server error' });
      }
  } catch (error) {
      console.error('Error adding role:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});







app.get("/managerdash", isAuthenticated, checkRole(['manager']), (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'managerdash.html'));
});

app.get("/staffdash", isAuthenticated, checkRole(['staff']), (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'staffdash.html'));
});
app.get("/hrdash", isAuthenticated, checkRole(['hr']), (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'hrdash.html'));
});

app.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Failed to log out" });
    }
    

    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.error("Session destruction error:", destroyErr);
        return res.status(500).json({ error: "Failed to destroy session" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logout successful" });
    });
  });
});




app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

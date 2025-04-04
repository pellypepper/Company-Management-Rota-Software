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




app.post('/login', (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error." });
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }

 
    if (!user.isverified) {
      return res.status(400).json({ message: 'Please verify your email before logging in.' });
    }

   
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Login failed." });
      }

      const userRole = user.role.toLowerCase();
      const redirectPath = 
      userRole === "hr" ? '/hrdash' : 
      userRole === "manager" ? '/managerdash' : 
      '/staffdash';
    
   
      return res.json({
        redirect: redirectPath,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          city: user.city
        }
      });
    });
  })(req, res, next);
});

app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, role, address, state, zipcode, city } = req.body;

  try {
     
      const existingManager = await pool.query('SELECT * FROM manager WHERE email = $1', [email]);
      const existingStaff = await pool.query('SELECT * FROM staff WHERE email = $1', [email]);
      const existingHr = await pool.query('SELECT * FROM hr WHERE email = $1', [email]);


      if (existingManager.rows.length > 0 || existingStaff.rows.length > 0 || existingHr.rows.length > 0) {
          return res.status(401).json({ message: "User already exists." });
      }


      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);


      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const activationLink = `${process.env.REACT_APP_API_URL}/activate/${token}`;
    


      await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Activate your account',
          text: `Welcome to the Company Rota Management System. Click the link to activate your account: ${activationLink} to proceed with login`,
      });


      let tableName = role === "hr" ? "hr": role === "manager" ? "manager" : "staff";
      const name = firstName + " " + lastName;

      const insertResult = await pool.query(
          `INSERT INTO ${tableName} (name, email, password, role, address, state, zipcode, city, isVerified) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
          RETURNING *`,
          [name, email, hashedPassword, role, address, state, zipcode, city, false] 
      );

      if (!insertResult.rows[0]) {
          return res.status(500).json({ message: `Failed to create ${role}.` });
      }


      return res.json({
          message: 'Registration successful. Please check your email to activate your account.',
      });

  } catch (error) {
  
      return res.status(500).json({ message: "Internal server error." });
  }
});



app.get('/activate/:token', async (req, res) => {
  const { token } = req.params;


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); 


    const tables = ['manager', 'staff', 'hr'];
    let user = null;

    for (const table of tables) {
      const result = await pool.query(`SELECT * FROM ${table} WHERE email = $1`, [decoded.email]);
      if (result.rows.length > 0) {
        user = { ...result.rows[0], table }; 
        break;
      }
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid activation link' });
    }


    const updateResult = await pool.query(
      `UPDATE ${user.table} SET isVerified = $1 WHERE email = $2`,
      [true, decoded.email]
    );

    if (updateResult.rowCount > 0) {
      return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Activated</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #f0f4f8;
                    font-family: Arial, sans-serif;
                }
                .message {
                    text-align: center;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    background-color: #fff;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .success {
                    color: green;
                    font-size: 24px;
                }
            </style>
        </head>
        <body>
            <div class="message">
                <h2 class="success">Account activated successfully!</h2>
                <p>You can now log in.</p>
                <p>Redirecting to login page...</p>
                <script>
                    // Redirect to login page after 2 seconds
                    setTimeout(() => {
                        window.location.href = '/login'; // Update this path as necessary
                    }, 2000);
                </script>
            </div>
        </body>
        </html>
      `);
    } else {
      throw new Error('Failed to update verification status.');
    }
  } catch (error) {
  
    res.status(400).json({ message: 'Invalid or expired activation link' });
  }
});


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



app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});


app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

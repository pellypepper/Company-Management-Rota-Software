const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { sendActivationEmail } = require('../email');


// Login user
const login =  (req, res, next) => {
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
  }


  // Register user
  const register =  async (req, res) => {
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
        const activationLink = `${process.env.REACT_APP_API_URL}/auth/activate/${token}`;
      
  
        await sendActivationEmail(email, activationLink);
  
  
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
  }


  // Activate user account
  const activateToken = async (req, res) => {
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
  }


  // Logout user
  const logout = (req, res) => {
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
  }

  module.exports = {
    login,
    register,
    activateToken,
    logout,
  };
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const nodemailer = require('nodemailer');
const { sendActivationEmail } = require('./email');


const initializePassport = (passport) => {
passport.use(
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    try {
     
      let result = await pool.query('SELECT * FROM manager WHERE email = $1', [email]);
      let user = result.rows[0];


      if (!user) {
        result = await pool.query('SELECT * FROM staff WHERE email = $1', [email]);
        user = result.rows[0];
      }
      if (!user) {
        result = await pool.query('SELECT * FROM Hr WHERE email = $1', [email]);
        user = result.rows[0];
      }

    
      if (!user) {
        return done(null, false, { message: 'No user found with that email.' });
      }

      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      console.error('Error in LocalStrategy:', error);
      return done(error);
    }
  })
);


passport.serializeUser((user, done) => {
  if (!user?.id || !user?.role) {
    return done(new Error("Invalid user object"));
  }

  const normalizedRole = user.role.toLowerCase();
  done(null, { id: user.id, role: normalizedRole });
});

passport.deserializeUser(async ({ id, role }, done) => {
  try {

    const validRoles = ['hr', 'manager', 'staff'];
    if (!validRoles.includes(role)) {
      return done(new Error('Invalid role'));
    }

    const result = await pool.query(
      `SELECT id, name, email, role, city, isverified FROM ${role} WHERE id = $1`,
      [id]
    );
    
    if (!result.rows[0]) {
      return done(new Error('User not found'));
    }

    const user = result.rows[0];

    if (user.role.toLowerCase() !== role) {
      return done(new Error('Role mismatch'));
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
});

};


const findUserByEmail = async (email) => {
  let result = await pool.query('SELECT * FROM manager WHERE email = $1', [email]);
  let user = result.rows[0];

  if (!user) {
    result = await pool.query('SELECT * FROM staff WHERE email = $1', [email]);
    user = result.rows[0];
  }

  if (!user) {
    result = await pool.query('SELECT * FROM Hr WHERE email = $1', [email]);
    user = result.rows[0];
  }

  return user;
};

// Find user by ID and role
const findUserByIdAndRole = async (id, role) => {
  const result = await pool.query(`SELECT * FROM ${role} WHERE id = $1`, [id]);
  return result.rows[0];
};

// Register a new user
const registerUser = async (firstName, lastName, email, password, role, address, state, zipcode, city) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const activationLink = `${process.env.REACT_APP_API_URL}/activate/${token}`;

  // Send activation email
  await sendActivationEmail(email, activationLink);

  const tableName = role === "hr" ? "hr" : role === "manager" ? "manager" : "staff";
  const name = `${firstName} ${lastName}`;
  const insertResult = await pool.query(
    `INSERT INTO ${tableName} (name, email, password, role, address, state, zipcode, city, isVerified) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [name, email, hashedPassword, role, address, state, zipcode, city, false]
  );

  return insertResult.rows[0];
};

module.exports = { initializePassport, registerUser };

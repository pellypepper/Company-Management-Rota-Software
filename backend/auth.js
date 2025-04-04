const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');




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





module.exports = { initializePassport };

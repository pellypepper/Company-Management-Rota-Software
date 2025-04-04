// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Session expired, please login again" });
    }
    next();
  };
  
  // Middleware to check the user's role
  const checkRole = (allowedRoles) => (req, res, next) => {
    const userRole = req?.user?.role?.toLowerCase();
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
  
  module.exports = { isAuthenticated, checkRole };
  
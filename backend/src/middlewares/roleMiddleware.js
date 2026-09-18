/**
 * Role-Based Access Control (RBAC) middleware
 * Restricts access to specific user roles
 * Example usage: authorize('admin'), authorize('department', 'admin')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before checking permissions.'
      });
    }

    const normalizedUserRole = (req.user.role || '').toLowerCase();
    const normalizedAllowedRoles = roles.map(r => r.toLowerCase());

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource.`
      });
    }

    next();
  };
};

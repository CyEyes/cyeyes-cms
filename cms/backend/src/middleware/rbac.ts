import { Request, Response, NextFunction } from 'express';

type Role = 'user' | 'content' | 'admin';

/**
 * Role hierarchy
 * admin > content > user
 */
const roleHierarchy: Record<Role, number> = {
  user: 1,
  content: 2,
  admin: 3,
};

/**
 * Check if user has required role
 */
const hasRole = (userRole: Role, requiredRole: Role): boolean => {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

/**
 * Require specific role(s)
 * Usage: requireRole('admin') or requireRole(['content', 'admin'])
 */
export const requireRole = (roles: Role | Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // User must be authenticated
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    // Check if user has any of the allowed roles
    const isAuthorized = allowedRoles.some((role) => hasRole(userRole, role));

    if (!isAuthorized) {
      res.status(403).json({
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: userRole,
      });
      return;
    }

    next();
  };
};

/**
 * Require admin role
 */
export const requireAdmin = requireRole('admin');

/**
 * Require content manager or admin role
 */
export const requireContentManager = requireRole(['content', 'admin']);

/**
 * Check if user owns the resource
 * Usage: requireOwnership((req) => req.params.userId)
 */
export const requireOwnership = (getUserId: (req: Request) => string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const resourceUserId = getUserId(req);

    // Admin can access any resource
    if (req.user.role === 'admin') {
      next();
      return;
    }

    // Check ownership
    if (req.user.userId !== resourceUserId) {
      res.status(403).json({ error: 'You can only access your own resources' });
      return;
    }

    next();
  };
};

/**
 * Require ownership or admin
 */
export const requireOwnershipOrAdmin = (getUserId: (req: Request) => string) => {
  return requireOwnership(getUserId);
};

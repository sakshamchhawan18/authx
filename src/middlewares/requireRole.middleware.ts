import { Request, Response, NextFunction } from "express";

export function requireRole(role: "ADMIN" | "USER") {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (user.role !== role) {
      return res.status(403).json({ success: false, message: "Forbidden: Insufficient role" });
    }

    next();
  };
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
function requireRole(role) {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        if (user.role !== role) {
            return res.status(403).json({ success: false, message: "Forbidden: Insufficient role" });
        }
        next();
    };
}

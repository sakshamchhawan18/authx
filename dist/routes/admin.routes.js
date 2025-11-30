"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const requireRole_middleware_1 = require("../middlewares/requireRole.middleware");
const prisma_1 = require("../config/prisma");
const router = (0, express_1.Router)();
/** ------------------------------------
 *  GET ALL USERS (ADMIN ONLY)
 *  ------------------------------------ */
router.get("/users", auth_middleware_1.authMiddleware, (0, requireRole_middleware_1.requireRole)("ADMIN"), async (req, anyRes) => {
    const users = await prisma_1.prisma.user.findMany({
        where: { deletedAt: null },
        select: { id: true, email: true, role: true, isVerified: true, createdAt: true }
    });
    return anyRes.json({ success: true, users });
});
/** ------------------------------------
 *  LIST ONLY ADMINS
 *  ------------------------------------ */
router.get("/users/admins", auth_middleware_1.authMiddleware, (0, requireRole_middleware_1.requireRole)("ADMIN"), async (req, res) => {
    const admins = await prisma_1.prisma.user.findMany({
        where: { role: "ADMIN", deletedAt: null }
    });
    return res.json({ success: true, admins });
});
/** ------------------------------------
 *  LIST ONLY USERS
 *  ------------------------------------ */
router.get("/users/regular", auth_middleware_1.authMiddleware, (0, requireRole_middleware_1.requireRole)("ADMIN"), async (req, res) => {
    const users = await prisma_1.prisma.user.findMany({
        where: { role: "USER", deletedAt: null }
    });
    return res.json({ success: true, users });
});
/** ------------------------------------
 *  UPDATE ROLE (PATCH /admin/user/:id/role)
 *  ------------------------------------ */
router.patch("/user/:id/role", auth_middleware_1.authMiddleware, (0, requireRole_middleware_1.requireRole)("ADMIN"), async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const adminId = req.user.id; // from JWT
    if (!["USER", "ADMIN"].includes(role)) {
        return res.status(400).json({ success: false, message: "Invalid role" });
    }
    const user = await prisma_1.prisma.user.findUnique({ where: { id } });
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    const updated = await prisma_1.prisma.user.update({
        where: { id },
        data: { role }
    });
    // Audit log entry
    await prisma_1.prisma.auditLog.create({
        data: {
            userId: id,
            action: "ROLE_UPDATE",
            oldValue: user.role,
            newValue: role,
            adminId: adminId
        }
    });
    return res.json({
        success: true,
        message: "Role updated successfully",
        user: { id: updated.id, email: updated.email, role: updated.role }
    });
});
/** ------------------------------------
 *  SOFT DELETE USER
 *  ------------------------------------ */
router.delete("/user/:id", auth_middleware_1.authMiddleware, (0, requireRole_middleware_1.requireRole)("ADMIN"), async (req, res) => {
    const { id } = req.params;
    const adminId = req.user.id;
    const user = await prisma_1.prisma.user.findUnique({ where: { id } });
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    await prisma_1.prisma.user.update({
        where: { id },
        data: { deletedAt: new Date() }
    });
    await prisma_1.prisma.auditLog.create({
        data: {
            userId: id,
            action: "SOFT_DELETE",
            oldValue: null,
            newValue: "deletedAt timestamp",
            adminId: adminId
        }
    });
    return res.json({ success: true, message: "User soft-deleted" });
});
exports.default = router;

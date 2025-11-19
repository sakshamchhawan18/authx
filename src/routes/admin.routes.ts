import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";
import { prisma } from "../config/prisma";

const router = Router();

/** ------------------------------------
 *  GET ALL USERS (ADMIN ONLY)
 *  ------------------------------------ */
router.get("/users", authMiddleware, requireRole("ADMIN"), async (req, anyRes) => {
  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    select: { id: true, email: true, role: true, isVerified: true, createdAt: true }
  });

  return anyRes.json({ success: true, users });
});

/** ------------------------------------
 *  LIST ONLY ADMINS
 *  ------------------------------------ */
router.get("/users/admins", authMiddleware, requireRole("ADMIN"), async (req, res) => {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN", deletedAt: null }
  });

  return res.json({ success: true, admins });
});

/** ------------------------------------
 *  LIST ONLY USERS
 *  ------------------------------------ */
router.get("/users/regular", authMiddleware, requireRole("ADMIN"), async (req, res) => {
  const users = await prisma.user.findMany({
    where: { role: "USER", deletedAt: null }
  });

  return res.json({ success: true, users });
});

/** ------------------------------------
 *  UPDATE ROLE (PATCH /admin/user/:id/role)
 *  ------------------------------------ */
router.patch(
  "/user/:id/role",
  authMiddleware,
  requireRole("ADMIN"),
  async (req: any, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const adminId = req.user.id; // from JWT

    if (!["USER", "ADMIN"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role }
    });

    // Audit log entry
    await prisma.auditLog.create({
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
  }
);

/** ------------------------------------
 *  SOFT DELETE USER
 *  ------------------------------------ */
router.delete(
  "/user/:id",
  authMiddleware,
  requireRole("ADMIN"),
  async (req: any, res) => {
    const { id } = req.params;
    const adminId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    await prisma.auditLog.create({
      data: {
        userId: id,
        action: "SOFT_DELETE",
        oldValue: null,
        newValue: "deletedAt timestamp",
        adminId: adminId

      }
    });

    return res.json({ success: true, message: "User soft-deleted" });
  }
);

export default router;

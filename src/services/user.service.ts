import { prisma } from "../config/prisma";

export async function updateUserRole(adminId: string, userId: string, role: "ADMIN" | "USER") {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw { status: 404, message: "User not found" };
  if (user.role === role) throw { status: 400, message: "User already has this role" };

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role }
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      adminId,
      userId,
      action: "ROLE_CHANGED",
      oldValue: user.role,
      newValue: role
    }
  });

  return updated;
}

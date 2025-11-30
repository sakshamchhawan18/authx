"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = updateUserRole;
const prisma_1 = require("../config/prisma");
async function updateUserRole(adminId, userId, role) {
    const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw { status: 404, message: "User not found" };
    if (user.role === role)
        throw { status: 400, message: "User already has this role" };
    const updated = await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { role }
    });
    // Audit log
    await prisma_1.prisma.auditLog.create({
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

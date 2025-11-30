"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const setupTest_1 = require("../setupTest");
const prisma_mock_1 = require("../utils/prisma.mock");
const bcrypt_1 = __importDefault(require("bcrypt"));
describe("Auth: Login", () => {
    it("should login successfully", async () => {
        prisma_mock_1.prismaMock.user.findUnique.mockResolvedValue({
            id: "123",
            email: "test@example.com",
            passwordHash: await bcrypt_1.default.hash("P@ssw0rd", 10),
            isVerified: true
        });
        const res = await setupTest_1.api.post("/api/auth/login").send({
            email: "test@example.com",
            password: "P@ssw0rd"
        });
        expect(res.status).toBe(200);
        expect(res.body.data.token).toBeDefined();
        expect(res.body.data.refreshToken).toBeDefined();
    });
    it("should reject invalid password", async () => {
        prisma_mock_1.prismaMock.user.findUnique.mockResolvedValue({
            id: "123",
            email: "test@example.com",
            passwordHash: await bcrypt_1.default.hash("otherpass", 10),
            isVerified: true
        });
        const res = await setupTest_1.api.post("/api/auth/login").send({
            email: "test@example.com",
            password: "wrongpass"
        });
        expect(res.status).toBe(401);
    });
});

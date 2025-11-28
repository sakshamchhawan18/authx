"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setupTest_1 = require("../setupTest");
const prisma_mock_1 = require("../utils/prisma.mock");
jest.mock("../../src/config/prisma", () => {
    const { prismaMock } = require("../utils/prisma.mock");
    return { prisma: prismaMock };
});
describe("Auth: Register", () => {
    it("should register a new user", async () => {
        prisma_mock_1.prismaMock.user.findUnique.mockResolvedValue(null);
        prisma_mock_1.prismaMock.user.create.mockResolvedValue({
            id: "123",
            email: "test@example.com",
            createdAt: new Date()
        });
        const res = await setupTest_1.api.post("/api/auth/register").send({
            email: "test@example.com",
            password: "P@ssw0rd"
        });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(prisma_mock_1.prismaMock.user.create).toHaveBeenCalled();
    });
    it("should not register an existing user", async () => {
        prisma_mock_1.prismaMock.user.findUnique.mockResolvedValue({ id: "123" });
        const res = await setupTest_1.api.post("/api/auth/register").send({
            email: "test@example.com",
            password: "P@ssw0rd"
        });
        expect(res.status).toBe(400);
    });
});

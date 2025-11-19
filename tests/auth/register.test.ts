import { api } from "../setupTest";
import { prismaMock } from "../utils/prisma.mock";

jest.mock("../../src/config/prisma", () => {
  const { prismaMock } = require("../utils/prisma.mock");
  return { prisma: prismaMock };
});


describe("Auth: Register", () => {
  it("should register a new user", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    prismaMock.user.create.mockResolvedValue({
      id: "123",
      email: "test@example.com",
      createdAt: new Date()
    });

    const res = await api.post("/api/auth/register").send({
      email: "test@example.com",
      password: "P@ssw0rd"
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(prismaMock.user.create).toHaveBeenCalled();
  });

  it("should not register an existing user", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "123" });

    const res = await api.post("/api/auth/register").send({
      email: "test@example.com",
      password: "P@ssw0rd"
    });

    expect(res.status).toBe(400);
  });
});

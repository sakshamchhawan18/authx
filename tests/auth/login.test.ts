import { api } from "../setupTest";
import { prismaMock } from "../utils/prisma.mock";
import bcrypt from "bcrypt";

describe("Auth: Login", () => {
  it("should login successfully", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "123",
      email: "test@example.com",
      passwordHash: await bcrypt.hash("P@ssw0rd", 10),
      isVerified: true
    });

    const res = await api.post("/api/auth/login").send({
      email: "test@example.com",
      password: "P@ssw0rd"
    });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  it("should reject invalid password", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "123",
      email: "test@example.com",
      passwordHash: await bcrypt.hash("otherpass", 10),
      isVerified: true
    });

    const res = await api.post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrongpass"
    });

    expect(res.status).toBe(401);
  });
});

import { api } from "../setupTest";
import { signAccessToken } from "../../src/utils/jwt";

describe("Protected route", () => {
  it("should work with valid token", async () => {
    const token = signAccessToken({
      id: "123",
      email: "test@example.com",
      role: "USER"        // required
    });

    const res = await api
      .get("/api/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("should deny access without token", async () => {
    const res = await api.get("/api/protected");

    expect(res.status).toBe(401);
  });
});

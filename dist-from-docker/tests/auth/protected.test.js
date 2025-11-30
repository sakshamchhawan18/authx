"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setupTest_1 = require("../setupTest");
const jwt_1 = require("../../src/utils/jwt");
describe("Protected route", () => {
    it("should work with valid token", async () => {
        const token = (0, jwt_1.signAccessToken)({
            id: "123",
            email: "test@example.com",
            role: "USER" // required
        });
        const res = await setupTest_1.api
            .get("/api/protected")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
    });
    it("should deny access without token", async () => {
        const res = await setupTest_1.api.get("/api/protected");
        expect(res.status).toBe(401);
    });
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const prisma_1 = require("./config/prisma");
const PORT = Number(process.env.PORT || 5001);
const server = app_1.default.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
    prisma_1.prisma.$connect()
        .then(() => console.log("Connected to Postgres"))
        .catch((err) => {
        console.error("Prisma connect error:", err);
        process.exit(1);
    });
});
process.on("SIGINT", async () => {
    await prisma_1.prisma.$disconnect();
    server.close(() => process.exit(0));
});

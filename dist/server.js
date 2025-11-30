"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== "production") {
    console.log("Loading .env (development mode)");
    require("dotenv").config();
}
const app_1 = __importDefault(require("./app"));
const prisma_1 = require("./config/prisma");
const PORT = Number(process.env.PORT) || 5001;
async function start() {
    try {
        await prisma_1.prisma.$connect();
        console.log("Connected to Postgres");
        const server = app_1.default.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
        // graceful shutdown
        process.on("SIGINT", async () => {
            console.log("\nShutting down...");
            await prisma_1.prisma.$disconnect();
            server.close(() => process.exit(0));
        });
    }
    catch (err) {
        console.error("Failed to start:", err);
        process.exit(1);
    }
}
start();

if (process.env.NODE_ENV !== "production") {
  console.log("Loading .env (development mode)");
  require("dotenv").config();
}



import app from "./app";
import { prisma } from "./config/prisma";



const PORT = Number(process.env.PORT) || 5001;



async function start() {
  try {
    await prisma.$connect();
    console.log("Connected to Postgres");

    const server = app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });

    // graceful shutdown
    process.on("SIGINT", async () => {
      console.log("\nShutting down...");
      await prisma.$disconnect();
      server.close(() => process.exit(0));
    });

  } catch (err: unknown) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
}

start();
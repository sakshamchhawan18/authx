import "dotenv/config";
import app from "./app";
import { prisma } from "./config/prisma";

const PORT = Number(process.env.PORT || 5001);

const server = app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);

  prisma.$connect()
    .then(() => console.log("Connected to Postgres"))
    .catch((err) => {
      console.error("Prisma connect error:", err);
      process.exit(1);
    });
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});

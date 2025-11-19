import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import adminRoutes from "./routes/admin.routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api", routes);

app.get("/", (req, res) => res.json({ ok: true, message: "Auth service" }));

app.use(errorHandler);

app.use("/api/admin", adminRoutes);
export default app;

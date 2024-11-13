import express from "express";
import mongoose from "mongoose";
import http from "http";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import studentRoutes from "./presentation/routes/StudentRoutes";
import tutorRoutes from "./presentation/routes/TutorRoutes";
import adminRoutes from "./presentation/routes/AdminRoutes";
import messageRoute from "./presentation/routes/MessageRoutes";
import { errorHandler } from "./infrastructure/middlewares/ErrorHandler";
import { CronScheduler } from "./infrastructure/services/CronScheduler";
import assessmentRoute from "./presentation/routes/AssessmentRoutes";
import { initializeSocket } from "./infrastructure/config/socket";

dotenv.config();

const app = express();
const server = http.createServer(app);

initializeSocket(server);

app.use("/api/students/webhook", express.raw({ type: "application/json" }));

app.use((req, res, next) => {
  if (req.originalUrl === "/api/students/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

const corsOptions = {
  origin: `${process.env.CORSURL}`,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/students", studentRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", messageRoute);
app.use("/api/assessment", assessmentRoute);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
      CronScheduler.initialize();
    });
  })
  .catch((error) => console.error("MongoDB connection error:", error));

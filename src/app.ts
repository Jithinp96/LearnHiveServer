import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from 'cors';
import morgan from "morgan";

import studentRoutes from "./presentation/routes/StudentRoutes";
import tutorRoutes from "./presentation/routes/TutorRoutes";
import adminRoutes from "./presentation/routes/AdminRoutes";
import { errorHandler } from "./infrastructure/middlewares/ErrorHandler";

dotenv.config();

const app = express();
// app.use(express.json());

app.use('/api/students/webhook', express.raw({ type: 'application/json' }));

app.use((req, res, next) => {
    if (req.originalUrl === '/api/students/webhook') {
        next();
    } else {
        express.json()(req, res, next);
    }
});

const corsOptions = {
  origin: `${process.env.CORSURL}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(morgan('dev'));

app.use("/api/students", studentRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(`${process.env.PORT}`, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch((error) => console.error("MongoDB connection error: ", error));
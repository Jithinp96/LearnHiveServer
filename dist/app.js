"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const StudentRoutes_1 = __importDefault(require("./presentation/routes/StudentRoutes"));
const TutorRoutes_1 = __importDefault(require("./presentation/routes/TutorRoutes"));
const AdminRoutes_1 = __importDefault(require("./presentation/routes/AdminRoutes"));
const MessageRoutes_1 = __importDefault(require("./presentation/routes/MessageRoutes"));
const ErrorHandler_1 = require("./infrastructure/middlewares/ErrorHandler");
const CronScheduler_1 = require("./infrastructure/services/CronScheduler");
const AssessmentRoutes_1 = __importDefault(require("./presentation/routes/AssessmentRoutes"));
const socket_1 = require("./infrastructure/config/socket");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
(0, socket_1.initializeSocket)(server);
app.use("/api/students/webhook", express_1.default.raw({ type: "application/json" }));
app.use((req, res, next) => {
    if (req.originalUrl === "/api/students/webhook") {
        next();
    }
    else {
        express_1.default.json()(req, res, next);
    }
});
const corsOptions = {
    origin: `${process.env.CORSURL}`,
    // origin: 'https://learnhive.vercel.app',
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use("/api/students", StudentRoutes_1.default);
app.use("/api/tutor", TutorRoutes_1.default);
app.use("/api/admin", AdminRoutes_1.default);
app.use("/api/chat", MessageRoutes_1.default);
app.use("/api/assessment", AssessmentRoutes_1.default);
app.use(ErrorHandler_1.errorHandler);
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    server.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
        CronScheduler_1.CronScheduler.initialize();
    });
})
    .catch((error) => console.error("MongoDB connection error:", error));

import express from 'express';
import connectDB from './infrastructure/database/MongoDBConfig';
import studentRoutes from './interfaces/routes/StudentRoutes';
import cors from 'cors';

const app = express();

// MongoDB Connection
connectDB();

// Middleware
app.use(express.json());

app.use(cors({ origin: 'http://localhost:5173' }));

// Routes
app.use('/api/students', studentRoutes);

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
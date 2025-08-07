import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import DefectRateRoutes from "./routes/DefectRateRoutes.js";
import MachineDownTimeRoutes from "./routes/MachineDownTimeRoutes.js";
import ProductionRoutes from "./routes/ProductionRoutes.js";
import ReportRoutes from "./routes/ReportRoutes.js";
import ShiftwiseRoutes from "./routes/ShiftwiseRoutes.js";

const app = express();
config(); // Load .env file
connectDB(); // Connect DB

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", ProductionRoutes);
app.use("/api/users",MachineDownTimeRoutes);
app.use("/api/users",DefectRateRoutes);
app.use("/api/users",ShiftwiseRoutes);
app.use("/auth/users",AuthRoutes);
app.use("/report/users",ReportRoutes);

// Error Middleware
app.use(errorMiddleware);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

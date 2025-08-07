import express from "express";
import { exportShiftwiseCSV, exportShiftwisePDF } from "../controllers/reportControllers.js";


const router = express.Router();

router.get("/export/csv",exportShiftwiseCSV);
router.get("/export/pdf",exportShiftwisePDF);

export default router;
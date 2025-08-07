import express from "express";
import { addDefectRateLog, calculateDefectRate } from "../controllers/DefectRateController.js";

const router = express.Router();

router.get("/createdefectrate",addDefectRateLog)
router.get("/defectrate",calculateDefectRate)

export default router;

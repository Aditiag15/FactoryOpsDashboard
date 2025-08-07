import express from "express";
import { getShiftwisePerformance } from "../controllers/ShiftwiseController.js";

const router = express.Router();

router.get("/shift",getShiftwisePerformance)

export default router;

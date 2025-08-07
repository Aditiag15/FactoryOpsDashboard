import express from "express";
import { addProduction, getAllLogs, getProductionSummary } from "../controllers/ProductionController.js";

const router = express.Router();


//PRODUCTION
router.post("/create", addProduction);
router.get("/getAlllogs",getAllLogs);
router.get("/getProductionSummary",getProductionSummary);

export default router;

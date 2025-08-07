import express from "express";
import { addMachineDowmTime, getAllDownTimeLogs, getDownTimeSummary } from "../controllers/MachineDownTimeController.js";

const router = express.Router();

router.post("/createDownTime",addMachineDowmTime);
router.get("/getAllDownTime",getAllDownTimeLogs);
router.get("/getDownTimeSummary",getDownTimeSummary);


export default router;
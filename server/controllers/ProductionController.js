import { Production } from "../models/Production.js";

//PRODUCTION
export const addProduction = async (req, res, next) => {
  try {
    console.log("Incoming request body:", req.body);

    // Step 1: Handle completely empty body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const { machineId, line, shift, unitsProduced, date, operator } = req.body;
    if (!machineId || !line || !shift || !unitsProduced || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const log = await Production.create({
      machineId,
      line,
      shift,
      unitsProduced,
      date: new Date(date),
      operator
    });

    res.status(201).json({ message: "Log added", data: log });
  } catch (err) {
    next(err);
  }
};

export const getAllLogs = async(req,res,next)=>{
    try{
      const logs = await Production.find().populate("machineId")
      res.json(logs);
    }catch(err){
      next(err);
    }
}

export const getProductionSummary = async (req, res, next)=>{
  try {
    const { from, to,range } = req.query;  //date range filter
     const dateGroup =
    range === "monthly"
      ? { year: { $year: "$date" }, month: { $month: "$date" } }
      : range === "weekly"
      ? { year: { $year: "$date" }, week: { $week: "$date" } }
      : { year: { $year: "$date" }, month: { $month: "$date" }, day: { $dayOfMonth: "$date" } };
    const logs = await Production.aggregate([
      {
        //filter by date
        $match: {
          date: {
            $gte: new Date(from),
            $lte: new Date(to),
          }
        }
      },
      //summarize the data
      {
        $group: {
          _id: {
           ...dateGroup,
            shift:"$shift",
            line: "$line",
          },
          totalUnits:{$sum:"$unitsProduced"},
          logs:{$push:"$$ROOT"}, //appends value to an array
        }
      },
      {
        $sort: {"_id.year": 1, "_id.month": 1, "_id.day": 1}
      }
    ]);
    res.json(logs);
  }catch(err){
    next(err);
  }
}




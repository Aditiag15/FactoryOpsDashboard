// import { DefectRate } from "../models/DefectRate.js";

// //DEFECT RATE

// export const addDefectRateLog = async (req, res, next) => {
//     try {
//         console.log("Incoming request body:", req.body);

//         // Step 1: Handle completely empty body
//         if (!req.body || Object.keys(req.body).length === 0) {
//             return res.status(400).json({ message: "Request body is empty" });
//         }

//         const { machineId, line, shift, unitsProduced, defectiveUnits, date, reason} = req.body;

//         if (!machineId || !line || !shift || !unitsProduced || !defectiveUnits || !date || !reason) {
//             return res.status(400).json({ message: "Missing required fields" });
//         }

//         const log = await DefectRate.create({
//             machineId,
//             line,
//             shift,
//             reason,
//             unitsProduced,
//             defecTiveUnits,
//             date: new Date(date),
//         });
//         res.status(201).json({ message: "Defect Log added", data: log });
//     } catch (err) {
//         next(err);
//     }
// };


// export const calculateDefectRate = async (req, res, next) => {
//     try {


//         // const { from, to } = req.query;
//         const logs = await DefectRate.aggregate([
//             // {
//             //     //filter the datra
//             //     $match: {
//             //         date: {
//             //             $gte: new Date(from),
//             //             $lte: new Date(to),
//             //         }
//             //     }
//             // },
//             {
//                 //summarize the data
//                 $group: {
//                     _id: {shift:"$shift",defectType:"$defectType"},
//                     totalUnits: { $sum: "$unitsProduced" },
//                     defectiveUnits: { $sum: "$defectiveUnits" },
//                 }
//             },
//             {
//                 $project: {
//                     shift: "$_id",
//                     _id: 0,
//                     totalUnits: 1,
//                     defectiveUnits: 1,
//                     defectRate: {
//                         $cond: {
//                             if: { $eq: ["$totalUnits", 0] },
//                             then: 0,
//                             else: {
//                                 $multiply: [
//                                     { $divide: ["$defectiveUnits", "$totalUnits"] }, 100
//                                 ]
//                             }
//                         }
//                     }
//                 }
//             }

//         ])
//         res.json(logs);
//     } catch (err) {
//         next(err);
//     }
// }

import { DefectRate } from "../models/DefectRate.js";

//DEFECT RATE

export const addDefectRateLog = async (req, res, next) => {
    try {
        console.log("Incoming request body:", req.body);

        // Step 1: Handle completely empty body
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Request body is empty" });
        }

        const { machineId, line, shift, unitsProduced, defectiveUnits, date, reason ,defectType} = req.body;

        if (!machineId || !line || !shift || !unitsProduced || !defectiveUnits || !date || !reason || !defecttype) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const log = await DefectRate.create({
            machineId,
            line,
            shift,
            reason,
            unitsProduced,
            defecTiveUnits,
            defecttype,
            date: new Date(date),
        });
        res.status(201).json({ message: "Defect Log added", data: log });
    } catch (err) {
        next(err);
    }
};


export const calculateDefectRate = async (req, res, next) => {
    try {


        // const { from, to } = req.query;
        const logs = await DefectRate.aggregate([
            // {
            //     //filter the datra
            //     $match: {
            //         date: {
            //             $gte: new Date(from),
            //             $lte: new Date(to),
            //         }
            //     }
            // },
            {
                //summarize the data
                $group: {
                    _id: "$shift",
                    totalUnits: { $sum: "$unitsProduced" },
                    defectiveUnits: { $sum: "$defectiveUnits" },
                }
            },
            // {
            //     $project: {
            //         shift: "$_id",
            //         _id: 0, //removes the field
            //         totalUnits: 1,      //include this field as-is
            //         defectiveUnits: 1,  //include this field as-is
            //         defectRate: {
            //             $multiply: [
            //                 { $divide: ["$defectiveUnits", "$totalUnits"] }, 100,
            //             ]
            //         }
            //     }
            // }
            {
                $project: {
                    shift: "$_id",
                    _id: 0,
                    totalUnits: 1,
                    defectiveUnits: 1,
                    defectRate: {
                        $cond: {
                            if: { $eq: ["$totalUnits", 0] },
                            then: 0,
                            else: {
                                $multiply: [
                                    { $divide: ["$defectiveUnits", "$totalUnits"] }, 100
                                ]
                            }
                        }
                    }
                }
            }

        ])
        res.json(logs);
    } catch (err) {
        next(err);
    }
}


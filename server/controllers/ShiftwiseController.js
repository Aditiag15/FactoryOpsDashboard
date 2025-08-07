import { DefectRate } from "../models/DefectRate.js";
import { MachineDownTime } from "../models/MachineDownTime.js";
import { Production } from "../models/Production.js";


export const getShiftwisePerformance = async (req, res, next) => {

    const { from, to } = req.query;

    const shifts = ["Morning", "Evening", "Night"];
    const performance = [];
    for (const shift of shifts) {
        const production = await Production.aggregate([
            {
                $match: {
                    shift,
                    date: {
                        $gte: new Date(from),
                        $lte: new Date(to),
                    }
                }
            },

            {
                $group: {
                    _id: null,
                    totalUnits: { $sum: "$unitsProduced" }
                }
            }
        ])


        const downtime = await MachineDownTime.aggregate([
            {
                $match: {
                    shift,
                    startTime: {
                        $gte: new Date(from),
                        $lte: new Date(to),
                    }
                }
            },

            {
                $group: {
                    _id: null,
                    totalDownTime: { $sum: "$duration" }
                }
            }
        ])

        const defect = await DefectRate.aggregate([
            {
                $match: {
                    shift,
                    date: {
                        $gte: new Date(from),
                        $lte: new Date(to),
                    }
                }
            },

            {
                $group: {
                    _id: null,
                    totalDefects: { $sum: "$defectiveUnits" }
                }
            }

        ])


        performance.push({
            shift,
            unitsProduced: production[0]?.totalUnits || 0,
            downtime: downtime[0]?.totalDownTime || 0,
            defectiveUnits: defect[0]?.totalDefects || 0,
        });
    }

    res.json({performance });
}


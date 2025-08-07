import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import { DefectRate } from "../models/DefectRate.js";
import { MachineDownTime } from "../models/MachineDownTime.js";
import { Production } from "../models/Production.js";

export const exportShiftwiseCSV = async (req, res) => {

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

        const defects = await DefectRate.aggregate([
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
            defectiveUnits: defects[0]?.totalDefects || 0,
        });
    }


    const parser = new Parser({ fields: ["shift", "unitsProduced", "downtime", "defects"] });
    const csv = parser.parse(performance);
    res.header("Content-Type", "text/csv");
    res.attachment("shiftwiseperformance.csv");
    return res.send(csv);
}


export const exportShiftwisePDF = async (req, res) => {

    const { from, to } = req.query;

    const shifts = ["Morning", "Evening", "Night"];

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=shiftwise_performance.pdf");
    doc.pipe(res);

    doc.fontSize(18).text("Shift-wise Performance Report", { align: "center" });
    doc.moveDown();

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

        const defects = await DefectRate.aggregate([
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

        ]);



        doc.fontSize(14).text(
            `Shift: ${shift}\nUnits Produced: ${production[0]?.totalUnits || 0}\nDowntime: ${downtime[0]?.totalDownTime || 0}\nDefects: ${defects[0]?.totalDefects || 0}`
        );
        doc.moveDown();
    }

    doc.end();
}


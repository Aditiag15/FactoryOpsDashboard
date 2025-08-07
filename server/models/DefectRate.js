import mongoose from "mongoose";
import { Machine } from "./Machine.js";

console.log(Machine.modelName);

const defectRateSchema = new mongoose.Schema({
    machineId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Machine",
    },
    line:{
        type:String,
        required:true,
    },
    shift:{
        type:String,
        enum:["Morning","Evening","Night"],
        required:true,
    },
    unitsProduced:{
        type:Number,
        required:true,
    },
    defectiveUnits:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        required:true,
    },
});

export const DefectRate =mongoose.model("DefectRate",defectRateSchema);
import mongoose from "mongoose";
import { Machine } from "./Machine.js";

console.log(Machine.modelName);
const machineDownTimeSchema = new mongoose.Schema({
    machineId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Machine",
        required:true,
    },
    startTime:{
        type: Date,
        required: true,
    },
    endTime:{
        type:Date,
        required: true,
    },
    date:{
        type:Date,
    },
    duration:{
        type:Number,
        required: true,
    },
    shift:{
        type:String,
        enum:["Morning","Evening","Night"],
        required:true,
    },
    operator:{
        type:String,
    },
    createdAt:{
        type:Date,
        duration:Date.now(),
    },
    reason:{
        type:String,
        enum:["Maintenance","Breakdown","Power Failure","Operator Absent","Tool Change","Material Unavailable","Other"],
        required:true,
    },
});
export const MachineDownTime =mongoose.model("MachineDownTime",machineDownTimeSchema);
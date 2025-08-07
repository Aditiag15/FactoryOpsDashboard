import mongoose from "mongoose";
import { Machine } from "./Machine.js";


console.log(Machine.modelName)
const productionSchema = new mongoose.Schema({
    machineId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Machine",
        required: true,
    },
    line:{
        type:String,
        required:true,
    },
    shift:{
        type: String,
        enum:["Morning","Evening","Night"],
        required:true,
    },
    unitsProduced:{
        type:Number,
        required:true,
        min:0,
    },
    date:{
        type:Date,
        required:true,
    },
    operator:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }

});
export const Production = mongoose.model("Production",productionSchema);
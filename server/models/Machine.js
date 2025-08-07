import mongoose from "mongoose";

const machineSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    machineCode:{
        type:String,
        required:true,
        unique:true,
    },
    status:{
        type:String,
        enum:["running", "stopped", "maintenance"],
        required:true,
    },
    location:String,
});

export const Machine=mongoose.model("Machine",machineSchema);
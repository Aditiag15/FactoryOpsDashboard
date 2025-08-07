import { MachineDownTime } from "../models/MachineDownTime.js";


//MACHINE
export const addMachineDowmTime = async(req,res,next)=>{
  try{
    
    const {machineId,startTime,endTime,duration,shift,reason,operator} = req.body;

    if(!machineId|| !startTime|| !endTime|| !shift|| !reason){
      return res.status(400).json({message:"Missingrequired fields"});
    }

    const calcduration=(new Date(endTime).getTime() - new Date(startTime).getTime())/60000;

    const log = await MachineDownTime.create({
      machineId, 
      startTime:new Date(startTime),
      endTime:new Date(endTime),
      duration:Math.round(calcduration),
      shift,
      operator,
      reason,
    });
    res.status(201).json({message:"Downtime Logged",data:log});
  }catch(err){
    next(err);
  }
}

export const getAllDownTimeLogs = async(req,res,next)=>{
  try{
    const logs = await MachineDownTime.find().populate("machineId");
    res.json(logs);
  }catch(err){
    next(err);
  }
}


export const getDownTimeSummary = async(req,res,next)=>{
  try{
    const {from,to}=req.query;
    const logs = await MachineDownTime.aggregate([
      {
        $match:{
          startTime:{
            $gte:new Date(from),
            $lte:new Date(to),
          }
        }
      },
      {
        $group:{
          _id:{
            machine:"$machineId",
            reason:"$reason",
          },
          totalDuration:{$sum:"$duration"},  
          logs:{$push:"$$ROOT"},
        }
      },
      {
        $sort:{totalDuration:1},
      }
    ]);
    res.json(logs);
  }catch(err){
    next(err);
  }
}

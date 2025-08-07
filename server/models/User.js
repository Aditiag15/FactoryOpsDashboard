import mongoose from "mongoose";

export const userSchema =({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default: "Manager",
        enum:["Admin","Manager"]
    }
});

export const User =mongoose.model("User",userSchema);
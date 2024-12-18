import mongoose from "mongoose";
import { convertToIST } from "../Utils/Date-Time-Utils/utils.js";
const leaveSchema = mongoose.Schema({
    doctor:{
        type:String,
        required:true
    },
    today:{
        type:Date,
        default: convertToIST(new Date())
    },
    leave:{
        type:Date,
        required:true
    }
})

const Leave = mongoose.model('Leave',leaveSchema)
export default Leave;
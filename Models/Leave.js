import mongoose from "mongoose";
const leaveSchema = mongoose.Schema({
    doctor:{
        type:String,
        required:true
    },
    today:{
        type:Date,
        default: Date.now(330 * 60 * 1000)
    },
    leave:{
        type:Date,
        required:true
    }
})

const Leave = mongoose.model('Leave',leaveSchema)
export default Leave;
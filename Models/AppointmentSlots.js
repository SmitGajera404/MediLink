import mongoose from "mongoose";

const AppointmentmentSlotsSchema = mongoose.Schema({
    doctor:{
        type:String,
        required:true
    },
    appointment:{
        type:String,
    },
    status:{
        type: String,
        enum: ["available", "completed", "booked", "canceled"],
        default: "available"
    },
    slotTime:{
        type:Date,
        required: true
    },
},{timestamps:true})

const AppointmentSlot = mongoose.model('AppointmentSlot',AppointmentmentSlotsSchema);
export default AppointmentSlot
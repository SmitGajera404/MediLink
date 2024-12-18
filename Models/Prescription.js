import mongoose from "mongoose";
import { convertToIST } from "../Utils/Date-Time-Utils/utils";

const PrescriptionSchema = mongoose.Schema({
    patient:{
        type:String,
        required:true
    },
    doctor:{
        type:String,
        required:true
    },
    appointment:{
        type:String,
    },
    medicines:{
        type: Array,
        required:true
    },
    prescriptionDate:{
        type:Date,
        default: convertToIST(new Date())
    }
})

const Prescription = mongoose.model('Prescription', PrescriptionSchema)
export default Prescription;
import mongoose from "mongoose";
const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    patient: {
      type: String,
      required: true,
    },
    doctor: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: String, 
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'canceled', 'missed'],
      default: 'scheduled',
    },
    reason: {
      type: String, 
      maxlength: 500,
    },
    notes: {
      type: String, 
    },
    payment: {
      amount: {
        type: Number, 
        required: true,
        default: 0,
      },
      type:{
        type: String,
        enum: ['cash', 'online'],
        default: 'cash'
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment

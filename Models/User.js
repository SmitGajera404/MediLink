import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the User schema
export const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, 
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/, 'Please fill a valid email address'],
    },
    role: {
      type: String,
      enum: ['admin', 'doctor', 'nurse', 'patient', 'receptionist'],
      default: 'patient',
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    address: {
      type: String,
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    profilePicture: {
      type: String, // Store image URL or path for profile picture
    },
    department: {
      type: String, // For doctors, this can specify their department (e.g., cardiology, neurology)
    },
    medicalHistory: {
      type: String, // Only for patients
    },
    assignedDoctor: {
      type: Schema.Types.ObjectId,
      ref: 'User', // This can link to the assigned doctor for patients
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

const User = mongoose.model('User', userSchema);

export default User;

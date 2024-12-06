import Appointment from "../../Models/Appointment.js"

export const createAppointment = async(req ,res) => {
    try{
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        res.status(201).json({message : "Appointment created successfully" , data : newAppointment});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create appointment", error: error.message });
    }
}
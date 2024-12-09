import Appointment from "../../Models/Appointment.js"
import { redisInstance } from "../../Database/Redis/instance.js";
import {parse} from 'date-fns';
import moment from "moment";

export const createAppointment = async(req ,res) => {
    try{        
        const newAppointment = new Appointment({...req.body});
        await newAppointment.save();
        res.status(201).json({message : "Appointment created successfully" , data : newAppointment});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create appointment", error: error.message });
    }
}

export const getAppointmentByDocter = async(req, res) => {
    const user = req.user;
    const date = req.query.date;

    try {
        const appointments = await Appointment.find({
            $and: [
                { doctor: user.username }, 
                { appointmentDate: date } 
            ]
        });
        await redisInstance.hset(`appointment:docter:${req.user.username}:${date}`,{data: JSON.stringify(appointments)});
        res.status(200).json({ message: "Appointments fetched successfully", data: appointments });
    } catch (error) {
        res.status(500).json({ message: "Some error occurred while fetching appointments", error: error.message });
    }
}

export const updateAppointmentStatus = async(req, res) => {
    try{
        const appointmentId = req.params.id;
        const updateStatus = req.params.update;
        console.log(updateStatus);
        
        const update = await Appointment.updateOne({_id:appointmentId},{$set:{status: updateStatus}});
        if(update.modifiedCount === 1){
            res.status(201).json({message: "Appointment updated successfully!"});
        } else {
            res.status(404).json({message:"Appointment not found!!"});
        }
    } catch (error) {
        res.status(500).json({message: "Some error occured on server", error: error.message});
    }
}


export const getAppointmentByPatient = async (req, res) => {
    const user = req.user;
    try {
        const appointments = await Appointment.find(
                { patient: user.username } 
        );
        if(appointments.length > 0){
            await redisInstance.hset(`appointment:patient:${req.user.username}`,{data: JSON.stringify(appointments)});
        }
        res.status(200).json({ message: "Appointments fetched successfully", data: appointments });
    } catch (error) {
        res.status(500).json({ message: "Some error occurred while fetching appointments", error: error.message });
    }
}
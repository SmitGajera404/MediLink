import Appointment from "../../Models/Appointment.js"
import { redisInstance } from "../../Database/Redis/instance.js";
import AppointmentSlot from "../../Models/AppointmentSlots.js";
import User from "../../Models/User.js";
import Leave from "../../Models/Leave.js";
import { convertToIST } from "../../Utils/Date-Time-Utils/utils.js";

const getLatestAppointmentSlotForLeave = (doctor, latestSlot) => {
    try {
        let nextSlotTime, istTime;
        if(latestSlot < Date.now()){
            latestSlot = null;
        }
        console.log(latestSlot);
        
        if (latestSlot) {
            nextSlotTime = new Date(latestSlot);
            nextSlotTime.setMinutes(nextSlotTime.getMinutes() + 30);
            istTime = nextSlotTime
        } else {
            nextSlotTime = new Date();
            nextSlotTime.setMinutes(nextSlotTime.getMinutes() + 15);
            const istOffset = 330; // IST is UTC+5:30
            const utcTime = nextSlotTime.getTime();
            istTime = new Date(utcTime + istOffset * 60 * 1000);
        }
        console.log(istTime);

        const MIN_HOUR = 15;
        const MAX_HOUR = 19;
        const hour = istTime.getHours();

        if (hour <= 9) {
            istTime.setHours(MIN_HOUR, 0, 0, 0);
            console.log(istTime);

        } else if (hour >= 25) {
            istTime.setDate(istTime.getDate() + 1);
            istTime.setHours(MIN_HOUR, 0, 0, 0);
        }

        return istTime
    } catch (error) {
        return Date.now()
    }
}

const getLatestAppointmentSlot = async (doctor) => { 
    try {
        let latestSlot = await AppointmentSlot.findOne({ doctor: doctor }).sort({
            slotTime: -1,
        });
        if(latestSlot && latestSlot.slotTime < convertToIST(new Date())){
            latestSlot = null;
        }
        let nextSlotTime, istTime;
        if (latestSlot) {
            nextSlotTime = new Date(latestSlot.slotTime);
            nextSlotTime.setMinutes(nextSlotTime.getMinutes() + 30);
            istTime = nextSlotTime
        } else {
            nextSlotTime = new Date();
            nextSlotTime.setMinutes(nextSlotTime.getMinutes() + 15);
            const istOffset = 330; // IST is UTC+5:30
            const utcTime = nextSlotTime.getTime();
            istTime = new Date(utcTime + istOffset * 60 * 1000);
        }
        const MIN_HOUR_SET = 15;
        const hour = istTime.getHours();
        console.log(hour);
        if (hour <= 9) {
            istTime.setHours(MIN_HOUR_SET, 0, 0, 0);
        } else if (hour >= 25) {
            istTime.setDate(istTime.getDate() + 1);
            istTime.setHours(MIN_HOUR_SET, 0, 0, 0);
        }
        return istTime
    } catch (error) {
        console.log(error);   
        return Date.now()
    }
}


export const getLatestSlot = async (req, res) => {
    const { doctor } = req.query;
    try {
        const istTime = await getLatestAppointmentSlot(doctor);
        const slot = await checkDoctorAvailabilityAndProvideLatestSlot(istTime, doctor)
        res.status(200).json({ message: "Time slot fetched successfully!", data: slot ? slot : istTime });
    } catch (error) {
        res.status(500).json({ message: "Some error occurred while fetching the latest slot", error: error.message });
    }
};



const checkDoctorAvailabilityAndProvideLatestSlot = async (istTime, doctor) => {
    try {
        const isDocotorAvailable = await User.findOne({ username: doctor, available: false })
        console.log("Hello");
        
        console.log(isDocotorAvailable, istTime);
        if (isDocotorAvailable) {
            const leave = await Leave.find({ doctor: doctor, leave: { $gte: Date.now(330 * 60 * 1000) } });
            console.log(leave);
            if (leave.length > 0) {
                if (istTime < leave[leave.length - 1].leave && istTime > leave[leave.length - 1].today) {
                    const slot = getLatestAppointmentSlotForLeave(doctor, leave[leave.length - 1].leave);
                    console.log("slot: " + slot);
                    return slot;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const createAppointment = async (req, res) => {
    try {
        const istTime = await getLatestAppointmentSlot(req.body.doctor);
        const doctorOnLeaveAtThisTime = await checkDoctorAvailabilityAndProvideLatestSlot(istTime, req.body.doctor);
        console.log(doctorOnLeaveAtThisTime);
        const newAppointment = new Appointment({ ...req.body, appointmentDate: doctorOnLeaveAtThisTime ? doctorOnLeaveAtThisTime : istTime });
        const newAppointmentSlot = new AppointmentSlot({ doctor: req.body.doctor, appointment: newAppointment._id, status: "booked", slotTime: doctorOnLeaveAtThisTime ? doctorOnLeaveAtThisTime : istTime });
        await newAppointmentSlot.save();
        await newAppointment.save();
        res.status(201).json({ message: "Appointment created successfully", data: { newAppointment, newAppointmentSlot } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create appointment", error: error.message });
    }
}

export const getAppointmentByDoctor = async (req, res) => {
    const user = req.user; // Assuming middleware sets req.user
    const { date } = req.query; // Destructuring date from query params

    // Validate `date` query parameter
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ message: "Invalid or missing date. Expected format: yyyy-mm-dd." });
    }

    try {
        let appointmentIds = []
        let startTime = new Date();
        startTime.setHours(0, 0, 0, 0); // Start of the day: 12:00 AM

        let endTime = new Date();
        endTime.setHours(23, 59, 59, 999); // End of the day: 11:59:59 PM

        const abc = await AppointmentSlot.find({
            doctor: user.username,
            slotTime: { $gte: startTime, $lte: endTime },
        }, { appointment: 1, _id: 0 });

        abc.forEach(element => {
            appointmentIds.push(element.appointment)
        });
        const appointments = await Appointment.find({
            _id: { $in: appointmentIds }
        });
        console.log(appointments);

        // Cache the result in Redis for quicker subsequent retrievals
        const cacheKey = `appointment:doctor:${user.username}:${date}`;
        await redisInstance.hset(cacheKey, "data", JSON.stringify(appointments));

        // Send response
        res.status(200).json({
            message: "Appointments fetched successfully.",
            data: appointments,
        });
    } catch (error) {
        // Catch and return errors
        res.status(500).json({
            message: "Some error occurred while fetching appointments.",
            error: error.message,
        });
    }
};


export const updateAppointmentStatus = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const updateStatus = req.params.update;
        console.log(updateStatus);

        const update = await Appointment.updateOne({ _id: appointmentId }, { $set: { status: updateStatus } });
        if (update.modifiedCount === 1) {
            res.status(201).json({ message: "Appointment updated successfully!" });
        } else {
            res.status(404).json({ message: "Appointment not found!!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Some error occured on server", error: error.message });
    }
}


export const getAppointmentByPatient = async (req, res) => {
    const user = req.user;
    try {
        const appointments = await Appointment.find(
            { patient: user.username }
        );
        if (appointments.length > 0) {
            await redisInstance.hset(`appointment:patient:${req.user.username}`, { data: JSON.stringify(appointments) });
        }
        res.status(200).json({ message: "Appointments fetched successfully", data: appointments });
    } catch (error) {
        res.status(500).json({ message: "Some error occurred while fetching appointments", error: error.message });
    }
}
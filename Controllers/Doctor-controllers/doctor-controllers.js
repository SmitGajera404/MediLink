import Appointment from "../../Models/Appointment.js";
import AppointmentSlot from "../../Models/AppointmentSlots.js";
import Leave from "../../Models/Leave.js";
import User from "../../Models/User.js"
import { convertToIST } from "../../Utils/Date-Time-Utils/utils.js";
import { checkDoctorAvailabilityAndProvideLatestSlot, getLatestAppointmentSlot } from "../Appointment-controllers/appointment-controller.js";


export const declareLeave = async (req, res) => {
    try {
        await User.updateOne({ username: req.user.username }, { $set: { available: false } });
        const newLeave = new Leave({
            doctor: req.user.username,
            leave: convertToIST(new Date(req.body.leaveDate))
        });
        
        let startTime = new Date();
        const istOffset = 330; // IST is UTC+5:30
        const utcTime = startTime.getTime();
        startTime = new Date(utcTime + istOffset * 60 * 1000);
        let endTime = new Date(req.body.leaveDate);
        endTime.setHours(23, 59, 59, 999);

        const appointments = await Appointment.updateMany(
            { doctor: req.user.username,appointmentDate: { $gte: startTime, $lte: endTime } },
            { $set: { status: 'canceled' } },
            { new: true }
        );

        const appointmentSlots = await AppointmentSlot.updateMany(
            { doctor:req.user.username,slotTime: { $gte: startTime, $lte: endTime } },
            { $set: { status: 'canceled' } },
            { new: true}
        );
        await newLeave.save();
        res.status(202).json({ message: "Status updated successfully", appointments, appointmentSlots });
    } catch (error) {
        res.status(500).json({ message: 'Some error occured while updating leave status', error: error.message });
    }
}

export const rollbackLeave = async (req, res) => {
    try {
        await User.updateOne({ username: req.user.username }, { $set: { available: true } });
        res.status(202).json({ message: "Status updated successfully" })
    } catch (error) {
        res.status(500).json({ message: 'Some error occured while updating leave status', error: error.message });
    }
}

//doctor: xyz
//today: 2024-12-10
//leave: 2024-12-20


export const withdrawLeave = async (req, res) => {
    try {
        await User.updateOne({ username: req.user.username }, { $set: { available: true } });
        res.status(202).json({ message: "Status updated successfully" })
    } catch (error) {
        res.status(500).json({ message: 'Some error occured while updating leave status', error: error.message });
    }
}

const getLatestSlot = async (doctor) => {
    try {
        const istTime = await getLatestAppointmentSlot(doctor);
        const slot = await checkDoctorAvailabilityAndProvideLatestSlot(istTime, doctor)
        return (slot ? slot : istTime)
    } catch (error) {
        console.log(error);
        return (error.message)
    }
};

export const getAvailableDoctors = async(req, res) => {
    try {
        const { startTime, endTime } = req.query;
        const allDoctors = await User.find({ role: 'doctor' });
        
        const doctorAvailability = await Promise.all(
            allDoctors.map(async (doctor) => {
                let latestSlot = await getLatestSlot(doctor.username);
                if (latestSlot >= convertToIST(new Date(startTime)) && latestSlot <= convertToIST(new Date(endTime))) {
                    console.log(`True for ${doctor.username}`, latestSlot);
                    return { doctor, isAvailable: true };
                } else {
                    return { doctor, isAvailable: false };
                }
            })
        );
        
        // Filter only available doctors
        const availableDoctors = doctorAvailability
            .filter(doctorInfo => doctorInfo.isAvailable)
            .map(doctorInfo => doctorInfo.doctor);
        
        console.log(availableDoctors);
        
        
        // const leaves = await Leave.find({})
        // const availableLeavesPartially = leaves.filter(leave => (leave.leave >= new Date(startTime) && leave.leave <= new Date(endTime)) || 
        // (leave.today>=new Date(startTime)));
        // console.log("availableLeavesPartially", availableLeavesPartially);
        // const doctorsWhoWillBeOnLeave = availableLeavesPartially.map(async leave => {
        //     return await User.find({username: leave.doctor})
        // })
        // const availableDoctors = await Promise.all(doctorsWhoWillBeOnLeave);
        // const notAvailableDoctorsByAppointment = await Appointment.find({})
        // // const appointmentSlotsDuringTimings = await AppointmentSlot.find({$})
        // const doctors = await User.find({ role: 'doctor', available: true });
        res.status(200).json({ message: "Available doctors", availableDoctors });
    } catch (error) {
        res.status(500).json({ message: "Some error occurred while fetching available doctors", error: error.message });
    }
}

export const getDoctorDetails = async(req, res) => {
    try {
        const doctor = await User.findOne({username: req.query.username, role: 'doctor'})
        if (doctor) {
            res.status(200).json(doctor);
        } else {
            res.status(404).json({ message: "Doctor not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Some error occurred while fetching doctor details", error: error.message });
    }
}
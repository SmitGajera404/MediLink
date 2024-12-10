import Appointment from "../../Models/Appointment.js";
import AppointmentSlot from "../../Models/AppointmentSlots.js";
import Leave from "../../Models/Leave.js";
import User from "../../Models/User.js"

export const declareLeave = async (req, res) => {
    try {
        await User.updateOne({ username: req.user.username }, { $set: { available: false } });
        const newLeave = new Leave({
            doctor: req.user.username,
            leave: req.body.leaveDate
        });
        
        let startTime = new Date();
        const istOffset = 330; // IST is UTC+5:30
        const utcTime = startTime.getTime();
        startTime = new Date(utcTime + istOffset * 60 * 1000);
        let endTime = new Date(req.body.leaveDate);
        endTime.setHours(23, 59, 59, 999);

        const appointments = await Appointment.updateMany(
            { appointmentDate: { $gte: startTime, $lte: endTime } },
            { $set: { status: 'canceled' } },
            { new: true }
        );

        const appointmentSlots = await AppointmentSlot.updateMany(
            { slotTime: { $gte: startTime, $lte: endTime } },
            { $set: { status: 'canceled' } },
            { new: true }
        );

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
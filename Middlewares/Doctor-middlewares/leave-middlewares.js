import Leave from "../../Models/Leave.js";
import { convertToIST } from "../../Utils/Date-Time-Utils/utils.js";

export const disableLeaveIfAlreadyLeaveExists = async( req, res, next ) => {
    try {
        const desiredLeaveDate = req.body.leaveDate;
        const currentDate = desiredLeaveDate
        console.log(currentDate);
        const leave = await Leave.findOne({
            doctor: req.user.username,
            today: { $lte: currentDate },
            leave: { $gte: currentDate }
        });
        if(leave){
            res.status(400).json({ message: "You already have a leave for today." });
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Some error occured on leave middleware", error: error.message });
    }
}
import Appointment from "../../Models/Appointment.js"

export const verifyUserAndAppointmentId = async( req, res, next) => {
    try{
        const appointment = await Appointment.findOne({_id:req.params.id})
        if(appointment.doctor === req.user.username){
            next();
        } else {
            throw new Error();
        }
    } catch (error) {
        res.status(404).json({message: "User is not authorized to do this action"});
    }
}
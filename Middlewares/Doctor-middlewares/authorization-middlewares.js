import User from "../../Models/User.js"

export const authenticateIsDoctor = async(req, res, next) => {
    const doctor = await User.findOne({username: req.user.username, role: 'doctor'});
    if(doctor) {
        next()
    } else {
        res.status(401).json({message: "User is not authorized to perform this action"});
    }
}


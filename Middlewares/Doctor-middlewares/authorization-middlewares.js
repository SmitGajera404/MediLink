import User from "../../Models/User.js"

export const authenticateIsDoctor = async(req, res, next) => {
    const doctor = await User.findOne({username: req.user.username, role: 'doctor'});
    if(doctor) {
        next()
    } else {
        res.status(401).json({message: "User is not authorized to perform this action"});
    }
}

export const validateDoctor = async(req, res, next) => {
    try{
        const doctor = await User.findOne({ username: req.query.doctor, role: 'doctor' });
        // console.log(doctor, req.query);
        
        if(doctor){
            next()
        } else {
            res.status(404).json({message: "Doctor not found"})
        }
    } catch(err){
        res.status(500).json({message: "Some error occurred on validating doctor", error: err.message});
    }
}
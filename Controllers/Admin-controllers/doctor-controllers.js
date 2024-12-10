import User from "../../Models/User.js"
import bcrypt from 'bcrypt';

export const onboardDoctor = async(req, res) => {
    try{
        const newDoctor = new User({...req.body, password: await bcrypt.hash(req.body.password, 13) });
        await newDoctor.save();
        res.status(201).json({ message: "Doctor added successfully" ,doctor: newDoctor });
    } catch (error) {
        res.status(500).json({message: "Some error occured while adding doctor",error: error.message});
    }
}
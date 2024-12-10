import { da } from "@faker-js/faker";
import { redisInstance } from "../../Database/Redis/instance.js";

export const getAppointmentsByDocterMiddleware = async( req, res, next) => {
    const date = req.query.date;
    try {
        const redisRes = await redisInstance.hgetall(`appointment:docter:${req.user.username}:${date}`);
        if(redisRes.data){
            res.status(200).json({ message: "Appointments fetched successfully", data: JSON.parse(redisRes.data)});
        } else {
            next();
        }
    } catch (error) {
        res.status(400).json({ message: 'Some error occured on redis server', error: error.message });
    }
}

export const getAppointmentsByPatientMiddleware = async (req, res, next) => {
    try{
        const redisRes = await redisInstance.hgetall(`appointment:patient:${req.user.username}`);
        if(redisRes.data){
            res.status(200).json({ message: "Appointments fetched successfully", data: JSON.parse(redisRes.data)});
        } else {
            next();
        }
    } catch( error){
        res.status(400).json({ message: 'Some error occured on redis server', error: error.message  })
    }
}


export const clearAppointmentCache = async(req, res, next) => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]
    console.log(formattedDate);
    
    try {
        await redisInstance.del(`appointment:doctor:${req.user.username}:${formattedDate}`)
        await redisInstance.del(`appointment:patient:${req.user.username}`);
        next();
    }
    catch (error) {
        res.status(400).json({ message: 'Some error occured on redis server', error: error.message });
    }
}
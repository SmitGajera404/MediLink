import dotenv from 'dotenv';
import Token from '../../Models/Token.js';
import jwt from 'jsonwebtoken';
dotenv.config();

export const authenticateToken = async(req, res, next) => {
    const accessToken = req.headers.authorization;
    const refreshToken = req.headers.authorization;
    console.log(req.headers);
    console.log({accessToken,refreshToken});
    
    try{
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        const token = await Token.find({token: refreshToken});
        if(token.length > 0) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            req.user = decoded;
            const newToken = jwt.sign(JSON.parse(decoded),process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '15m' });
            res.headers.new_access_token = newToken;
            next()
        } else {
            return res.status(401).json({ message: "Invalid token" });
        }
    }
}
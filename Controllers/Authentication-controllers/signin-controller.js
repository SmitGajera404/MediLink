import User from "../../Models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const signin = async (req, res) => {
    try {
        var accessToken, existingUserViaUsername;
        const { uniqueCredential, password } = req.body;
        const existingUserViaEmail = await User.findOne({
            $and: [
              { email: uniqueCredential },
              { role: { $ne: 'admin' } }
            ]
          });
          
        if (!existingUserViaEmail) {
            existingUserViaUsername = await User.findOne({$and:[{ username: uniqueCredential },{ role: { $ne: 'admin' }}]});
            if (!existingUserViaUsername) {
                return res.status(404).json({ message: "User not found" });
            } else {
                const isPasswordCorrect = await bcrypt.compare(password, existingUserViaUsername.password);
                if (!isPasswordCorrect) {
                    return res.status(400).json({ message: "Invalid credentials" });
                }
            }
            accessToken = jwt.sign(existingUserViaUsername.toJSON(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        } else {
            let isPasswordCorrect = await bcrypt.compare(password, existingUserViaEmail.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: "Invalid credentials" });
            }
            accessToken = jwt.sign(existingUserViaEmail.toJSON(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        }

        return res.status(200).json({
            message: "User Signed In Successfully",
            accessToken: accessToken,
            role: existingUserViaEmail ? existingUserViaEmail.role : existingUserViaUsername.role
        })
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            message: "Invalid credentials",
            error: error.message
        })
    }

}


export const adminLogin = async(req, res) => {
    try {
        let accessToken, existingUserViaUsername;
        const { uniqueCredential, password } = req.body;
        const existingUserViaEmail = await User.findOne({ email: uniqueCredential ,role:'admin'});
        if (!existingUserViaEmail) {
            existingUserViaUsername = await User.findOne({ username: uniqueCredential ,role: 'admin'});
            if (!existingUserViaUsername) {
                return res.status(404).json({ message: "User not found" });
            } else {
                const isPasswordCorrect = await bcrypt.compare(password, existingUserViaUsername.password);
                if (!isPasswordCorrect) {
                    return res.status(400).json({ message: "Invalid credentials" });
                }
            }
            accessToken = jwt.sign(existingUserViaUsername.toJSON(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        } else {
            let isPasswordCorrect = await bcrypt.compare(password, existingUserViaEmail.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: "Invalid credentials" });
            }
            accessToken = jwt.sign(existingUserViaEmail.toJSON(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        }

        return res.status(200).json({
            message: "Admin Signed In Successfully",
            accessToken: accessToken,
            role: existingUserViaEmail ? existingUserViaEmail.role : existingUserViaUsername.role
        })
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            message: "Invalid credentials",
            error: error.message
        })
    }
}
import User from "../../Models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker'
import dotenv from 'dotenv';
import Token from "../../Models/Token.js";

dotenv.config();
export const onboardNewUser = async(req, res) => {
    try {
        const encryptedPassword = await bcrypt.hash(req.body.password, 13); 
        const newUser = new User({...req.body,password: encryptedPassword});
        await newUser.save();
        const refreshToken = jwt.sign(newUser.toJSON(),process.env.REFRESH_TOKEN_SECRET);
        const newToken = new Token({
            token: refreshToken,
            userId: newUser._id
        })
        await newToken.save();
        res.status(201).json({message: "User created successfully", accessToken:accessToken});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
}

export const addFakeData = async( req, res) => {
    try {
        const password = "Smit_2824"; // Common password
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    
        const users = [];
    
        // Generate 7 Patients
        for (let i = 0; i < 7; i++) {
          users.push({
            username: faker.internet.username(),
            fullName: faker.name.fullName(),
            email: faker.internet.email(),
            password: hashedPassword,
            role: "patient",
            gender: faker.helpers.arrayElement(["male", "female"]),
            dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: "age" }),
            address: faker.address.streetAddress(),
            emergencyContact: {
              name: faker.name.fullName(),
              relationship: faker.helpers.arrayElement(["parent", "spouse", "sibling", "friend"]),
              phone: faker.phone.number(),
            },
            medicalHistory: faker.lorem.sentence(),
          });
        }
    
        // Generate 4 Doctors
        for (let i = 0; i < 4; i++) {
          users.push({
            username: faker.internet.userName(),
            fullName: faker.name.fullName(),
            email: faker.internet.email(),
            password: hashedPassword,
            role: "doctor",
            gender: faker.helpers.arrayElement(["male", "female"]),
            dateOfBirth: faker.date.birthdate({ min: 25, max: 65, mode: "age" }),
            address: faker.address.streetAddress(),
            department: faker.helpers.arrayElement(["Cardiology", "Neurology", "Orthopedics", "Pediatrics"]),
          });
        }
    
        // Insert users into the database
        const result = await User.insertMany(users);
    
        res.status(201).json({
          message: "Fake data added successfully!",
          insertedCount: result.length,
          users: result,
        });
      } catch (error) {
        console.error("Error adding fake data:", error);
        res.status(500).json({ error: "Failed to add fake data" });
      }
}   
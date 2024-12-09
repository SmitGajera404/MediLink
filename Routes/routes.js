import express from 'express';
import { onboardNewUser, addFakeData } from '../Controllers/Authentication-controllers/signup-controller.js';
import { signin } from '../Controllers/Authentication-controllers/signin-controller.js';
import { authenticateToken } from '../Middlewares/Jwt-middlewares/jwt-middleware.js';
import { createAppointment } from '../Controllers/Appointment-controllers/appointment-controller.js'
const Router = express.Router();


Router.post('/v1/onboard',onboardNewUser) 

Router.post('/v1.2/signin', signin);

Router.post('/v1/addappointment', authenticateToken, createAppointment);

Router.get('/get',(req, res) => {
    res.send('Hello World!')
})

Router.get('/v1/sampleAPI',(req, res) => {
    addFakeData(req, res)
})

export default Router
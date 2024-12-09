import express from 'express';
import { onboardNewUser, addFakeData } from '../Controllers/Authentication-controllers/signup-controller.js';
import { adminLogin, signin } from '../Controllers/Authentication-controllers/signin-controller.js';
import { authenticateToken } from '../Middlewares/Jwt-middlewares/jwt-middleware.js';
import { createAppointment, getAppointmentByDocter, getAppointmentByPatient, updateAppointmentStatus } from '../Controllers/Appointment-controllers/appointment-controller.js'
import { clearAppointmentCache, getAppointmentsByDocterMiddleware, getAppointmentsByPatientMiddleware } from '../Middlewares/Appointment-middlewares/caching-middlewares.js';
import { verifyUserAndAppointmentId } from '../Middlewares/Appointment-middlewares/authorization-middlewares.js';
const Router = express.Router();


Router.post('/onboard', onboardNewUser);

Router.post('/signin', signin);

Router.post('/admin/signin', adminLogin);

Router.patch('/appointments/update/status/:id/:update', authenticateToken, clearAppointmentCache, verifyUserAndAppointmentId, updateAppointmentStatus)

Router.post('/addappointment', authenticateToken, clearAppointmentCache, createAppointment);

Router.get('/appointments/docter', authenticateToken, getAppointmentsByDocterMiddleware, getAppointmentByDocter) //date

Router.get('/appointments/patient', authenticateToken, getAppointmentsByPatientMiddleware, getAppointmentByPatient)

Router.get('/get', (req, res) => {
    res.send('Hello World!')
})

Router.get('/v1/sampleAPI', (req, res) => {
    addFakeData(req, res)
})

export default Router
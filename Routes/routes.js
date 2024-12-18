import express from 'express';
import { onboardNewUser, addFakeData } from '../Controllers/Authentication-controllers/signup-controller.js';
import { adminLogin, signin } from '../Controllers/Authentication-controllers/signin-controller.js';
import { authenticateToken } from '../Middlewares/Jwt-middlewares/jwt-middleware.js';
import { createAppointment, getAppointmentByDoctor, getAppointmentByPatient, getLatestSlot, updateAppointmentStatus } from '../Controllers/Appointment-controllers/appointment-controller.js'
import { clearAppointmentCache, getAppointmentsByDocterMiddleware, getAppointmentsByPatientMiddleware } from '../Middlewares/Appointment-middlewares/caching-middlewares.js';
import { verifyUserAndAppointmentId } from '../Middlewares/Appointment-middlewares/authorization-middlewares.js';
import { authenticateIsAdmin, authenticateIsAdminOrDoctor } from '../Middlewares/Admin-middlewares/authorization-middlewares.js';
import { onboardDoctor } from '../Controllers/Admin-controllers/doctor-controllers.js';
import { declareLeave, getDoctorDetails, withdrawLeave } from '../Controllers/Doctor-controllers/doctor-controllers.js';
import { authenticateIsDoctor } from '../Middlewares/Doctor-middlewares/authorization-middlewares.js';
import { getPatient } from '../Controllers/Patient-controllers/patient-controller.js';
import { disableLeaveIfAlreadyLeaveExists } from '../Middlewares/Doctor-middlewares/leave-middlewares.js';
import { getMedicinesByActiveIngredient, getMedicinesByPurpose } from '../Controllers/Doctor-controllers/medicine-controllers.js';
const Router = express.Router();


Router.post('/onboard', onboardNewUser);

Router.post('/signin', signin);

Router.post('/admin/signin', adminLogin);

Router.patch('/appointments/update/status/:id/:update', authenticateToken, clearAppointmentCache, verifyUserAndAppointmentId, updateAppointmentStatus)

Router.post('/addappointment', authenticateToken, clearAppointmentCache, createAppointment);

Router.get('/appointments/latest/slot', authenticateToken, getLatestSlot);

Router.post('/doctor/leave', authenticateToken, authenticateIsDoctor, disableLeaveIfAlreadyLeaveExists, declareLeave);

Router.post('/doctor/unleave', authenticateToken, authenticateIsDoctor, withdrawLeave);

Router.get('/patient/', authenticateToken , authenticateIsAdminOrDoctor, getPatient);

Router.get('/doctor/', authenticateToken , getDoctorDetails);

Router.get('/doctor/search/medicine/active_ingredient', authenticateToken, authenticateIsDoctor, getMedicinesByActiveIngredient)
Router.get('/doctor/search/medicine/purpose', authenticateToken, authenticateIsDoctor, getMedicinesByPurpose)

Router.post('/onboard/doctor', authenticateToken, authenticateIsAdmin, onboardDoctor);
// Router.post('/available/docter', authenticateToken, )

Router.get('/appointments/doctor', authenticateToken, getAppointmentsByDocterMiddleware, getAppointmentByDoctor) //date

Router.get('/appointments/patient', authenticateToken, getAppointmentsByPatientMiddleware, getAppointmentByPatient)

Router.get('/get', (req, res) => {
    res.send('Hello World!')
})

Router.get('/v1/sampleAPI', (req, res) => {
    addFakeData(req, res)
})

export default Router
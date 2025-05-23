import express from 'express';
import { newBooking, checkAvailability } from "../controllers/appointmentController.js"
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/book', auth, newBooking);

router.get('/check-availability',checkAvailability)



export default router;
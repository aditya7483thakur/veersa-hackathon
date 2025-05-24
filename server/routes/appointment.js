import express from "express";
import {
  newBooking,
  checkAvailability,
  upcoming,
  cancel,
} from "../controllers/appointmentController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/book", auth, newBooking);

router.get("/check-availability", auth, checkAvailability);

router.get("/upcoming", auth, upcoming);

router.get("/cancel", auth, cancel);


export default router;

import express from "express";
import { getAllDoctors } from "../controllers/doctorController.js";
import { auth } from "../middlewares/auth.js";
const router = express.Router();


router.get("/get-doctors", auth, getAllDoctors);
router.get("/upcoming", getAllDoctors);

export default router;

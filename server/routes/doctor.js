import express from "express";
import { getAllDoctors, upcoming } from "../controllers/doctorController.js";
import { auth } from "../middlewares/auth.js";
const router = express.Router();


router.get("/get-doctors", auth, getAllDoctors);
router.get("/upcoming", upcoming);

export default router;

import express from "express";
import {
  filterDoctors,
  getAllDoctors,
  upcoming,
} from "../controllers/doctorController.js";
import { auth } from "../middlewares/auth.js";
const router = express.Router();

router.get("/get-doctors", auth, getAllDoctors);
router.get("/upcoming", upcoming);
router.get("/filter-doctors", auth, filterDoctors);

export default router;

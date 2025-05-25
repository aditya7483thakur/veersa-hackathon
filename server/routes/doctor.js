import express from "express";
import {
  filterDoctors,
  aiIntegrate, getAllDoctors,
  upcoming,
} from "../controllers/doctorController.js";
import { auth } from "../middlewares/auth.js";
const router = express.Router();

router.get("/get-doctors", auth, getAllDoctors);
router.get("/upcoming",auth, upcoming);
router.get("/filter-doctors", auth, filterDoctors);
router.get("/ask-ai",auth,aiIntegrate);

export default router;

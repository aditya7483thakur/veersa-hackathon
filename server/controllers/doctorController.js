import { Appointment } from "../models/Appointment.js";
import { Doctor } from "../models/Doctor.js";

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("user_id", "-password");

    res.status(200).json({
      success: true,
      message: "Doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({
      message: "Server Error. Could not fetch doctors.",
    });
  }
};

export const upcoming = async (req, res) => {
  try {
    
    const appointments = await Appointment.find({
      doctor_id: req.user.userId, 
    })
      .populate({
        path: "user_id", 
      })
      .sort({ appointmentDate: 1, timeSlot: 1 })
      .exec();
    
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json(err);
  }
};
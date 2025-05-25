import { Appointment } from "../models/Appointment.js";

export const newBooking = async (req, res) => {
  const { doctor_id, appointmentDate, timeSlot } = req.body;

  try {
    // Check for user conflicts
    const userConflict = await Appointment.findOne({
      user_id: req.user.userId,
      appointmentDate,
      timeSlot,
    });

    if (userConflict) {
      return res.status(400).json({
        success: false,
        message: "You already have an appointment booked at this time.",
      });
    }

    const newAppointment = new Appointment({
      doctor_id,
      appointmentDate,
      timeSlot,
      user_id: req.user.userId,
    });

    await newAppointment.save();

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully.",
      appointment: newAppointment,
    });
  } catch (error) {
    // Handle duplicate key error from MongoDB (doctor conflict)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "The selected time slot is already booked by the doctor. Please choose another time.",
      });
    }

    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while booking the appointment. Please try again later.",
    });
  }
};

export const checkAvailability = async (req, res) => {
  try {
    const { doctor_id, date } = req.query;

    const appointments = await Appointment.find(
      { doctor_id: doctor_id, appointmentDate: date }, //searches on this basis
      { timeSlot: 1, _id: 0 } //return time slot
    );

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      message: "Server error. Could not check availability.",
    });
  }
};

// function that returns all upcoming appointments for a user
export const upcoming = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      user_id: req.user.userId,
    })
      .populate({
        path: "doctor_id",
      })
      .sort({ appointmentDate: 1, timeSlot: 1 })
      .exec();
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json(err);
  }
};

// function to cancel an appointment
export const cancel = async (req, res) => {
  try {
    const appointmentId = req.query.appointmentId;
    // extract ID from query parameters
    if (!appointmentId) {
      return res.status(400).json({ message: "Appointment ID is required." });
    }

    const result = await Appointment.deleteOne({ _id: appointmentId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "Appointment cancelled successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

import { Appointment } from "../models/Appointment.js"

export const newBooking = async (req, res) => {
    const { doctor_id, appointmentDate, timeSlot } = req.body;

    try {
        const existingAppointment = await Appointment.findOne({
            doctor_id: doctor_id,
            appointmentDate: appointmentDate,
            timeSlot: timeSlot,
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message:
                    "The selected time slot is already booked. Please choose another time.",
            });
        }

        const newAppointment = new Appointment({
            doctor_id: doctor_id,
            appointmentDate: appointmentDate,
            timeSlot: timeSlot,
            user_id: req.user.userId,
        });

        await newAppointment.save();

        return res.status(201).json({
            success: true,
            message: "Appointment booked successfully.",
            appointment: newAppointment,
        });
    } catch (error) {
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
            { doctor_id: doctor_id, appointmentDate: date },
            { timeSlot: 1, _id: 0 }
        );

        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({
            message: "Server error. Could not check availability.",
        });
    }
};
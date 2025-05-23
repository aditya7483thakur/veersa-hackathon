import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointmentDate: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//  Ensure unique combination of doctor, date, and time slot
appointmentSchema.index(
  { doctor_id: 1, appointmentDate: 1, timeSlot: 1 },
  { unique: true }
);
export const Appointment = mongoose.model("Appointment", appointmentSchema);

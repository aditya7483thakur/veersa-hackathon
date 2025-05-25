import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_BACKED_API_URL;

class AppointmentService {
  // Delete appointment
  async cancelAppointment(appointmentId) {
    try {
      const response = await axios.delete(
        `${BASE_URL}/appointment/cancel-appointment`,
        {
          params: {
            appointmentId: appointmentId,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error failed to delete appointment:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete appointment"
      );
    }
  }
}

export const appointmentService = new AppointmentService();

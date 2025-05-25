import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_BACKED_API_URL;

class DoctorService {
  // Get all doctors (initial load)
  async getAllDoctors() {
    try {
      const response = await axios.get(`${BASE_URL}/doctor/get-doctors`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all doctors:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch doctors"
      );
    }
  }

  // Find doctors with filters and search
  async findDoctors(params) {
    try {
      console.log(params);
      const response = await axios.get(`${BASE_URL}/doctor/filter-doctors`, {
        params: params,
      });
      // console.log("Response", response);
      return response.data;
    } catch (error) {
      console.error("Error finding doctors:", error);
      throw new Error(
        error.response?.data?.error || "Failed to search doctors"
      );
    }
  }

  // AI-powered search
  async aiSearch(params) {
    try {
      const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {});

      console.log("AI search params:", cleanParams);

      const response = await axios.get(`${BASE_URL}/doctor/ai-seek`, {
        params: cleanParams,
      });

      return response.data;
    } catch (error) {
      console.error("Error with AI search:", error);
      throw new Error(error.response?.data?.error || "AI search failed");
    }
  }
}

export const doctorService = new DoctorService();

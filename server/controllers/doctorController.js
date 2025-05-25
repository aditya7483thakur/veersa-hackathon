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

export const filterDoctors = async (req, res) => {
  try {
    const {
      searchTerm = "",
      distance,
      experience,
      sortBy = "fees",
      sortDirection = "desc",
      userLat,
      userLon,
      fees,
    } = req.query;

    // Match doctors where any field (e.g., city, specialization, etc.) contains the search term, case-insensitively
    const query = {
      $or: [
        { specialization: { $regex: new RegExp(searchTerm, "i") } },
        { city: { $regex: new RegExp(searchTerm, "i") } },
        { doctorName: { $regex: new RegExp(searchTerm, "i") } },
        { hospitalName: { $regex: new RegExp(searchTerm, "i") } },
        { hospitalAddress: { $regex: new RegExp(searchTerm, "i") } },
        { state: { $regex: new RegExp(searchTerm, "i") } },
        { country: { $regex: new RegExp(searchTerm, "i") } },
      ],
    };

    const filters = {};
    // If fees are provided, filter doctors whose consultation fees are less than or equal to the given amount
    if (fees) filters.fees = { $lte: parseInt(fees) };

    // If experience is provided, filter doctors with experience greater than or equal to the given value
    if (experience) filters.experience = { $gte: parseInt(experience) };

    let finalQuery =
      Object.keys(filters).length > 0 ? { $and: [query, filters] } : query;

    //       finalQuery = {
    //   $and: [
    //     {
    //       $or: [
    //         { specialization: { $regex: /searchTerm/i } },
    //         { city: { $regex: /searchTerm/i } },
    //         { doctorName: { $regex: /searchTerm/i } },
    //         { hospitalName: { $regex: /searchTerm/i } },
    //         { hospitalAddress: { $regex: /searchTerm/i } },
    //         { state: { $regex: /searchTerm/i } },
    //         { country: { $regex: /searchTerm/i } },
    //       ]
    //     },
    //     {
    //       fees: { $lte: 500 },
    //       experience: { $gte: 3 }
    //     }
    //   ]
    // }

    const sortOptions = {};
    if (sortBy && sortBy !== "distance") {
      sortOptions[sortBy] = sortDirection === "desc" ? -1 : 1;
    }

    let doctors;
    // $geoNear stage filters doctors using finalQuery,
    // calculates distance from user's location (near),
    // stores distance in 'distance' field,
    // includes only docs within maxDistance (meters),
    // and uses spherical geometry for accurate Earth distance calculation.

    if (userLat && userLon) {
      doctors = await Doctor.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [parseFloat(userLon), parseFloat(userLat)],
            },
            distanceField: "distance",
            maxDistance: distance ? parseFloat(distance) * 1000 : 50000, // Convert to meters
            query: finalQuery,
            spherical: true,
          },
        },
        {
          $addFields: {
            distanceInKm: { $divide: ["$distance", 1000] }, // Convert distance to kilometers
          },
        },
        {
          $sort:
            sortBy === "distance"
              ? {
                  distanceInKm: sortDirection === "desc" ? -1 : 1,
                }
              : Object.keys(sortOptions).length > 0
              ? sortOptions
              : { _id: 1 },
        },
      ]).exec();
    } else {
      doctors = await Doctor.find(finalQuery)
        .sort(Object.keys(sortOptions).length > 0 ? sortOptions : { _id: 1 })
        .exec();
    }

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({
      error: "An error occurred while searching for doctors.",
    });
  }
};

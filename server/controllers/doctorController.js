import { Appointment } from "../models/Appointment.js";
import { Doctor } from "../models/Doctor.js";
import dotenv from 'dotenv';
dotenv.config();
import Groq from "groq-sdk";
const groq = new Groq({
  apiKey:process.env.GROQ_API_KEY
});


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

export const aiIntegrate = async (req, res) => {
  try {
    console.log("Groq API Key:", process.env.GROQ_API_KEY);
    const text = req.query.text;
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    if (!text?.trim()) {
      return res.status(400).json({ error: "Text query parameter is required" });
    }

    const doctors = await Doctor.find().exec();
    if (!doctors.length) return res.status(200).json([]);

    const doctorProfiles = doctors.map((doctor, index) => ({
      id: index,
      doctorId: doctor._id,
      profile: `#${index}: ${doctor.doctorName || doctor.name}, ${doctor.specialization}, ${doctor.city}, ${doctor.experience}yrs. ${doctor.description || ''}`,
    }));

    // Construct optimized AI prompt
    const prompt = `
Match the user query with doctors and score each out of 10 based on relevance.
User Query: "${text}"

Doctors:
${doctorProfiles.map(doc => doc.profile).join('\n')}

Task: Analyze the patient's query and score the doctors from most relevant to least relevant based on:
1. Medical specialty match
2. Experience relevance
3. Condition/symptom match
4. General suitability

Return a JSON object with doctor index as key and relevance score (0-10) as value.
Example: {"0": 9.2, "3": 7.5, "1": 6.0}
Only return JSON.
`.trim();

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      max_tokens: 512,
    });

    const aiResponse = completion.choices[0]?.message?.content || "";
    console.log("AI Response:", aiResponse);

    let relevanceScores = {};
    try {
      const match = aiResponse.match(/\{[\s\S]*?\}/);
      relevanceScores = JSON.parse(match?.[0] || "{}");
    } catch (err) {
      console.error("AI response parsing error:", err);
      relevanceScores = Object.fromEntries(
        doctorProfiles.slice(0, 10).map((doc, i) => [doc.id, 5.0])
      );
    }

    // Map score to doctorId and filter valid ones
    const scoredDoctors = Object.entries(relevanceScores)
      .map(([index, score]) => {
        const docProfile = doctorProfiles[parseInt(index)];
        const doc = doctors.find(d => d._id.toString() === docProfile?.doctorId.toString());
        return doc ? { doctor: doc, score: parseFloat(score) } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, 10); // Limit to top 10

    // Apply geo filtering
    let finalDoctors = scoredDoctors.map(item => ({
      ...item,
      distanceInKm: null,
    }));

    if (!isNaN(userLat) && !isNaN(userLon)) {
      const geoResults = await Doctor.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [userLon, userLat] },
            distanceField: "distance",
            spherical: true,
            maxDistance: 100000, // 100 km
            query: {
              _id: { $in: scoredDoctors.map(d => d.doctor._id) },
            },
          },
        },
        {
          $addFields: {
            distanceInKm: { $round: [{ $divide: ["$distance", 1000] }, 2] },
          },
        },
        {
          $project: {
            _id: 1,
            distanceInKm: 1,
            distance: 1,
          },
        },
      ]);

      const geoMap = new Map(
        geoResults.map(doc => [doc._id.toString(), doc.distanceInKm])
      );

      finalDoctors = scoredDoctors.map(({ doctor, score }) => ({
        doctor: doctor.toObject(),
        score: parseFloat(score.toFixed(1)),
        distanceInKm: geoMap.get(doctor._id.toString()) || null,
      }));
    } else {
      finalDoctors = scoredDoctors.map(({ doctor, score }) => ({
        doctor: doctor.toObject(),
        score: parseFloat(score.toFixed(1)),
        distanceInKm: null,
      }));
    }

    return res.status(200).json({
      success: true,
      query: text,
      count: finalDoctors.length,
      doctors: finalDoctors.map(({ doctor, score, distanceInKm }) => ({
        ...doctor,
        score,
        distanceInKm,
      })),
    });
  } catch (error) {
    console.error("AI Integration Error:", error.message);

    try {
      const fallbackDoctors = await Doctor.find({
        $or: [
          { specialization: { $regex: text, $options: "i" } },
          { doctorName: { $regex: text, $options: "i" } },
          { name: { $regex: text, $options: "i" } },
          { hospitalName: { $regex: text, $options: "i" } },
          { description: { $regex: text, $options: "i" } },
        ],
      }).limit(10).exec();

      return res.status(200).json({
        success: true,
        fallback: true,
        query: text,
        count: fallbackDoctors.length,
        doctors: fallbackDoctors.map(doc => ({
          ...doc.toObject(),
          score: null,
          distanceInKm: null,
        })),
      });
    } catch (fallbackErr) {
      console.error("Fallback failed:", fallbackErr);
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Doctor search failed",
      });
    }
  }
};

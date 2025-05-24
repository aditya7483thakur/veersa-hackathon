import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Doctor } from "../models/Doctor.js";
import { createAccessToken } from "../middlewares/token.js";

export const register = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      name,
      email,
      password,
      role,
      hospitalName,
      hospitalAddress,
      specialization,
      fees,
      city,
      state,
      country,
      latitude,
      longitude,
      licence,
      experience,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please Fill All Fields" });
    }

    const existedUser = await User.findOne({ email }).session(session);
    if (existedUser) {
      return res
        .status(400)
        .json({ message: "User with same email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save({ session });

    let userObj = user.toObject();

    if (role.toLowerCase() === "doctor") {
      const description = `Doctor ${name} specializing in ${specialization} sits at ${hospitalName} ${hospitalAddress} ${city} ${state} ${country}`;

      const doctor = new Doctor({
        user_id: user._id,
        doctorName: name,
        hospitalName,
        hospitalAddress,
        specialization,
        fees,
        city,
        state,
        country,
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        description,
        licence,
        experience: Number(experience),
      });

      await doctor.save({ session });

      userObj = { ...userObj, ...doctor.toObject() };
    }

    await session.commitTransaction();
    session.endSession();

    const accessToken = createAccessToken(user);

    return res.status(201).json({
      message:
        role.toLowerCase() === "doctor"
          ? "Doctor Registered Successfully"
          : "User Created Successfully",
      accessToken,
      user: {
        id: userObj._id,
        name: userObj.name,
        email: userObj.email,
        role: userObj.role,
        doctorDetails: userObj.doctorName
          ? {
              doctorName: userObj.doctorName,
              hospitalName: userObj.hospitalName,
              hospitalAddress: userObj.hospitalAddress,
              specialization: userObj.specialization,
              fees: userObj.fees,
              city: userObj.city,
              state: userObj.state,
              country: userObj.country,
              licence: userObj.licence,
              experience: userObj.experience,
            }
          : null,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    return res.status(500).json({ message: "Error Creating User" });
  }
};

// function that handles user login, doctor and patient
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if ([email, password].some((field) => field?.trim() === "")) {
      return res.status(400).json({ message: "Please Fill All Fields" });
    }

    let user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const accessToken = createAccessToken(user);

    let userObj = user.toObject(); // Convert user document to plain object

    if (userObj.role.toLowerCase() === "doctor") {
      const doctor = await Doctor.findOne({ user_id: userObj._id });

      if (doctor) {
        console.log("Doctor found: ", doctor);
        // convert doctor document to plain object and merge with user
        userObj = { ...userObj, ...doctor.toObject() };
        console.log("USER HERE IS: ", userObj);
      }
    }

    res.status(200).json({
      accessToken,
      user: {
        id: userObj._id,
        name: userObj.name,
        email: userObj.email,
        role: userObj.role,
        // include doctor details if available
        doctorDetails: userObj.doctorName
          ? {
              doctorName: userObj.doctorName,
              hospitalName: userObj.hospitalName,
              hospitalAddress: userObj.hospitalAddress,
              specialization: userObj.specialization,
              fees: userObj.fees,
              city: userObj.city,
              state: userObj.state,
              country: userObj.country,
              licence: userObj.licence,
              experience: userObj.experience,
            }
          : null,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Logging In" });
  }
};

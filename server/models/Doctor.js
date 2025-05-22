import mongoose, { Schema } from "mongoose";

const doctorSchema = Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        doctorName: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        hospitalName: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        hospitalAddress: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        specialization: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        fees: {
            type: Number,
            default: 0,
        },

        city: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        state: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        country: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        location: {
            type: { type: String },
            coordinates: [Number],
        },

        licence: {
            type: String,
            required: true,
        },

        experience: {
            type: Number,
            required: true,
        },

        profilePhoto: {
            type: String,
            required: true,
            default: '/avatar.jpg',
        },
    },
    { strict: false },
    { timestamp: true } 
);

// create 2d sphere index for location
doctorSchema.index({ location: "2dsphere" });

export const Doctor = mongoose.model("Doctor", doctorSchema);
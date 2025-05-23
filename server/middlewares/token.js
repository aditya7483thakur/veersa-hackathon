import jwt from "jsonwebtoken";

export const createAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.EXPO_PUBLIC_ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.EXPO_PUBLIC_ACCESS_TOKEN_EXPIRY }
  );
};

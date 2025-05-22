import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static("public"));

connectDB();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on port 5000');
});


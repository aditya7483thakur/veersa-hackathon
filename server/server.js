import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static('public'));

connectDB();

app.use(cors({
  origin: "*", 
  credentials: true,  
}));

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

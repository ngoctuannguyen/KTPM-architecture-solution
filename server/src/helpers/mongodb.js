import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
// Kết nối MongoDB
const mongodbUri = process.env.MONGODB_URI;
mongoose
  .connect(mongodbUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Định nghĩa schema và model
const urlSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  url: { type: String, required: true },
});

const URLModel = mongoose.model("URL", urlSchema);

export { URLModel };

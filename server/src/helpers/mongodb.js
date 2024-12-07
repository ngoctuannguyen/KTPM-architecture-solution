import mongoose from "mongoose";

// Kết nối MongoDB
mongoose
  .connect(
    "mongodb+srv://hungsinh2k4:hungbin123456@cluster0.nexwa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0l"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Định nghĩa schema và model
const urlSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  url: { type: String, required: true },
});

const URLModel = mongoose.model("URL", urlSchema);

export { URLModel };

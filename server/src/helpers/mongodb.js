import mongoose from "mongoose";

// Kết nối MongoDB
mongoose
  .connect(
    "mongodb+srv://ngoctuannguyen1980123:Ngocchemgio2@cluster0.sobpy1m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
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

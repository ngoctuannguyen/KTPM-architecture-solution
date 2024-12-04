const mongoose = require("mongoose");

// Kết nối MongoDB
mongoose
  .connect("mongodb://localhost:27017/shorturl")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Định nghĩa schema và model
const urlSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  url: { type: String, required: true },
});

const URLModel = mongoose.model("URL", urlSchema);

module.exports = {
  URLModel,
};

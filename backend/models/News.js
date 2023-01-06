const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  info: { type: String, required: true },
  isClassified: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  username: { type: String, required: true },
  classification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "classified",
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("news", newsSchema);

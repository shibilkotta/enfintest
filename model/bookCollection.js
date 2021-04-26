const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  authorName: { type: String, required: true },
  publishedYear: { type: Number, required: true },
  price: { type: Number, required: true },
  status: Number,
});
bookSchema.index({ name: "text", authorName: "text" });

module.exports = mongoose.model("Task", bookSchema);

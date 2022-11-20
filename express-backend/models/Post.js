const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  time: { type: Date, default: Date.now() },
  id: { type: Number },
  completed: { type: Boolean, default: false },
  completedOn: { type: Date },
});

//Export model
module.exports = mongoose.model("Post", PostSchema);

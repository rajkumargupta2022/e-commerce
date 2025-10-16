import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  febricName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Avoid recompilation in Next.js hot-reload
export default mongoose.models.User || mongoose.model("febricCategories", UserSchema);

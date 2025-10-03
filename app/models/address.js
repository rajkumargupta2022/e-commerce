import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    
    phoneNumber: {
      type: String,
      trim: true, // optional but useful for delivery
    },
    isDefault: {
      type: Boolean,
      default: false, // mark one address as default
    },
  },
  { timestamps: true }
);

export default mongoose.model("address", addressSchema);

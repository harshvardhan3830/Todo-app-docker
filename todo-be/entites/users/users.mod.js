import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    todos: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Todo",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

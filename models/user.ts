import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String }, // optional if using Google OAuth
  codeforces: { type: String },
  leetcode: { type: String },
  gfg: { type: String },
  codechef: { type: String },
})

export default mongoose.models.User || mongoose.model("User", UserSchema)
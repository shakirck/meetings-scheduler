import mongoose, { Mongoose, Types } from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    token: Object
});

const User = mongoose.model("User", userSchema);
export default User;
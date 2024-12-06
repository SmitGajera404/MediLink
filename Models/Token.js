import mongoose from "mongoose";

const tokenSchema = mongoose.Schema({
    token: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const Token = mongoose.model('Token',tokenSchema);
export default Token;
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    security: {
        type: Number,
        required: true,
        default: 0
    },
    password: String,
    hash: String,
    lastLogin: Date
})

const User = mongoose.model("User", userSchema);

module.exports = User;
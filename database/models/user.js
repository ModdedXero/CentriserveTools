const mongoose = require("mongoose");
const { isDate } = require("util");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    security: String,
    hash: String,
    lastLogin: Date
})

const User = mongoose.model("User", userSchema);

module.exports = User;
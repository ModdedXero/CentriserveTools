const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: String,
    serial: String,
    amount: Number
})

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    items: [itemSchema]
})

const inventorySchema = new Schema({
    location: {
        type: String,
        required: true,
        unique: true
    },
    categories: [categorySchema]
})

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
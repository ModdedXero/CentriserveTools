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

const noteSchema = new Schema({
    reason: String,
    itemData: Object,
    username: String
})

const categorySchema = new Schema({
    name: String,
    items: [itemSchema],
    notes: [noteSchema]
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
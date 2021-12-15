const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    count: {
        type: Number,
    }
});

const noteSchema = new Schema({
    items: [itemSchema],
    reason: String
});

const inventorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    items: [itemSchema],
    notes: [noteSchema],
    location: {
        type: String,
        required: true
    }
});

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fieldSchema = new Schema({
    label: String,
    type: String,
    action: String,
    position: String,
    transit: Boolean,
    header: Boolean,
    addItem: Boolean,
    showLabel: Boolean,
    valueList: [String],
    actionValueRef: String
});

const fieldDataSchema = new Schema({
    label: String,
    position: String,
    value: String,
    type: String,
    showLabel: Boolean
});

const itemSchema = new Schema({
    fields: [fieldDataSchema]
})

const noteSchema = new Schema({
    reason: String,
    itemData: Object,
    username: String
})

const categorySchema = new Schema({
    name: String,
    fields: [fieldSchema],
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
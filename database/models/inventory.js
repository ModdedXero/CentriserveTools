const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Admin Inventory

const fieldSchema = new Schema({
    // All
    label: String,
    type: String,
    position: String,
    header: Boolean,
    item: Boolean,
    showLabel: Boolean,
    valueList: [String],
    action: String,

    // Header
    actionValue: String,
    
    // Items
    checkout: Boolean,
    transit: Boolean,
    value: String
});

const categorySchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    collapsed: Boolean,
    nameField: fieldSchema,
    fields: [fieldSchema],
});

// Visible Inventory

const subItemSchema = new Schema({
    fields: [fieldSchema]
});

const itemSchema = new Schema({
    name: String,
    amount: {
        type: Number,
        default: 0
    },
    shelf: [subItemSchema]
});

const noteSchema = new Schema({
    reason: String,
    itemData: Object,
    username: String
});

const categoryContainerSchema = new Schema({
    name: {
        type: String,
        requried: true
    },
    collapsed: Boolean,
    amount: {
        type: Number,
        default: 0
    },
    items: [itemSchema],
    notes: [noteSchema]
});

const inventorySchema = new Schema({
    location: {
        type: String,
        required: true,
        unique: true
    },
    categories: [categoryContainerSchema]
});

const Inventory = mongoose.model("Inventory", inventorySchema);
const Category = mongoose.model("Category", categorySchema);
const Field = mongoose.model("Field", fieldSchema);

exports.Inventory = Inventory;
exports.Category = Category;
exports.Field = Field;
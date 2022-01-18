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

    // Header
    action: String,
    actionValue: String,
    
    // Items
    transit: Boolean,
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

const itemFieldSchema = new Schema({
    label: String,
    type: String,
    value: String,
    position: String,
    transit: Boolean,
    showLabel: Boolean
});

const subItemSchema = new Schema({
    fields: [itemFieldSchema]
});

const itemSchema = new Schema({
    name: String,
    amount: Number,
    collection: [subItemSchema]
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
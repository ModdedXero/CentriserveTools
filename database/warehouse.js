const Inventory = require("./models/inventory").Inventory;
const Category = require("./models/inventory").Category;
const Field = require("./models/inventory").Field;

const SendMail = require("../utilities/mailer").SendMail;
const Logger = require("../utilities/logger");

// Location Functions

async function GetAllLocations() {
    const locations = await Inventory.find();
    const array = [];
    
    for (const item of locations) {
        array.push(item.location);
    }

    return array;
}

async function GetInventory(location) {
    const inv = await Inventory.findOne({ location: location });
    return inv;
}

async function CreateInventoryLocation(location) {
    let result = false;

    const inv = new Inventory({ location: location });
    await inv.save()
            .then(result = true)
            .catch();

    return result;
}

async function UpdateInventoryLocation(newValue, oldValue) {
    const inv = await Inventory.findOne({ location: oldValue });
    inv.location = newValue;
    await inv.save()
}

async function DeleteInventoryLocation(location) {
    await Inventory.deleteOne({ location: location });
}

// Category Functions

async function GetCategories() {
    const cats = await Category.find();
    return cats;
}

async function GetCategory(category) {
    const cat = await Category.findOne({ name: category });
    return cat;
}

async function CreateCategory(category) {
    let result = false;

    const catFind = await Category.findOne({ name: category });

    if (catFind) return false;

    const cat = new Category({ 
        name: category, 
        nameField: new Field({
            label: "Name",
            position: "Top Left",
            header: true,
            item: true,
            addItem: true,
            showLabel: false,
            action: "None"
    })});

    await cat.save().then(result = true);

    return result;
}

async function UpdateCategory(newValue, oldValue) {
    await Category.findOneAndUpdate(
        { name: oldValue.name }, newValue, { new: true }
    );
}

async function DeleteCategory(category) {
    await Category.findOneAndDelete({ name: category });
}

// Field Functions

async function GetFields(category) {
    const cat = await Category.findOne({ name: category });

    return [cat.nameField, ...cat.fields];
}

async function CreateField(category, field) {
    const cat = await Category.findOne({ name: category });

    if (cat.fields.filter(e => e.label === field).length > 0) return false;

    cat.fields.push({ label: field });
    await cat.save();
}

async function UpdateField(category, newValue, oldValue) {
    const cat = await Category.findOne({ name: category });

    if (oldValue.label === "Name") {
        cat.nameField = newValue;
        await cat.save();
        return;
    }

    const fields = cat.fields;

    for (let i = 0; i < fields.length; i++) {
        if (fields[i].label === oldValue.label) {
            fields[i] = newValue;
        }
    }

    cat.fields = fields;
    await cat.save();
}

async function DeleteField(category, field) {
    const cat = await Category.findOne({ name: category });
    const fields = cat.fields;
    const retFields = [];

    for (let i = 0; i < fields.length; i++) {
        if (fields[i].label !== field) {
            retFields.push(fields[i]);
        }
    }

    cat.fields = retFields;
    await cat.save();
}

// Frontend Functions

async function GetInventoryCategories(location) {
    const inv = await Inventory.findOne({ location: location });
    return inv.categories;
}

async function CreateInventoryItem(location, category, newItem) {
    const inv = await Inventory.findOne({ location: location });
    let catIndex = -1;

    for (let i = 0; i < inv.categories.length; i++) {
        if (inv.categories[i].name === category.name) catIndex = i;
    }
    if (catIndex === -1) catIndex = inv.categories.push({ name: category.name, collapsed: category.collapsed }) - 1;
    
    // Collection added find item to group under
    let itemIndex = -1;
    for (let i = 0; i < inv.categories[catIndex].items.length; i++) {
        if (inv.categories[catIndex].items[i].name === newItem.name) itemIndex = i;
    }
    if (itemIndex === -1) itemIndex = inv.categories[catIndex].items.push({ name: newItem.name }) - 1;

    if (category.collapsed && newItem.amount) {
        inv.categories[catIndex].amount =+ newItem.amount;
        inv.categories[catIndex].items[itemIndex].amount =+ newItem.amount;
        if (!inv.categories[catIndex].items[itemIndex].collection.length) inv.categories[catIndex].items[itemIndex].collection.push(newItem);
    } else {
        inv.categories[catIndex].items[itemIndex].collection.push(newItem);
    }

    await inv.save();
}

async function CheckoutInventoryItems(location, data, reason, user) {
    let result = false;

    const inv = await Inventory.findOne({ location: location });

    for (let i = 0; i < inv.categories.length; i++) {
        for (const catg of data) {
            if (catg.category === inv.categories[i].name) {
                inv.categories[i].notes.push({ 
                    reason: reason, 
                    username: user,
                    itemData: data
                })

                for (const item of catg.items) {
                    for (let j = 0; j < inv.categories[i].items.length; j++) {
                        if (item.serial) {
                            if (item.serial === inv.categories[i].items[j].serial) {
                                inv.categories[i].items.splice(j, 1);
                            }

                            continue;
                        }

                        if (item.name === inv.categories[i].items[j].name) {
                            inv.categories[i].items[j].amount -= item.amount;
                            if (inv.categories[i].items[j].amount <= 0) {
                                inv.categories[i].items.splice(j, 1);
                            }
                        }
                    }
                }
            }
        }
    }

    inv.save().then(result = true);

    const itemsStr =     
`User: ${user}
    
Location: ${location.toUpperCase()}

Reason:
${reason}

Items:

${data.map((cat) => {
    let retString = `${cat.category.toUpperCase()}\n`
    for (const item of cat.items) {
        retString = retString.concat(`${item.name}    ${item.serial || item.amount}\n`)
    }
    return retString;
})}`

    // Add Email Notification on inventory checkout
    SendMail(process.env.INVENTORY_EMAIL, `Inventory Items Checked Out`, itemsStr);

    return result;
}

exports.GetAllLocations = GetAllLocations;

exports.GetInventory = GetInventory;
exports.CreateInventoryLocation = CreateInventoryLocation;
exports.UpdateInventoryLocation = UpdateInventoryLocation;
exports.DeleteInventoryLocation = DeleteInventoryLocation;

exports.GetCategories = GetCategories;
exports.GetCategory = GetCategory;
exports.CreateCategory = CreateCategory;
exports.UpdateCategory = UpdateCategory;
exports.DeleteCategory = DeleteCategory;

exports.GetFields = GetFields;
exports.CreateField = CreateField;
exports.UpdateField = UpdateField;
exports.DeleteField = DeleteField;

exports.GetInventoryCategories = GetInventoryCategories;
exports.CreateInventoryItem = CreateInventoryItem;

exports.CheckoutInventoryItems = CheckoutInventoryItems;
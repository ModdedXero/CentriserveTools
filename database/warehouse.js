const Inventory = require("./models/inventory");

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

async function GetCategories(location) {
    const inv = await Inventory.findOne({ location: location });
    return inv.categories;
}

async function CreateInventoryCategory(location, category) {
    let result = false;

    const inv = await Inventory.findOne({ location: location });

    if (inv.categories.filter(e => e.name === category).length > 0) return false;

    inv.categories.push({ name: category });
    await inv.save().then(result = true);

    return result;
}

async function UpdateInventoryCategory(location, newValue, oldValue) {
    const inv = await Inventory.findOne({ location: location });

    for (let i = 0; i < inv.categories.length; i++) {
        if (inv.categories[i].name === oldValue) {
            inv.categories[i].name = newValue;
            break;
        }
    }

    await inv.save();
}

async function DeleteInventoryCategory(location, category) {
    const inv = await Inventory.findOne({ location: location });

    const retCats = [];
    for (const cat of inv.categories) {
        if (cat.name !== category) {
            retCats.push(cat);
        }
    }

    inv.categories = retCats;
    await inv.save();
}

// Field Functions

async function GetFields(location, category) {
    const inv = await Inventory.findOne({ location: location });

    return inv.categories[findCatIndexInList(inv.categories, category)].fields;
}

async function CreateField(location, category, field) {
    const inv = await Inventory.findOne({ location: location });
    const cat =  findCatIndexInList(inv.categories, category);

    if (inv.categories[cat].fields.filter(e => e.label === field).length > 0) return false;

    inv.categories[cat].fields.push({ label: field });
    await inv.save();
}

async function UpdateField(location, category, newValue, oldValue) {
    const inv = await Inventory.findOne({ location: location });
    const cat =  findCatIndexInList(inv.categories, category);
    const fields = inv.categories[cat].fields;

    for (let i = 0; i < fields.length; i++) {
        if (fields[i].label === oldValue.label) {
            fields[i] = newValue;
        }
    }

    inv.categories[cat].fields = fields;
    await inv.save();
}

async function DeleteField(location, category, field) {
    const inv = await Inventory.findOne({ location: location });
    const cat =  findCatIndexInList(inv.categories, category);
    const fields = inv.categories[cat].fields;
    const retFields = [];

    for (let i = 0; i < fields.length; i++) {
        if (fields[i].label !== field) {
            retFields.push(fields[i]);
        }
    }

    inv.categories[cat].fields = retFields;
    await inv.save();
}

function findCatIndexInList(categories, category) {
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].name === category) {
            return i;
        }
    }
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
exports.CreateInventoryCategory = CreateInventoryCategory;
exports.UpdateInventoryCategory = UpdateInventoryCategory;
exports.DeleteInventoryCategory = DeleteInventoryCategory;

exports.GetFields = GetFields;
exports.CreateField = CreateField;
exports.UpdateField = UpdateField;
exports.DeleteField = DeleteField;

exports.CheckoutInventoryItems = CheckoutInventoryItems;
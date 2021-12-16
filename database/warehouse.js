const Inventory = require("./models/inventory");

async function GetInventoryByLocation(location) {
    const items = await Inventory.find({ location: location });
    return items;
}

async function CreateNewInventory(item) {
    const checkItem = await Inventory.findOne({
        title: item.title,
        location: item.location
    });

    if (checkItem) return false;

    const newItem = new Inventory();
    newItem.title = item.title;
    newItem.location = item.location;
    newItem.items = [];
    newItem.notes = [];

    await newItem.save();
    return true;
}

async function UpdateInventoryItems(title, location, items) {
    const inventory = await Inventory.findOne({
        title: title,
        location: location
    })


    inventory.items = items;
    await inventory.save();
}

async function UpdateInventoryNotes(title, location, notes) {
    const inventory = await Inventory.findOne({
        title: title,
        location: location
    })

    inventory.notes = notes;
    await inventory.save();
}

exports.GetInventoryByLocation = GetInventoryByLocation;
exports.CreateNewInventory = CreateNewInventory;
exports.UpdateInventoryItems = UpdateInventoryItems;
exports.UpdateInventoryNotes = UpdateInventoryNotes;
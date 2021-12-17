const Inventory = require("./models/inventory");

async function GetAllLocations() {
    const locations = await Inventory.find();
    const array = [];
    for (const item of locations) {
        array.push(item.location);
    }

    return array;
}

async function GetInventoryByLocation(location) {
    const inv = await Inventory.findOne({ location: location });
    return inv;
}

async function CreateNewInventoryLocation(location) {
    let result = false;

    const inv = new Inventory({ location: location });
    await inv.save()
            .then(result = true)
            .catch();

    return result;
}

async function CreateNewInventoryCategory(location, category) {
    let result = false;

    const inv = await Inventory.findOne({ location: location });

    if (inv.categories.filter(e => e.name === category).length > 0) return false;

    inv.categories.push({ name: category });
    await inv.save().then(result = true);

    return result;
}

exports.GetAllLocations = GetAllLocations;
exports.GetInventoryByLocation = GetInventoryByLocation;
exports.CreateNewInventoryLocation = CreateNewInventoryLocation;
exports.CreateNewInventoryCategory = CreateNewInventoryCategory;
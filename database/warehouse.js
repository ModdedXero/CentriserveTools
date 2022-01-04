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

async function AddInventoryCategoryItem(location, category, item) {
    let result = false;

    const inv = await Inventory.findOne({ location: location });

    for (let i = 0; i < inv.categories.length; i++) {
        if (inv.categories[i].name === category) {
            if (inv.categories[i].items.length) {
                for (let j = 0; j < inv.categories[i].items.length; j++) {
                    if (!item.serial && 
                        inv.categories[i].items[j].name === item.name) {
                            console.log("test");
                            inv.categories[i].items[j].amount += parseInt(item.amount);
                    } else {
                        inv.categories[i].items.push(item);
                        break;
                    }
                }
            } else {
                inv.categories[i].items.push(item);
            }
        }
    }

    await inv.save().then(result = true);

    return result;
}

async function UpdateInventoryCategoryItem(location, category, item) {
    let result = false;

    const inv = await Inventory.findOne({ location: location });

    for (let i = 0; i < inv.categories.length; i++) {
        if (inv.categories[i].name === category) {
            if (item.serial) {
                for (let j = 0; j < inv.categories[i].items.length; j++) {
                    if (item._id === inv.categories[i].items[j]._id.toString()) {
                        inv.categories[i].items[j] = item;
                    }
                }
            } else {
                let itemsRet = [];
                for (let j = 0; j < inv.categories[i].items.length; j++) {
                    if (item.name !== inv.categories[i].items[j].name) {
                        itemsRet.push(inv.categories[i].items[j]);
                    }
                }

                for (let k = 0; k < item.amount; k++) {
                    itemsRet.push(item);
                }

                inv.categories[i].items = itemsRet;
            }
        }
    }

    await inv.save().then(result = true);
    return result;
}

async function CheckoutInventoryItems(location, data, reason) {
    let result = false;

    

    return result;
}

exports.GetAllLocations = GetAllLocations;
exports.GetInventoryByLocation = GetInventoryByLocation;
exports.CreateNewInventoryLocation = CreateNewInventoryLocation;
exports.CreateNewInventoryCategory = CreateNewInventoryCategory;
exports.AddInventoryCategoryItem = AddInventoryCategoryItem;
exports.UpdateInventoryCategoryItem = UpdateInventoryCategoryItem;
exports.CheckoutInventoryItems = CheckoutInventoryItems;
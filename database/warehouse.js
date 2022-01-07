const Inventory = require("./models/inventory");
const SendMail = require("../utilities/mailer").SendMail;

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

    console.log(location)
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

    console.log(`Updating Item: ${item.name} | Amount: ${item.amount || item.serial}`)

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

                for (let k = 0; k < inv.categories[i].items.length; k++) {
                    if (inv.categories[i].items[k].name === item.name) {
                        if (parseInt(item.amount) !== 0) {
                            itemsRet.push(item);
                        }
                    } else {
                        itemsRet.push(inv.categories[i].items[k])
                    }
                }

                inv.categories[i].items = itemsRet;
            }
        }
    }

    await inv.save().then(result = true);
    return result;
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
        retString = retString.concat(`${item.name}    ${item.serial || item.amount}`)
    }
    return retString;
})}`

    // Add Email Notification on inventory checkout
    SendMail(process.env.INVENTORY_EMAIL, `Inventory Items Checked Out`, itemsStr);

    return result;
}

exports.GetAllLocations = GetAllLocations;
exports.GetInventoryByLocation = GetInventoryByLocation;
exports.CreateNewInventoryLocation = CreateNewInventoryLocation;
exports.CreateNewInventoryCategory = CreateNewInventoryCategory;
exports.AddInventoryCategoryItem = AddInventoryCategoryItem;
exports.UpdateInventoryCategoryItem = UpdateInventoryCategoryItem;
exports.CheckoutInventoryItems = CheckoutInventoryItems;
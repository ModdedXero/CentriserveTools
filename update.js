const fs = require("./utilities/file_saver");

const auth = require("./database/auth");
const warehouse = require("./database/warehouse");

async function Initialize() {
    const updateFile = await fs.ReadFile("update.json", fs.FileTypes.Update);

    let updateCache = JSON.parse(updateFile ? updateFile : "{}");

    for await (const [update, callback] of Object.entries(Updates)) {
        if (updateCache[update] && !updateCache[update].installed) {
            const result = await callback.callback();
            updateCache[update].installed = result;
        } else if (!updateCache[update]) {
            const result = await callback.callback();
            updateCache[update] = { installed: result };
        }
    }

    await fs.WriteFile("update.json", JSON.stringify(updateCache), fs.FileTypes.Update);
}

const Updates = {
    "Mongo User Init": { callback: async () => { return MongoInitUserUpdate() } },
    "MongoAdminSecurityUpdate": { callback: async () => { return MongoAdminSecurityUpdate() }},
    "Create Mock Inventory": { callback: async () => { return CreateMockInventory()}},
    "Add Mock Inventory Items": { callback: async () => { return AddMockInventoryItems()}},
    "Add Mock Inventory Notes": { callback: async () => { return AddMockInventoryNotes()}},
    "Add Repo Temp Dir": { callback: async () => { return AddRepoTempDir()}},
}

async function MongoInitUserUpdate() {
    if (!await auth.CreateUser("blake@centriserveit.com")) return false;
    if (!await auth.CreateUser("david@centriserveit.com")) return false;
    if (!await auth.CreateUser("jj@centriserveit.com")) return false;
    if (!await auth.CreateUser("tj@centriserveit.com")) return false;
    if (!await auth.CreateUser("ben@centriserveit.com")) return false;
    if (!await auth.CreateUser("oscar@centriserveit.com")) return false;
    if (!await auth.CreateUser("jared@centriserveit.com")) return false;
    return true;
}

async function MongoAdminSecurityUpdate() {
    if (!await auth.SetSecurityLevel("blake@centriserveit.com", 5)) return false;
    return true;
}

async function CreateMockInventory() {
    if (!await warehouse.CreateNewInventory({ title: "Computers", location: "test" })) return false;
    return true;
}

async function AddMockInventoryItems() {
    await warehouse.UpdateInventoryItems("Computers", "test", { name: "Sophos XG", count: 12 })
    return true;
}

async function AddMockInventoryNotes() {
    await warehouse.UpdateInventoryNotes("Computers", "test", { items: [{ name: "Dell SFF", count: 2 }], reason: "Because" })
    return true;
}

async function AddRepoTempDir() {
    await fs.ValidateDir(fs.FileTypes.Temp);
    return true;
}

exports.Initialize = Initialize;
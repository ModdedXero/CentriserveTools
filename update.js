const fs = require("./utilities/file_saver");

const auth = require("./database/auth");

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
    "MongoAdminSecurityUpdate": { callback: async () => { return MongoAdminSecurityUpdate() }}
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

exports.Initialize = Initialize;
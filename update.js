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
    "MongoAdminSecurityUpdate": { callback: async () => { return MongoAdminSecurityUpdate() }},
    "Add Repo Temp Dir": { callback: async () => { return AddRepoTempDir()}},
}

async function MongoInitUserUpdate() {
    await auth.CreateUser("blake@centriserveit.com")
    await auth.CreateUser("david@centriserveit.com")
    await auth.CreateUser("jj@centriserveit.com")
    await auth.CreateUser("tj@centriserveit.com")
    await auth.CreateUser("ben@centriserveit.com")
    await auth.CreateUser("oscar@centriserveit.com")
    await auth.CreateUser("jared@centriserveit.com")
    return true;
}

async function MongoAdminSecurityUpdate() {
    await auth.SetSecurityLevel("blake@centriserveit.com", 5)
    return true;
}

async function AddRepoTempDir() {
    await fs.ValidateDir(fs.FileTypes.Temp);
    return true;
}

exports.Initialize = Initialize;
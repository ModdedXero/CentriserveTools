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
    "JJ Password Reset": { callback: async () => { return JJUpdate() } }
}

async function MongoInitUserUpdate() {
    try {
        auth.CreateUser("blake@centriserveit.com")
        auth.CreateUser("david@centriserveit.com")
        auth.CreateUser("jj@centriserveit.com")
        auth.CreateUser("tj@centriserveit.com")
        auth.CreateUser("ben@centriserveit.com")
        auth.CreateUser("oscar@centriserveit.com")
        auth.CreateUser("jared@centriserveit.com")
        return true;
    } catch {
        return false;
    }
}

async function JJUpdate() {
    try {
        auth.ResetPassword("jj@centriserveit.com");
        return true;
    } catch {
        return false;
    }
}

exports.Initialize = Initialize;
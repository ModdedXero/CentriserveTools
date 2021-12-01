const fs = require("./utilities/file_saver");

const mongo = require("./database/mongo");

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
    "Mongo User Init": { callback: async () => { return MongoInitUserUpdate() } }
}

async function MongoInitUserUpdate() {
    try {
        mongo.CreateUser("blake@centriserveit.com")
        mongo.CreateUser("david@centriserveit.com")
        mongo.CreateUser("jj@centriserveit.com")
        mongo.CreateUser("tj@centriserveit.com")
        mongo.CreateUser("ben@centriserveit.com")
        mongo.CreateUser("oscar@centriserveit.com")
        mongo.CreateUser("jared@centriserveit.com")
        return true;
    } catch {
        return false;
    }
}

exports.Initialize = Initialize;
const { constants } = require("buffer");
const fs = require("fs");

const mongo = require("./database/mongo");

async function Initialize() {
    let updateCache = {};

    fs.access("update.json", (err) => {
        if (err) {
            console.log(err);
            fs.writeFile("update.json", JSON.stringify({}), () => {});
        } else {
            fs.readFile("update.json", (err, data) => {
                if (data) {
                    updateCache = JSON.parse(data);
                }
            });
        }
    });

    for await (const [update, callback] of Object.entries(Updates)) {
        if (updateCache[update] && !updateCache[update].installed) {
            const result = await callback.callback();
            updateCache[update] = { installed: result };
        } else if (!updateCache[update]) {
            const result = await callback.callback();
            updateCache[update] = { installed: result };
        }
    }

    fs.writeFile("update.json", JSON.stringify(updateCache), () => {});
}

const Updates = {
    "Mongo User Init": { callback: async () => { return MongoInitUserUpdate() } },
    "Mongo User Password Reset": { callback: async () => { return MongoUserPasswordReset() } }
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

async function MongoUserPasswordReset() {
    try {
        mongo.ResetPassword("blake@centriserveit.com")
        mongo.ResetPassword("david@centriserveit.com")
        return true;
    } catch {
        return false;
    }
}

exports.Initialize = Initialize;
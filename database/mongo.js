const bcrypt = require("bcrypt");

const User = require("./models/user");

async function ValidateLogin(username, password) {
    let result = 0;

    await User.findOne({ "username": username })
        .then(async doc => {
            if (doc.password) {
                if (await bcrypt.compare(password, doc.password)) {
                    result = 1;
                } else {
                    result = 3;
                }
            } else {
                result = 2;
            }
        })
        .catch(() => { result = 0; })

    return result;
}

async function SavePassword(username, password) {
    let result = false;

    const hashedPass = await bcrypt.hash(password, 10);

    await User.findOne({ "username": username })
        .then(async doc => {
            doc.password = hashedPass;
            await doc.save()
            result = true;
        })

    return result;
}

exports.ValidateLogin = ValidateLogin;
exports.SavePassword = SavePassword;

User.findOne({ "username": "blake@centriserveit.com" })
    .then()
    .catch(() => {
        User.create({ "username": "blake@centriserveit.com"});
        User.create({ "username": "david@centriserveit.com"});
        User.create({ "username": "jj@centriserveit.com"});
        User.create({ "username": "tj@centriserveit.com"});
        User.create({ "username": "ben@centriserveit.com"});
        User.create({ "username": "oscar@centriserveit.com"});
        User.create({ "username": "jared@centriserveit.com"});
    })
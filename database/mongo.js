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

    let user = await User.findOne({ "username": username });
    user.password = hashedPass;
    await user.save()
        .then(doc => { result = true; })

    return result;
}

async function CreateUser(username) {
    User.create({ "username": username })
        .catch(() => {});
}

async function ResetPassword(username) {
    User.findOne({ "username": username })
        .then(async doc => {
            doc.password = ""
            await doc.save();
        })
}

exports.ValidateLogin = ValidateLogin;
exports.SavePassword = SavePassword;
exports.CreateUser = CreateUser;
exports.ResetPassword = ResetPassword;
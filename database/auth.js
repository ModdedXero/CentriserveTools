const bcrypt = require("bcrypt");

const User = require("./models/user");

async function ValidateLogin(username, password) {
    let result = 0;
    let encrypt;
    let security = 0;

    await User.findOne({ "username": username })
        .then(async doc => {
            if (doc.password) {
                if (await bcrypt.compare(password, doc.password)) {
                    encrypt = await bcrypt.genSalt();
                    doc.hash = encrypt;
                    doc.lastLogin = Date.now();
                    security = doc.security;
                    await doc.save();
                    result = 1;
                } else {
                    result = 3;
                }
            } else {
                result = 2;
            }
        })
        .catch(() => { result = 0; })

    if (result !== 1) {
        return Promise.reject(result);
    } else {
        return Promise.resolve([encrypt, security]);
    }
}

async function ValidateEncryptionKey(username, encrypt) {
    let result = false;

    await User.findOne({ "username": username })
            .then(async doc => {
                const loginTime = ((new Date) - doc.lastLogin) < (12 * 60 * 60 * 1000);
                if (doc.hash === encrypt && loginTime) {
                    result = true;
                }
            })
            .catch()

    return result;
}

async function SavePassword(username, password) {
    let result = false;

    const hashedPass = await bcrypt.hash(password, 10);

    await User.findOne({ "username": username })
            .then(async doc => {
                doc.password = hashedPass;
                await doc.save();
                result = true;
            })
            .catch()


    return result;
}

async function CreateUser(username, security=0) {
    let result = false;

    await User.create({
        username: username,
        security: security
    })
    .then(_ => { result = true })
    .catch(() => {});

    return result;
}

async function UpdateUser(data) {
    let result = false;

    await User.findOneAndUpdate({ username: data.username }, data, { new: true })
        .then(result = true)
        .catch()

    return result;
}

async function DeleteUser(username) {
    let result = false;

    await User.findOneAndDelete({ username: username })
            .then(_ => {
                result = true;
            })
            .catch()

    return result;
}

async function ResetPassword(username) {
    let result = false;

    await User.findOne({ "username": username })
        .then(async doc => {
            if (!doc) return;
            doc.password = ""
            await doc.save();
            result = true;
        })
        .catch()

    return result;
}

async function GetAllUsers() {
    const users = [];

    await User.find()
        .then(doc => {
            doc.forEach(usr => {
                users.push(usr);
            })
        })

    return users;
}

async function SetSecurityLevel(username, level) {
    let result = false;

    await User.findOne({ username: username })
            .then(async doc => {
                if (!doc) return;

                doc.security = level;
                await doc.save();
                result = true;
            })
            .catch()

    return result;
}

exports.ValidateLogin = ValidateLogin;
exports.ValidateEncryptionKey = ValidateEncryptionKey;
exports.SavePassword = SavePassword;
exports.CreateUser = CreateUser;
exports.UpdateUser = UpdateUser;
exports.DeleteUser = DeleteUser;
exports.ResetPassword = ResetPassword;
exports.GetAllUsers = GetAllUsers;
exports.SetSecurityLevel = SetSecurityLevel;
const bcrypt = require("bcrypt");
const Logger = require("../utilities/logger");

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
                    Logger.Info(`User ${username} validated.`, "AUTH");
                    result = 1;
                } else {
                    Logger.Warn(`User ${username} incorrect password entered.`, "AUTH");
                    result = 3;
                }
            } else {
                Logger.Info(`User ${username} needs to register password.`, "AUTH");
                result = 2;
            }
        })
        .catch(() => { 
            result = 0;
            Logger.Error(`User ${username} does not exist.`, "AUTH");
        })

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
                    Logger.Info(`User ${username} validated 2FA encryption.`, "AUTH");
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
                Logger.Info(`User ${username} password saved.`, "AUTH");
            })
            .catch(Logger.Error(`User ${username} does not exist.`, "AUTH"))


    return result;
}

async function CreateUser(username, security=0) {
    let result = false;

    await User.create({
        username: username,
        security: security
    })
    .then(_ => { 
        result = true;
        Logger.Info(`User ${username} has been created.`, "AUTH");
    })
    .catch(() => {
        Logger.Warn(`User ${username} could not be created.`, "AUTH");
    });

    return result;
}

async function UpdateUser(data) {
    let result = false;

    await User.findOneAndUpdate({ username: data.username }, data, { new: true })
        .then(_ => {
            result = true;
            Logger.Info(`User ${data.username} has been updated.`, "AUTH");
        })
        .catch()

    return result;
}

async function DeleteUser(username) {
    let result = false;

    await User.findOneAndDelete({ username: username })
            .then(_ => {
                result = true;
                Logger.Info(`User ${data.username} has been deleted.`, "AUTH");
            })
            .catch(Logger.Error(`User ${username} does not exist.`, "AUTH"))

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
            Logger.Info(`User ${username} password reset.`, "AUTH")
        })
        .catch(Logger.Error(`User ${username} does not exist.`, "AUTH"))

    return result;
}

async function GetAllUsers() {
    return await User.find();
}

async function SetSecurityLevel(username, level) {
    let result = false;

    await User.findOne({ username: username })
            .then(async doc => {
                if (!doc) return;

                doc.security = level;
                await doc.save();
                result = true;
                Logger.Info(`User ${username} security level set to ${level}.`, "AUTH")
            })
            .catch(Logger.Error(`User ${username} does not exist.`, "AUTH"))

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
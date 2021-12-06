const fs = require("fs/promises");
const path = require("path");

async function WriteFile(fileName, data, type) {
    let result = false;
    await fs.mkdir(type + "\\", { recursive: true });
    await fs.writeFile(`${type}/${fileName}`, data, "utf-8")
            .then(data => { result = true; })

    return result;
}

async function ReadFile(fileName, type) {
    let rFile = "";

    await fs.access(`${type}/${fileName}`)
        .then(async err => {
            rFile = await fs.readFile(`${type}/${fileName}`, "utf-8")
        })
        .catch(err => {
            rFile = undefined;
        })

    return rFile;
}

async function IsFile(fileName, type) {
    let file = "";

    await fs.access(`${type}/${fileName}`)
            .then(_ => {
                file = `${type}\\${fileName}`;
            })
            .catch(_ => {
                file = undefined;
            })

    return file;
}

async function ModifiedDate(fileName, type) {
    let date = undefined;

    await fs.stat(`${type}/${fileName}`)
            .then(data => {
                date = data.mtime;
            })

    return date;
}

const FileTypes = {
    Report: path.join(path.dirname(__dirname), "file_repo", "reports"),
    FileStore: path.join(path.dirname(__dirname), "file_repo", "file_store"),
    Update: path.join(path.dirname(__dirname), "file_repo", "updates"),
    Agents: path.join(path.dirname(__dirname), "file_repo", "agents"),
}

exports.WriteFile = WriteFile;
exports.ReadFile = ReadFile;
exports.IsFile = IsFile;
exports.ModifiedDate = ModifiedDate;
exports.FileTypes = FileTypes;
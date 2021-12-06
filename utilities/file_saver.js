const fs = require("fs/promises");
const path = require("path");

const repoPath = process.platform === "win32" 
    ? path.join(path.dirname(__dirname)) 
    : path.dirname(path.basename(__dirname))

async function WriteFile(fileName, data, type) {
    let result = false;
    await fs.mkdir(type + "\\", { recursive: true });
    await fs.writeFile(`${type}/${fileName}`, data, "utf-8")
            .then(data => { result = true; })

    return result;
}

async function ReadFile(fileName, type) {
    let rFile = "";

    console.log(__dirname);
    console.log(path.dirname(__dirname));
    console.log(path.basename(path.dirname(__dirname)));
    console.log(path.dirname(path.basename(path.dirname(__dirname))))
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
    Report: path.join(repoPath, "file_repo", "reports"),
    FileStore: path.join(repoPath, "file_repo", "file_store"),
    Update: path.join(repoPath, "file_repo", "updates"),
    Agents: path.join(repoPath, "file_repo", "agents"),
}

exports.WriteFile = WriteFile;
exports.ReadFile = ReadFile;
exports.IsFile = IsFile;
exports.ModifiedDate = ModifiedDate;
exports.FileTypes = FileTypes;
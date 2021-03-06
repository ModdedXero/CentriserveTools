const fs = require("fs/promises");
const path = require("path");

const repoPath = path.dirname(__dirname);

async function WriteFile(fileName, data, type) {
    let result = false;

    await ValidateDir(type);

    await fs.writeFile(`${type}/${fileName}`, data, "utf-8")
            .then(data => { result = true; })

    return result;
}

async function AppendFile(fileName, data, type) {
    let result = false;

    await ValidateDir(type);

    await fs.appendFile(`${type}/${fileName}`, data, "utf-8")
            .then(data => { result = true; })

    return result;
}

async function ReadFile(fileName, type) {
    let rFile = "";

    if (!await IsFile(fileName, type)) return undefined;
    rFile = await fs.readFile(`${type}/${fileName}`, "utf-8")
    
    return rFile;
}

async function IsFile(fileName, type) {
    let file = "";

    await fs.access(`${type}/${fileName}`)
            .then(_ => {
                file = `${type}/${fileName}`;
            })
            .catch(_ => {
                file = undefined;
            })

    return file;
}

async function ModifiedDate(fileName, type) {
    let date = undefined;

    if (!await IsFile(fileName, type)) return undefined;

    await fs.stat(`${type}/${fileName}`)
            .then(data => {
                date = data.mtime;
            })

    return date;
}

async function FileTree(type) {
    await ValidateDir(FileTypes.FileStore);
    return await sortTree(type);
}

async function sortTree(dir) {
    const tree = {};
    const dirents = await fs.readdir(dir, { withFileTypes: true });

    for (const dirent of dirents) {
        const resDir = path.resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            tree[dirent.name] = await sortTree(resDir)
        } else {
            tree[dirent.name] = dirent.name;
        }
    }

    return tree;
}

async function ValidateDir(type) {
    let result = false;

    await fs.access(type)
        .then(_ => { result = true })
        .catch(_ => {
            fs.mkdir(type, { recursive: true });
        })

    return result;
}


const FileTypes = {
    Report: path.join(repoPath, "file_repo", "reports"),
    FileStore: path.join(repoPath, "file_repo", "file_store"),
    Update: path.join(repoPath, "file_repo", "updates"),
    Agents: path.join(repoPath, "file_repo", "agents"),
    Logs: path.join(repoPath, "file_repo", "logs"),
    Temp: path.join(repoPath, "file_repo", "temp")
}

exports.WriteFile = WriteFile;
exports.AppendFile = AppendFile;
exports.ReadFile = ReadFile;
exports.IsFile = IsFile;
exports.ModifiedDate = ModifiedDate;
exports.FileTree = FileTree;
exports.ValidateDir = ValidateDir;
exports.FileTypes = FileTypes;
const fs = require("../../utilities/file_saver");
const uuid = require("uuid").v4;

async function GenerateFileTree(force) {
    if (!force && await fs.IsFile("tree.index", fs.FileTypes.FileStore)) return;

    const fileTree = await fs.FileTree(fs.FileTypes.FileStore);
    const indexedTree = await indexBranch(fileTree, "", 
        (await fs.IsFile("tree.index", fs.FileTypes.FileStore) ?
            await GetRepoFileTree() : undefined));

    await fs.WriteFile("tree.index", JSON.stringify(indexedTree), fs.FileTypes.FileStore);
}

async function indexBranch(tree, path, currentIndex=undefined) {
    const indexedTree = {};

    for (const [key, value] of Object.entries(tree)) {
        if (key !== "tree.index") indexedTree[key] = {};

        if (typeof(value) !== "string") {
            indexedTree[key].type = "dir";
            indexedTree[key].name = key;
            indexedTree[key].path = path + "/" + key;
            indexedTree[key].content = await indexBranch(value, path + "/" + key, currentIndex);
        } else if (key !== "tree.index") {
            indexedTree[key].type = "file";
            indexedTree[key].content = value;
            indexedTree[key].id = checkForID(`${path}/${value}`, value, currentIndex);
            indexedTree[key].path = path;
        }
    }

    return indexedTree;
}

function checkForID(path, content, tree) {
    if (!tree) return uuid();

    const prop = getDecsendantProp(tree, path.split("/").splice(1));
    
    if (prop && prop.content === content) {
        return prop.id;
    }

    return uuid();
}

function getDecsendantProp(obj, array) {
    let target = obj;

    for (const prop of array) {
        if (target[prop] && typeof(target[prop].content) !== "string") {
            target = target[prop].content;
        } else {
            target = target[prop];
        }
    }

    return target ? target : undefined;
}

async function GetRepoFileTree() {
    await GenerateFileTree();
    return JSON.parse(await fs.ReadFile("tree.index", fs.FileTypes.FileStore));
}

async function DownloadFile(res, uuid) {
    const tree = JSON.parse(await fs.ReadFile("tree.index", fs.FileTypes.FileStore));
    const fPath = findFile(tree, uuid);

    if (fPath) {
        res.download(fs.FileTypes.FileStore + fPath, fPath.split("/")[-1])
    } else {
        res.json({ response: "Failed to find file" })
    }
}

function findFile(tree, uuid) {
    for (const key in tree) {
        const branch = tree[key];
        if (branch.type === "dir") {
            const test = findFile(branch.content, uuid);
            if (test) return test;
        } else if (branch.id === uuid) {
            return branch.path + "/" + branch.content;
        }
    }

    return undefined;
}

async function SaveFile(file, path) {
    let result = false;

    const dir = fs.FileTypes.FileStore + "/" + path.replaceAll(",", "/");

    file.mv(`${dir}/${file.name}`, (err) => {
        if (err) {
            console.log(err)
            result = false;
        } else {
            result = true;
        }
    });

    await GenerateFileTree(true);
    return result;
}

async function CreateFolder(folderName, path) {
    const result = await fs.ValidateDir(`${fs.FileTypes.FileStore}/${path.join("/")}/${folderName}`);
    await GenerateFileTree(true);

    return result;
}

exports.GenerateFileTree = GenerateFileTree;
exports.GetRepoFileTree = GetRepoFileTree;
exports.DownloadFile = DownloadFile;
exports.SaveFile = SaveFile;
exports.CreateFolder = CreateFolder;
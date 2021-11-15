const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://centriserve-tools.appspot.com"
});

const bucket = admin.storage().bucket();

async function UploadFile(filePath, newFilePath) {
    await bucket.upload(filePath, {
        destination: newFilePath
    })

    UploadFile().catch(console.error);
}

async function DownloadFile(filePath, newFilePath) {
    return await bucket.file(filePath).download({destination: newFilePath});
}

exports.UploadFile = UploadFile;
exports.DownloadFile = DownloadFile;
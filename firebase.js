const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert({
        "type": process.env.FIREBASE_TYPE,
        "project_id": process.env.FIREBASE_PROJECT_ID,
        "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
        "private_key": process.env.FIREBASE_PRIVATE_KEY,
        "client_email": process.env.FIREBASE_CLIENT_EMAIL,
        "client_id": process.env.FIREBASE_CLIENT_ID,
        "auth_uri": process.env.FIREBASE_AUTH_URI,
        "token_uri": process.env.FIREBASE_TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER,
        "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT
      }),
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
const admin = require("firebase-admin");
const config = require("./config");

const db = admin.initializeApp({
    credential: admin.credential.cert(config.serviceAccountKey),
    databaseURL: config.firebaseurl
  });

module.exports = db;

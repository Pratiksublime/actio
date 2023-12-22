
var admin = require("firebase-admin");
let iosAdmin = require("firebase-admin");
var serviceAccount1 = require("./actioFB.json");
var serviceAccount2 = require("./iosSecret.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount1),
  databaseURL: "https://actio-c72c6.firebaseio.com"
});

iosAdmin.initializeApp({
  credential: iosAdmin.credential.cert(serviceAccount2),
  databaseURL: "https://actio-c72c6.firebaseio.com"
}, 'iosAdmin');

module.exports = { admin, iosAdmin }
const mongoose = require("mongoose");
const colors=require("colors")
//const url = "mongodb://18.117.233.92/academy";

// MongoDB connection and query function

const username = encodeURIComponent("sublime_dev_admin");
const password = encodeURIComponent("7037e7dc02b184faac787bfe517765f3bcf695f5155a078d366c0932c422d0d4");
const clusterUrl = "3.142.239.32:27017";
const authMechanism = "DEFAULT";
const authSource = "actio_academy";
const url = `mongodb://${username}:${password}@${clusterUrl}/${authSource}?authMechanism=${authMechanism}&authSource=${authSource} `;


mongoose.connect(url);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("MongoDB connected successfully".blue);
});

const queryMongo = (model, filter) => {
  return model.find(filter).exec();
};
mongoose.set("debug",true)

module.exports = {
  
  queryMongo,mongoose
};



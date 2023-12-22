const mongoose = require("mongoose");
const colors=require("colors")
const url = "mongodb://0.0.0.0:27017/demo";

// MongoDB connection and query function
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: false,
//   user: process.env.DB_USER,
//   pass: process.env.DB_PASSWORD,
//   authSource: process.env.DB,
//   dbName: process.env.DB,
});

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



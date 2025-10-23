const mongoose = require("mongoose");
require("dotenv").config();

const mongoURL = process.env.DB_URL;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

//event listeners
db.on("connected", () => {
  console.log("Mongoose default connection is open");
});

db.on("error", (err) => {
  console.log("Mongoose default connection has occurred: " + err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

module.exports = db;

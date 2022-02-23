const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const SauceRoutes = require("./routes/Sauce");
const userRoutes = require("./routes/user");

require('dotenv').config();
const mongoose = require('mongoose');
const mongo = process.env.DATABASE_URL
mongoose.connect(mongo);
const database = mongoose.connection
database.on('error', (error) => {
  console.log(error)
})
database.once('connected', () => {
  console.log('Database Connected');
})

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", SauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;

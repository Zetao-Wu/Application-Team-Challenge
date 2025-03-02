const express = require("express");
const cors = require("cors"); 
const { participants } = require("./data");

const app = express();

app.use(cors());

app.get("/participants", (_, res) => {
  res.json(participants);
});

module.exports = { app };
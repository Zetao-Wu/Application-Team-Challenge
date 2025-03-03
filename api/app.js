const express = require("express");
const cors = require("cors"); 
const { participants } = require("./data");

const app = express();

app.use(cors());
app.use(express.json()); 

app.get("/", (_, res) => {
  res.json(participants);
});

module.exports = { app };

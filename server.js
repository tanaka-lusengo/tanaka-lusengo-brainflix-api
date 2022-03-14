require("dotenv").config();
const express = require("express");
const app = express();
const fs = require("fs");
const videoRoute = require("./routes/videos");
app.use(express.static("public/images"));
const cors = require("cors");

// const PORT = process.env.PORT || 4040; - not working....
const PORT = 8080 || 4040;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Tanaka's BrainFlix Server!");
});

app.use("/videos/", videoRoute);

app.listen(PORT, () => {
  console.log(`BrainFlix server api listening on http://localhost:${PORT}`);
});

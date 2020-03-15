const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

// app.get("/", (req, res) => res.send("Hello World!"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./src/index.html"));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.use("/src", express.static("src"));

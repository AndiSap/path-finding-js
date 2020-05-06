const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const favicon = require("serve-favicon");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.use("/src", express.static(__dirname + "/src"));
app.use(favicon(path.join(__dirname, "/favicon.ico")));

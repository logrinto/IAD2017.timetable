var express = require("express");
var app = express();
var port = 4040;
var fs = require("fs");
var yaml = require("js-yaml");

const path = "../src/data/IAD2017others/";
// const path = "./public/";
const filename = "semester01"; // no postfix
// const filename = "db"; // no postfix

app.use(express.static("public"));
app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/save", function(req, res) {
  saveToPublicFolder(req.body, function(err) {
    if (err) {
      res.status(404).send("not saved");
      return;
    }

    res.send("saved");
  });
});

function saveToPublicFolder(data, callback) {
  // save as yaml
  fs.writeFile(path + filename + ".yaml", yaml.safeDump(data), callback);

  // to save as json
  // fs.writeFile(path + filename + ".json", JSON.stringify(data), callback);
}

app.listen(port, function() {
  console.log("server up and running at port: %s", port);
});

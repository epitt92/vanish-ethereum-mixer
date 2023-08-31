const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
// const http = require("http").Server(app);
app.use(express.static("public"));
const path = require("path");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const router = express.Router();
// require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: "*",
  })
);

router.use(require("./routes"));

app.use("/api/", router); // path must route to lambda
app.use(express.static(path.join(__dirname, "../build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build"));
});
app.use(express.json());
app.listen(port, () => {});

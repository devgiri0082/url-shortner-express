let http = require("http");
let fs = require("fs");
const express = require("express");
let mongoose = require("mongoose");
const app = express();
let {
  shortenTheUrl,
  shortUrl,
  longUrl,
} = require("./Controller/urlController");
app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));
(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/url", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
})();
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/Views/index.html`);
});
app.get(/\/.+/, async (req, res) => {
  let data = await longUrl(req.url.slice(1));
  if (data) {
    res.redirect(data.givenUrl);
  }
  res.sendFile(`${__dirname}/Views/pageNotFound.html`);
});
app.post("/shorten-link", async (req, res) => {
  let givenUrl = req.body.url;
  await shortenTheUrl(givenUrl);
  let currentUrl = givenUrl;
  let newUrl = await shortUrl(givenUrl);
  //   changeData(currentUrl, newUrl);
  console.log(`${givenUrl}, localhost:3000/${newUrl}`);
  console.log();
  res.sendFile(`${__dirname}/Views/shortUrl.html`);
});
app.listen(3000, () => {
  console.log("listening to port 3000");
});

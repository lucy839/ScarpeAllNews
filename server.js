// Dependencies
var express = require("express");
var mongoose = require("mongoose");

// Our scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;
// Require all models
var db = require("./models");

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
app.use(express.static("public"));

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });
require("./routes/apiRoutes")(app);

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });

  app.get("/", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
   res.render("index");
  });

  
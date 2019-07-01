// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
// Our scraping tools
var axios = require("axios");
var cheerio = require("cheerio");
var path = require('path');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;
// Require all models
var db = require("./models");

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main",partialsDir: path.join(__dirname, "/views/layouts/partials") }));
app.set("view engine", "handlebars");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scrapeAllNews", { useNewUrlParser: true });
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  // app.get("/scrape", function (req, res) {
  //   // First, we grab the body of the html with axios
  //   axios.get("https://www.nytimes.com/column/global-health").then(function (response) {
  //     // Then, we load that into cheerio and save it to $ for a shorthand selector
  //     var $ = cheerio.load(response.data);
  //     // var results = [];
  //     // Now, we grab every h2 within an article tag, and do the following:
  //     $(".css-ye6x8s").each(function (i, element) {
  //       // var results = {};

  //       // Add the text and href of every link, and save them as properties of the result object
  //       // results.title = $(element)
  //       //   .find("h2").text();
  //       // results.summary = $(element).find("p").text();
  //       // results.link = "https://www.nytimes.com" + $(element).children("a").attr("href");
  //       // results.img = $(element).find("figure").attr("itemid");

  //       // var time = $(element).find("time").text();

  //       var title = $(element).find("h2").text();
  //       var summary = $(element).find("p").text();
  //       var link = $(element).find("a").attr("href");
  //       var img = $(element).find("figure").attr("itemid");
  //       var results = {
  //         // time: time,
  //         title: title,
  //         summary: summary,
  //         link: "https://www.nytimes.com" + link,
  //         img: img,
  //         saved: false
  //       };
  //       db.Article.create(results)
  //         .then(function (dbArticle) {
  //           // View the added result in the console
  //           console.log(dbArticle);
  //           // res.json("done");
         
  //         })
  //         .catch(function (err) {
  //           // If an error occurred, log it
  //           console.log(err);
  //         });
  //       // Save these results in an object that we'll push into the results array we defined earlier
  //       // if (title && summary && link && img) {
  //       // Insert the data in the scrapedData db
  //       // db.scrapedData.insert({
  //       //   title: title,
  //       //   summary: summary,
  //       //   link: "https://www.nytimes.com" + link,
  //       //   img: img
  //       // },
  //       //   function (err, inserted) {
  //       //     if (err) {
  //       //       // Log the error if one is encountered during the query
  //       //       console.log(err);
  //       //     }
  //       //     else {
  //       //       // Otherwise, log the inserted data
  //       //       console.log(inserted);
  //       //     }
  //       //   });
  //       // }


  //       // console.log(element)
  //     });
  //     // res.redirect("/")
  //     // // Log the results once you've looped through each of the elements found with cheerio
  //     // console.log(results);
  //     res.send("Scrape Complete");
  //   });
    
  //   // dolocation.reload();
  //   // res.redirect("/")
  //   // console.log("")
  //   // alert("Scrape Complete");
  //   // res.send("Scrape Complete");

  // });
  // // Retrieve data from the db
  // app.get("/articles", function (req, res) {
  //   // Find all results from the scrapedData collection in the db
  //   // db.scrapedData.find({}, function (error, found) {
  //   //   // Throw any errors to the console
  //   //   if (error) {
  //   //     console.log(error);
  //   //   }
  //   //   // If there are no errors, send the data to the browser as json
  //   //   else {
  //   //     var hbsObject = {
  //   //       news: found
  //   //     };
  //   //     console.log(found)
  //   //     res.render("index", hbsObject );
  //   //     // res.json(found);
  //   //     // res.render("index");
  //   //   }
  //   // });
  //   // });
  //   db.Article.find({})
  //     .then(function (dbArticle) {
  //       // If we were able to successfully find Articles, send them back to the client
  //       res.json(dbArticle);
  //       // console.log("hi")
  //     })
  //     .catch(function (err) {
  //       // If an error occurred, send it to the client
  //       res.json(err);
  //     });
  // });
  // app.get("/articlesSaved/:id", function (req, res) {
  //   // yModel.where('_id', id).update({$set: {foo: 'bar'}}
  //   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  //   db.Article.where('_id',req.params.id ).updateOne({$set: {saved:true}})
  //     // ..and populate all of the notes associated with it
  //     .then(function (dbArticle) {
  //         console.log(dbArticle);
  //         // db.Article.update({
  //         //   saved : true
  //         // })
  //         // dbArticle.saved = true;
  //       // If we were able to successfully find an Article with the given id, send it back to the client
  //       res.json(dbArticle);
  //     })
  //     .catch(function (err) {
  //       // If an error occurred, send it to the client
  //       res.json(err);
  //     });
  // });
  // app.post("/articlesSaved", function (req, res) {
  //   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  //   db.Article.find({saved: true })
  //     // ..and populate all of the notes associated with it
  //     .populate("note")
  //     .then(function (dbArticle) {
  //       var hbsObject = {
  //         news: dbArticle
  //       };
  //       // If we were able to successfully find an Article with the given id, send it back to the client
  //       res.render("savedArticles", hbsObject);
  //       console.log(hbsObject)
  //       // sres.json(dbArticle);
  //     })
  //     .catch(function (err) {
  //       // If an error occurred, send it to the client
  //       res.json(err);
  //     });
  // });
  // // Route for grabbing a specific Article by id, populate it with it's note
  // app.get("/articles/:id", function (req, res) {
  //   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  //   db.Article.findOne({ _id: req.params.id })
  //     // ..and populate all of the notes associated with it
  //     .populate("note")
  //     .then(function (dbArticle) {
  //       // If we were able to successfully find an Article with the given id, send it back to the client
  //       res.json(dbArticle);
  //       console.log(dbArticle)
  //     })
  //     .catch(function (err) {
  //       // If an error occurred, send it to the client
  //       res.json(err);
  //     });
  // });

  // app.get("/", function (req, res) {
  //   // TODO: Finish the route so it grabs all of the articles
  //  res.render("index");
  // });

  
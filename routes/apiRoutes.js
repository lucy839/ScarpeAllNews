// Dependencies
const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function (app) {
  // A GET route for displaying everything in article database
  app.get("/", function (req, res) {
    db.Article.find({})
      .then(function (data) {
        var hbsObject = {
          news: data
        };
        res.render("index", hbsObject);
      });
  });

  // ****** add only if new news *******
  // A GET route for scraping the nytimes website
  app.get("/scrape", function (req, res) {
    axios.get("https://www.nytimes.com/section/health").then(function (response) {
      var $ = cheerio.load(response.data);
      var result = "";
      $(".css-ye6x8s").each(function (i, element) {
        var title = $(element).find("h2").text();
        var summary = $(element).find("p").text();
        var link = $(element).find("a").attr("href");
        var img = $(element).find("figure").attr("itemid");
        var results = {
          title: title,
          summary: summary,
          link: "https://www.nytimes.com" + link,
          img: img,
          saved: false
        };

        db.Article.create(results)
          .then(function (response) {
            res.json(response);
          })
          .catch(function (err) {
            console.log(err);
          });
      });
    });

  });


  // A GET route for updating particular article to be saved
  app.get("/articlesSaved/:id", function (req, res) {
    db.Article.where('_id', req.params.id).updateOne({ $set: { saved: true } })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // A GET route for displaying all the saved articles with note populated
  app.get("/articlesSaved", function (req, res) {
    db.Article.find({ saved: true }).populate("note")
      .then(function (dbArticle) {
        res.render("savedArticles", { news: dbArticle });
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // A GET route for deleting particular article
  app.get("/articleDelete/:id", function (req, res) {
    db.Article.where("_id", req.params.id).updateOne({ $set: { saved: false } })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // A GET route for displaying notes of particular article
  app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // A POST route for creating note and link to particular article
  app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
      .then(function (dbNote) {
        return db.Article.updateOne({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // A DELETE route for deleting particular note and pull from the article data
  app.delete("/notesDelete/:id", function (req, res) {
    db.Note.deleteOne({ "_id": req.params.id }, function (err) {
      if (err) {
        res.send(err);
      }
      else {
        db.Article.updateOne({ "note": req.params.id }, { $pull: { "note": req.params.id } })
          .then(function (err) {
            if (err) {
              res.send(err);
            }
            else {
              res.send("Note Deleted");
            }
          });
      }
    });
  });
};
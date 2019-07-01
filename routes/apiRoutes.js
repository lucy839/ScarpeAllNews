const db = require("../models");
// const express = require("express");
// // var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");
// Database configuration
// var databaseUrl = "newsScraper";
// var collections = ["scrapedData"];

// Hook mongojs config to db variable
// var db = mongojs(databaseUrl, collections);


module.exports = function (app) {
  app.get("/", function(req,res){
    db.Article.find({}).then(function(data){
      var hbsObject = {
        news: data
      };
      console.log(data);
      res.render("index", hbsObject);
    });
  });
  // A GET route for scraping the echoJS website
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.nytimes.com/column/global-health").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      // var results = [];
      // Now, we grab every h2 within an article tag, and do the following:
      $(".css-ye6x8s").each(function (i, element) {
        // var results = {};

        // Add the text and href of every link, and save them as properties of the result object
        // results.title = $(element)
        //   .find("h2").text();
        // results.summary = $(element).find("p").text();
        // results.link = "https://www.nytimes.com" + $(element).children("a").attr("href");
        // results.img = $(element).find("figure").attr("itemid");

        // var time = $(element).find("time").text();

        var title = $(element).find("h2").text();
        var summary = $(element).find("p").text();
        var link = $(element).find("a").attr("href");
        var img = $(element).find("figure").attr("itemid");
        var results = {
          // time: time,
          title: title,
          summary: summary,
          link: "https://www.nytimes.com" + link,
          img: img,
          saved: false
        };
        db.Article.create(results)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
            res.json("done");
         
          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
          });
        // Save these results in an object that we'll push into the results array we defined earlier
        // if (title && summary && link && img) {
        // Insert the data in the scrapedData db
        // db.scrapedData.insert({
        //   title: title,
        //   summary: summary,
        //   link: "https://www.nytimes.com" + link,
        //   img: img
        // },
        //   function (err, inserted) {
        //     if (err) {
        //       // Log the error if one is encountered during the query
        //       console.log(err);
        //     }
        //     else {
        //       // Otherwise, log the inserted data
        //       console.log(inserted);
        //     }
        //   });
        // }


        // console.log(element)
      });
      // res.redirect("/")
      // // Log the results once you've looped through each of the elements found with cheerio
      // console.log(results);

    });
    
    // dolocation.reload();
    // res.redirect("/")
    // console.log("")
    // alert("Scrape Complete");
    // res.send("Scrape Complete");

  });
  // Retrieve data from the db
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
  //       console.log("hi")
  //     })
  //     .catch(function (err) {
  //       // If an error occurred, send it to the client
  //       res.json(err);
  //     });
  // });
  app.get("/articlesSaved/:id", function (req, res) {
    // yModel.where('_id', id).update({$set: {foo: 'bar'}}
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.where('_id',req.params.id ).updateOne({$set: {saved:true}})
      // ..and populate all of the notes associated with it
      .then(function (dbArticle) {
          console.log(dbArticle);
          // db.Article.update({
          //   saved : true
          // })
          // dbArticle.saved = true;
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  app.get("/articlesSaved", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.find({ saved: true }).populate("note")
      // ..and populate all of the notes associated with it
      // .populate("note")
      .then(function (dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.render("savedArticles", { news: dbArticle});
        // res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  app.get("/articleDelete/:id", function (req, res) {
    // yModel.where('_id', id).update({$set: {foo: 'bar'}}
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.where('_id',req.params.id ).updateOne({$set: {saved:false}})
      // ..and populate all of the notes associated with it
      .then(function (dbArticle) {
          console.log(dbArticle);
          // db.Article.update({
          //   saved : true
          // })
          // dbArticle.saved = true;
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function (dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
        console.log(dbArticle)
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  app.post("/articles/:id", function(req,res){
    // var newNote = new Note({
    //   body: req.body.text,
    //   article: req.params.id
    // });
    // console.log(req.body)
    // newNote.save(function(error, note){
    //   if(error){
    //     console.log(error);
    //   }
    //   else{
    //     Article.findOneAndUpdate({ "_id": req.params.id}, {$push: { "notes": note } })
    //     .exec(function(err){
    //       if(err){
    //         console.log(err);
    //         res.send(err);
    //       }
    //       else{
    //         res.send(note);
    //       }
    //     });
    //   }
    // });
    console.log("here");
    db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.updateOne({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  });

        // Save an empty result object
        // var result = {};

        // // Add the text and href of every link, and save them as properties of the result object
        // result.title = $(this)
        //     .children("a")
        //     .text();
        // result.link = $(this)
        //     .children("a")
        //     .attr("href");

        //             // Create a new Article using the `result` object built from scraping
        //             db.Article.create(result)
        //                 .then(function (dbArticle) {
        //                     // View the added result in the console
        //                     console.log(dbArticle);
        //                 })
        //                 .catch(function (err) {
        //                     // If an error occurred, log it
        //                     console.log(err);
        //                 });
        //         });

        //         // Send a message to the client
        //         res.send("Scrape Complete");
        //     });
        // });

        // // Route for getting all Articles from the db
        // app.get("/articles", function (req, res) {
        //     // TODO: Finish the route so it grabs all of the articles
        //     db.Article.find({})
        //         .then(function (dbArticle) {
        //             res.json(dbArticle);
        //         })
        //         .catch(function (err) {
        //             res.json(err);
        //         });
        // Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
//   db.Note.create(req.body)
//     .then(function(dbNote) {
//       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function(dbArticle) {
//       // If we were able to successfully update an Article, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });
app.delete("/notesDelete/:id", function(req,res){
  console.log(req.params.id);
	db.Note.deleteOne({"_id": req.params.id}, function(err){
		if(err){
			console.log(err);
			res.send(err);
		}
		else{
			db.Article.updateOne({"note": req.params.id}, {$pull: {"note": req.params.id}})
				.then(function(err){
					if(err){
						console.log(err);
						res.send(err); 
					}
					else{
						res.send("Note Deleted");
					}
				});
		}
	});
});
};
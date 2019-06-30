// const db = require("../models");
const express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");
// Database configuration
var databaseUrl = "newsScraper";
var collections = ["scrapedData"];

// Hook mongojs config to db variable
var db = mongojs(databaseUrl, collections);


module.exports = function (app) {
    // A GET route for scraping the echoJS website
    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.nytimes.com/column/global-health").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
        var results = [];
            // Now, we grab every h2 within an article tag, and do the following:
            $(".css-ye6x8s").each(function (i, element) {
                // var time = $(element).find("time").text();
                var title = $(element).find("h2").text();
                var summary = $(element).find("p").text();
                var link = $(element).find("a").attr("href");
                var img = $(element).find("figure").attr("itemid");
                // Save these results in an object that we'll push into the results array we defined earlier
                if (title && summary && link && img) {
                    // Insert the data in the scrapedData db
                    db.scrapedData.insert({
                        title: title,
                        summary :summary,
                        link: "https://www.nytimes.com" + link,
                        img: img
                    },
                    function(err, inserted) {
                      if (err) {
                        // Log the error if one is encountered during the query
                        console.log(err);
                      }
                      else {
                        // Otherwise, log the inserted data
                        console.log(inserted);
                      }
                    });
                  }
                // results.push({
                //     // time: time,
                //     title: title,
                //     summary :summary,
                //     link: "https://www.nytimes.com" + link,
                //     img: img
                // });
               
                // console.log(element)
            });

            // // Log the results once you've looped through each of the elements found with cheerio
            // console.log(results);
         
        });
        res.send("Scrape Complete");

    });
};
        
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
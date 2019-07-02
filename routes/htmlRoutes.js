module.exports = function (app) {
  // "/"" route will use index handlebars
  app.get("/", function (req, res) {
    res.render("index");
  });
};
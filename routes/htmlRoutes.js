module.exports = function (app) {
app.get('/', function (req, res) {
    res.render("index");
    // find everything by that user 
  });   
 app.get('/articlesSaved', function( req, res){
   res.render("savedArticles");
 })  
};
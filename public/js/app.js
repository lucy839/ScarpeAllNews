// $(document).on("click", "scrape", function() {
// button.on("click",function(){
$("#scrape").on("click", function () {
    console.log("here");
    $.ajax({
        method: "GET",
        dataType: "json",
        url: "/scrape"
    })
        //   // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // console.log("hi")
        });

    // Empty the notes from the note section
    // $("#notes").empty();
    // // Save the id from the p tag
    // var thisId = $(this).attr("data-id");

    // // Now make an ajax call for the Article
    // $.ajax({
    //   method: "GET",
    //   url: "/articles/" + thisId
    // })
    //   // With that done, add the note information to the page
    //   .then(function(data) {
    //     console.log(data);
    // Grab the articles as a json
    // $.getJSON("/articles", function(data) {
    //     // For each one
    //     for (var i = 0; i < data.length; i++) {
    //       // Display the apropos information on the page
    //       $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    //     }
    //   });
});

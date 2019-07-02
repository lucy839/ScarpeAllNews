// Scrape function
$("#scrape").on("click", function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    .then(function (result) {
      if (result == "MongoError") {
        alert("No new News to scrape!")
      } else {
        window.location = "/"
      }

    });
});

// Save article function
$(".save").on("click", function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    dataType: "json",
    url: "/articlesSaved/" + thisId

  })
    .then(function (data) {
      window.location = "/"
    });
});

// Delete saved article function
$(".deleteSaved").on("click", function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    dataType: "json",
    url: "/articleDelete/" + thisId
  })
    .then(function (data) {
      window.location = "/articlesSaved"
    });
});

// Save note function
$(".saveNote").on("click", function () {
  var thisId = $(this).attr("data-id");
  if (!$("#noteText" + thisId).val()) {
    alert("please enter a note to save")
  } else {
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        body: $("#noteText" + thisId).val()
      }
    }).then(function (data) {
      $("#noteText" + thisId).val("");
      $('.modalNote').modal("hide"); $('body').removeClass('modal-open'); $('.modal-backdrop').remove();
      window.location = "/articlesSaved"

    });
  }
});

// Delete note function
$(".deleteNote").on("click", function () {
  var noteId = $(this).attr("data-note-id");
  $.ajax({
    method: "DELETE",
    url: "/notesDelete/" + noteId
  }).then(function (data) {
    $('.modalNote').modal("hide"); $('body').removeClass('modal-open'); $('.modal-backdrop').remove();
    window.location = "/articlesSaved"
  })
});

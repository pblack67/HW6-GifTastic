var subjects = ["lions", "tigers", "bears"];

var giphyAPI = "https://api.giphy.com/v1/gifs/search?api_key=AtGUXnRVIUl0BcpMsuJfGwW6O7jLnt2G&limit=10&q="

function subjectButtonClicked(event) {
    console.log(this);
    $("#gifs").empty();
    var giphyURL = giphyAPI + $(this).attr("data-name");
    $.get(giphyURL).then(function (response) {
        var data = response.data;
        for (var i = 0; i < data.length; i++) {
            console.log(data[i].images.fixed_height.url);
            var image = $("<img>").attr("src", data[i].images.fixed_height.url);
            $("#gifs").append(image);
        }
    });
}

function createButtons() {
    $("#buttonList").empty();
    for (var i = 0; i < subjects.length; i++) {
        var newButton = $("<button>").
            text(subjects[i]).
            addClass("btn btn-primary subjectButton").
            attr("data-name", subjects[i]);
        $("#buttonList").append(newButton);
    }
    $(".subjectButton").on("click", subjectButtonClicked);
}

function addButtonClicked(event) {
    console.log("addButtonClicked");
    event.preventDefault();
    var buttonName = $("#subjectName").val();
    if (subjects.indexOf(buttonName) === -1) {
        subjects.push(buttonName);
    }
    createButtons();
}

// When dom is ready 
$(function () {
    $("#addButton").on("click", addButtonClicked);

    createButtons();
});
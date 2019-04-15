var subjects = ["lions", "tigers", "bears", "dogs", "cats", "hamsters", "gerbils", "squirrels", "wombats", "kangaroos"];

var giphyAPI = "https://api.giphy.com/v1/gifs/search?api_key=AtGUXnRVIUl0BcpMsuJfGwW6O7jLnt2G&limit=10&q="

function imageClicked() {
    if ($(this).attr("data-state") === "still") {
        $(this).attr("data-state", "animated");
        $(this).attr("src", $(this).attr("data-animated"));
    } else {
        $(this).attr("data-state", "still");
        $(this).attr("src", $(this).attr("data-still"));
    }
}

function subjectButtonClicked(event) {
    var giphyURL = giphyAPI + $(this).attr("data-name");
    $.get(giphyURL).then(function (response) {
        console.log(response);
        var data = response.data;
        for (var i = 0; i < data.length; i++) {
            var animatedURL = data[i].images.fixed_height.url;
            var stillURL = data[i].images.fixed_height_still.url;
            var stillImage = $("<img>").attr("src", stillURL).
                attr("data-still", stillURL).
                attr("data-animated", animatedURL).
                attr("data-state", "still");
            $("#gifs").prepend(stillImage);
            stillImage.on("click", imageClicked);
        }
    });
}

function createButtons() {
    $("#buttonList").empty();
    for (var i = 0; i < subjects.length; i++) {
        var newButton = $("<button>").
            text(subjects[i]).
            addClass("btn btn-primary subjectButton m-2").
            attr("data-name", subjects[i]);
        $("#buttonList").append(newButton);
    }
    $(".subjectButton").on("click", subjectButtonClicked);
}

function addButtonClicked(event) {
    event.preventDefault();
    var buttonName = $("#subjectName").val();
    if (buttonName !== "") {
        if (subjects.indexOf(buttonName) === -1) {
            subjects.push(buttonName);
        }
    }
    createButtons();
    $("#subjectName").val("");
}

function clearButtonClicked() {
    $("#gifs").empty();
}

// When dom is ready 
$(function () {
    $("#addButton").on("click", addButtonClicked);

    $("#clearButton").on("click", clearButtonClicked);

    createButtons();
});
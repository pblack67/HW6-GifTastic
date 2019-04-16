var subjects = ["lions", "tigers", "bears", "dogs", "cats", "hamsters", "gerbils", "squirrels", "wombats", "kangaroos"];

var giphyAPI = "https://api.giphy.com/v1/gifs/search?api_key=AtGUXnRVIUl0BcpMsuJfGwW6O7jLnt2G&limit=10&rating=g&q="

var subjectDetails = [];
var favorites = [];
var subjectId = 0;

function imageClicked() {
    if ($(this).attr("data-state") === "still") {
        $(this).attr("data-state", "animated");
        $(this).attr("src", $(this).attr("data-animated"));
    } else {
        $(this).attr("data-state", "still");
        $(this).attr("src", $(this).attr("data-still"));
    }
}

function favoriteButtonClicked() {
    console.log("favoriteButtonClicked");
    var id = $(this).attr("data-id");
    var details = null;
    for (var i = 0; i < subjectDetails.length; i++) {
        if (subjectDetails[i].subjectId == id) {
            details = subjectDetails[i];
        }
    }
    if (details !== null) {
        createSubjectCard(details, $("#favorites"), id, true);
        favorites.push(details);
        localStorage.setItem("myFavoriteThings", JSON.stringify(favorites));
    }
}

function createSubjectCard(details, element, id, isFavorite) {
    var stillImage = $("<img>").attr("src", details.stillURL).
        attr("data-still", details.stillURL).
        attr("data-animated", details.animatedURL).
        attr("data-state", "still");

    var bodyText = $("<p>").text("Rating: " + details.bodyText).addClass("card-text");
    var bodyText2 = $("<p>").text("Title: " + details.bodyText2).addClass("card-text");
    var bodyDiv = $("<div>").addClass("card-body");
    bodyDiv.append(bodyText, bodyText2);

    if (!isFavorite) {
        var favoriteButton = $("<button>").
            addClass("btn btn-primary").
            text("Favorite").
            attr("data-id", id);

        favoriteButton.on("click", favoriteButtonClicked);

        bodyDiv.append(favoriteButton);
    }

    var card = $("<div>").addClass("card ml-3 mb-3 mr-3");
    card.append(stillImage);
    card.append(bodyDiv);

    element.prepend(card);
    stillImage.on("click", imageClicked);
}

function subjectButtonClicked(event) {
    var giphyURL = giphyAPI + $(this).attr("data-name");
    $.get(giphyURL).then(function (response) {
        console.log(response);
        var data = response.data;
        for (var i = 0; i < data.length; i++) {
            var details = {
                animatedURL: data[i].images.fixed_height.url,
                stillURL: data[i].images.fixed_height_still.url,
                bodyText: data[i].rating,
                bodyText2: data[i].title,
                subjectId: subjectId
            };

            subjectDetails.push(details);
            createSubjectCard(details, $("#gifs"), subjectId++, false);
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
    subjectDetails.empty();
    subjectId = 0;
}

function loadFavorites() {
    var jsonFavorites = localStorage.getItem("myFavoriteThings");
    favorites = JSON.parse(jsonFavorites);
    for (var i = 0; i < favorites.length; i++) {
        createSubjectCard(favorites[i], $("#favorites"), 0, true);
    }
}

// When dom is ready 
$(function () {
    $("#addButton").on("click", addButtonClicked);

    $("#clearButton").on("click", clearButtonClicked);

    createButtons();
    loadFavorites();
});
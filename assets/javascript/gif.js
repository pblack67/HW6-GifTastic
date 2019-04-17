var subjects = [
    {
        buttonName: "cows",
        apiName: "giphy"
    },
    {
        buttonName: "alien",
        apiName: "omdb"
    },
    {
        buttonName: "rush",
        apiName: "bit"
    }
];

var giphyAPI = "https://api.giphy.com/v1/gifs/search?api_key=AtGUXnRVIUl0BcpMsuJfGwW6O7jLnt2G&limit=10&rating=g&q=";
var omdbAPI = "http://www.omdbapi.com/?apikey=f8e29b5&t=";
var bitAPI = "https://rest.bandsintown.com/artists/"; // + artist + "?app_id=nothing",

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
    var id = $(this).attr("data-id");
    var details = null;
    for (var i = 0; i < subjectDetails.length; i++) {
        if (subjectDetails[i].subjectId == id) {
            details = subjectDetails[i];
        }
    }
    if (details !== null) {
        // Check to see it's not a duplicate
        var isDuplicate = false;
        for (var i = 0; i < favorites.length; i++) {
            if (details.stillURL.trim() == favorites[i].stillURL.trim()) {
                isDuplicate = true;
            }
        }
        if (!isDuplicate) {
            createSubjectCard(details, $("#favorites"), id, true);
            favorites.push(details);
            localStorage.setItem("myFavoriteThings", JSON.stringify(favorites));
        }
    }
}

function createSubjectCard(details, element, id, isFavorite) {
    var stillImage = $("<img>").attr("src", details.stillURL).
        attr("data-still", details.stillURL).
        attr("data-animated", details.animatedURL).
        attr("data-state", "still");

    var bodyText = $("<p>").text(details.title1 + details.bodyText).addClass("card-text");
    var bodyText2;
    if (details.bodyText2.search("http") != -1) {
        bodyText2 = $("<a>").
            attr("href", details.bodyText2).
            attr("target", "_blank");
    } else {
        bodyText2 = $("<p>");
    }
    bodyText2 = bodyText2.
        text(details.title2 + details.bodyText2).
        addClass("card-text");

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

function isSearchDuplicate(details) {
    var isDuplicate = false;
    for (var i = 0; i < subjectDetails.length; i++) {
        if (details.stillURL == subjectDetails[i].stillURL) {
            isDuplicate = true;
        }
    }
    return isDuplicate;
}

function subjectButtonClicked(event) {
    var apiurl;
    var apiName = $(this).attr("data-api");
    if (apiName === "giphy") {
        apiurl = giphyAPI + $(this).attr("data-name");
    } else if (apiName === "omdb") {
        apiurl = omdbAPI + $(this).attr("data-name");
    } else if (apiName === "bit") {
        apiurl = bitAPI + $(this).attr("data-name") + "?app_id=nothing";
    }

    $.get(apiurl).then(function (response) {
        console.log(response);

        if (apiName === "giphy") {
            var data = response.data;
            for (var i = 0; i < data.length; i++) {
                var details;
                details = {
                    animatedURL: data[i].images.fixed_width.url,
                    stillURL: data[i].images.fixed_width_still.url,
                    bodyText: data[i].rating,
                    bodyText2: data[i].title,
                    title1: "Rating: ",
                    title2: "Title",
                    subjectId: subjectId,
                    apiName: apiName
                };
                if (!isSearchDuplicate(details)) {
                    subjectDetails.push(details);
                    createSubjectCard(details, $("#gifs"), subjectId++, false);
                }
            }
        } else if (apiName === "omdb") {
            details = {
                animatedURL: response.Poster,
                stillURL: response.Poster,
                bodyText: response.Actors,
                bodyText2: response.Director,
                title1: "Cast: ",
                title2: "Director: ",
                subjectId: subjectId,
                apiName: apiName
            };
            if (!isSearchDuplicate(details)) {
                subjectDetails.push(details);
                createSubjectCard(details, $("#gifs"), subjectId++, false);
            }
        } else if (apiName === "bit") {
            details = {
                animatedURL: response.thumb_url,
                stillURL: response.thumb_url,
                bodyText: response.name,
                bodyText2: response.facebook_page_url,
                title1: "Band Name: ",
                title2: "Facebook: ",
                subjectId: subjectId,
                apiName: apiName
            };
            if (!isSearchDuplicate(details)) {
                subjectDetails.push(details);
                createSubjectCard(details, $("#gifs"), subjectId++, false);
            }
        }

    });
}

function createButtons() {
    $("#buttonList").empty();
    for (var i = 0; i < subjects.length; i++) {
        var newButton = $("<button>").
            text(subjects[i].buttonName).
            addClass("btn btn-primary subjectButton mr-2 mb-2").
            attr("data-name", subjects[i].buttonName).
            attr("data-api", subjects[i].apiName);
        $("#buttonList").append(newButton);
    }
    $(".subjectButton").on("click", subjectButtonClicked);
}

function addButtonClicked(event) {
    event.preventDefault();
    var buttonName = $("#subjectName").val();
    var apiName = $("#apiDropDown").val();
    if (buttonName !== "") {

        // if (subjects.indexOf(buttonName) === -1) {
        subjects.push({
            buttonName: buttonName,
            apiName: apiName
        });
        // }
    }
    createButtons();
    $("#subjectName").val("");
}

function clearSearchButtonClicked() {
    $("#gifs").empty();
    subjectDetails = [];
    subjectId = 0;
}

function clearFavoritesButtonClicked() {
    $("#favorites").empty();
    favorites = [];
    localStorage.setItem("myFavoriteThings", JSON.stringify(favorites));
}

function loadFavorites() {
    var jsonFavorites = localStorage.getItem("myFavoriteThings");
    favorites = JSON.parse(jsonFavorites);
    if (favorites != null) {
        for (var i = 0; i < favorites.length; i++) {
            createSubjectCard(favorites[i], $("#favorites"), 0, true);
        }
    } else {
        favorites = [];
    }
}

function dropdownItemClicked() {
    var val = $(this).val();
    var text = $(this).text();
    $("#apiDropDown").val(val).text(text);
}

// When dom is ready 
$(function () {
    $("#addButton").on("click", addButtonClicked);

    $("#clearSearchButton").on("click", clearSearchButtonClicked);
    $("#clearFavoritesButton").on("click", clearFavoritesButtonClicked);

    $(".dropdown-item").on("click", dropdownItemClicked);

    createButtons();
    loadFavorites();
});
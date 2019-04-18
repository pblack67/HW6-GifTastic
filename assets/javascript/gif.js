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

function saveFavorites() {
    localStorage.setItem("myFavoriteThings", JSON.stringify(favorites));
}

function readFavorites() {
    return localStorage.getItem("myFavoriteThings");
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
        if (!isDuplicate(details, favorites)) {
            createSubjectCard(details, $("#favorites"), id, true);
            favorites.push(details);
            saveFavorites();
        }
    }
}

function createSubjectCard(details, element, id, isFavorite) {
    var stillImage = $("<img>").attr("src", details.stillURL).
        attr("data-still", details.stillURL).
        attr("data-animated", details.animatedURL).
        attr("data-state", "still");

    var bodyDiv = $("<div>").addClass("card-body");

    for (var i = 0; i < details.body.length; i++) {
        var bodyItem = details.body[i];
        var bodyText;
        if (bodyItem.bodyText.search("http") != -1) {
            bodyText = $("<a>").
                attr("href", bodyItem.bodyText).
                attr("target", "_blank").
                text(bodyItem.title).
                addClass("card-text");
        } else {
            bodyText = $("<p>").
                text(bodyItem.title + bodyItem.bodyText).
                addClass("card-text");
        }



        bodyDiv.append(bodyText);
    }


    if (!isFavorite) {
        var favoriteButton = $("<button>").
            addClass("btn btn-primary").
            text("Favorite").
            attr("data-id", id);

        favoriteButton.on("click", favoriteButtonClicked);

        bodyDiv.append(favoriteButton);
    }

    var card = $("<div>").addClass("card ml-3 mb-3 mr-3")
        .append(stillImage)
        .append(bodyDiv);

    element.prepend(card);
    stillImage.on("click", imageClicked);
}

function isDuplicate(details, detailArray) {
    for (var i = 0; i < detailArray.length; i++) {
        if (details.stillURL == detailArray[i].stillURL) {
            return true;
        }
    }
    return false;
}

function addSubject(details) {
    if (!isDuplicate(details, subjectDetails)) {
        subjectDetails.push(details);
        createSubjectCard(details, $("#gifs"), subjectId++, false);
    }
}

function addPicture(data, apiName) {
    var details = {
        animatedURL: data.images.fixed_width.url,
        stillURL: data.images.fixed_width_still.url,
        body: [
            {
                title: "Rating: ",
                bodyText: data.rating
            },
            {
                title: "Title: ",
                bodyText: data.title
            }
        ],
        subjectId: subjectId,
        apiName: apiName
    };
    addSubject(details);
}

function addMovie(data, apiName) {
    var details = {
        animatedURL: data.Poster,
        stillURL: data.Poster,
        body: [
            {
                title: "Cast: ",
                bodyText: data.Actors
            },
            {
                title: "Director: ",
                bodyText: data.Director
            },
            {
                title: "Released: ",
                bodyText: data.Released
            },
            {
                title: "Runtime: ",
                bodyText: data.Runtime
            },
            {
                title: "Website",
                bodyText: data.Website
            }
        ],
        subjectId: subjectId,
        apiName: apiName
    };
    addSubject(details);
}

function addBand(data, apiName) {
    var details = {
        animatedURL: data.thumb_url,
        stillURL: data.thumb_url,
        body: [
            {
                title: "Band Name: ",
                bodyText: data.name
            },
            {
                title: "Facebook",
                bodyText: data.facebook_page_url
            },
            {
                title: "Upcoming Events: ",
                bodyText: "" + data.upcoming_event_count
            },
            {
                title: "Bands in Town Page",
                bodyText: data.url
            }
        ],
        subjectId: subjectId,
        apiName: apiName
    };
    addSubject(details);
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
                addPicture(data[i], apiName);
            }
        } else if (apiName === "omdb") {
            addMovie(response, apiName);
        } else if (apiName === "bit") {
            addBand(response, apiName);
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
    saveFavorites();
}

function loadFavorites() {
    var jsonFavorites = readFavorites();
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
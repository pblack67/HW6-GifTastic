const subjects = [
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

const giphyAPI = "https://api.giphy.com/v1/gifs/search?api_key=AtGUXnRVIUl0BcpMsuJfGwW6O7jLnt2G&limit=10&rating=g&q=";
const omdbAPI = "https://www.omdbapi.com/?apikey=f8e29b5&t=";
const bitAPI = "https://rest.bandsintown.com/artists/"; // + artist + "?app_id=nothing",

let subjectDetails = [];
let favorites = [];
let subjectId = 0;

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
    let id = $(this).attr("data-id");
    let details = null;
    subjectDetails.forEach(function (subjectDetails) {
        if (subjectDetails.subjectId == id) {
            details = subjectDetails;
        }
    });

    if (details !== null) {
        if (!isDuplicate(details, favorites)) {
            createSubjectCard(details, $("#favorites"), id, true);
            favorites.push(details);
            saveFavorites();
        }
    }
}

function createSubjectCard(details, element, id, isFavorite) {
    let stillImage = $("<img>").attr("src", details.stillURL).
        attr("data-still", details.stillURL).
        attr("data-animated", details.animatedURL).
        attr("data-state", "still").
        addClass("mx-auto mt-2");

    let bodyDiv = $("<div>").addClass("card-body");

    details.body.forEach(function (bodyItem) {
        let bodyText;
        if (bodyItem.bodyText.search("http") != -1) {
            bodyText = $("<a>").
                attr("href", bodyItem.bodyText).
                attr("target", "_blank").
                text(bodyItem.title).
                addClass("card-text");
        } else {
            bodyText = $("<p>").
                text(bodyItem.title + bodyItem.bodyText).
                addClass("card-text mb-0");
        }

        bodyDiv.append(bodyText);
    });


    if (!isFavorite) {
        let favoriteButton = $("<button>").
            addClass("btn btn-primary favoriteButton mt-1").
            text("Favorite").
            attr("data-id", id);

        bodyDiv.append($("<div>").append(favoriteButton));
    }

    let card = $("<div>").addClass("card ml-3 mb-3 mr-3")
        .append(stillImage)
        .append(bodyDiv);

    element.prepend(card);
    stillImage.on("click", imageClicked);
}

function isDuplicate(details, detailArray) {
    for (let i = 0; i < detailArray.length; i++) {
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
    let details = {
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
    let details = {
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
    let details = {
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
    let apiurl;
    let apiName = $(this).attr("data-api");
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
            let data = response.data;
            response.data.forEach(function (dataItem) {
                addPicture(dataItem, apiName);
            });
        } else if (apiName === "omdb") {
            addMovie(response, apiName);
        } else if (apiName === "bit") {
            addBand(response, apiName);
        }

    });
}

function createButtons() {
    $("#buttonList").empty();
    subjects.forEach(function (subject) {
        let newButton = $("<button>").
            text(subject.buttonName).
            addClass("btn btn-primary subjectButton mr-2 mb-2").
            attr("data-name", subject.buttonName).
            attr("data-api", subject.apiName);
        $("#buttonList").append(newButton);
    });
}

function addButtonClicked(event) {
    event.preventDefault();
    let buttonName = $("#subjectName").val();
    let apiName = $("#apiDropDown").val();
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
    let jsonFavorites = readFavorites();
    favorites = JSON.parse(jsonFavorites);
    if (favorites != null) {
        favorites.forEach(function (favorite) {
            createSubjectCard(favorite, $("#favorites"), 0, true);
        });
    } else {
        favorites = [];
    }
}

function dropdownItemClicked() {
    let val = $(this).val();
    let text = $(this).text();
    $("#apiDropDown").val(val).text(text);
}

// When dom is ready 
$(function () {
    $("#addButton").on("click", addButtonClicked);

    $("#clearSearchButton").on("click", clearSearchButtonClicked);
    $("#clearFavoritesButton").on("click", clearFavoritesButtonClicked);

    $(".dropdown-item").on("click", dropdownItemClicked);

    $(document).on("click", ".subjectButton", subjectButtonClicked);
    $(document).on("click", ".favoriteButton", favoriteButtonClicked);

    createButtons();
    loadFavorites();
});
# My Favorite Things

* URL: [https://pblack67.github.io/MyFavoriteThings/](https://pblack67.github.io/MyFavoriteThings/)

![Search](/images/search.png)
![Favorite](/images/favorite.png)

* Technologies: HTML, CSS, Bootstrap, JavaScript, Events, jQuery, Objects, AJAX, Local Storage, JSON

## Overview

This application allows the user to create a collection of their favorite things: GIFs, Movies and Bands. The user creates a query button by typing in the search term, choosing the query type in the dropdown and then clicking the Add button. Clicking the query button will hit the desired back-end API and add the results to the search area. Each search result has a Favorites button. Clicking on this adds the item to the favorites area. These favorites will persist event if the browser is closed and re-opened. 

## Architecture

The application queries some web APIs via AJAX to find the user's favorite things: 

* Pictures via Giphy (returns top 10 GIFs)
* Movies via OMDB (returns 1 item)
* Bands via Bands in Town (returns 1 item)

The results are returned in JSON and objects are created and added to the results area based on their type. The search buttons are generic and easily extendable to use additional APIs. The result processing logic would need to handle additional results. 

Favorites are persisted in local storage so that the application can read them when coming up in a new browser window. 

All of the screen element manipulation is accomplished via jQuery. The jQuery AJAX implementation handles all of the AJAX API calls. 

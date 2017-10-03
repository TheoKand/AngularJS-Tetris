'use strict';

//Query the WebAPI action to get the list of highscores
app.factory('highscoreService', function ($http) {

    var obj = {};

    //Query the WebAPI action method to get the list of highscores
    obj.get = function (successCallback, errorCallback) {

        $http.get("/api/highscores").then(
            (response) =>successCallback(response.data),
            (response) => errorCallback("Error while reading the highscores: " + response.data.Message)
        );
    };


    //post the new highscore to the WebAPI action method
    obj.put = function (highscoreObj, successCallback, errorCallback) {

        $http.post("/api/highscores", highscoreObj).then(
            () => successCallback(),
            (response) => error("Error while saving the highscores: " + response.data.Message)
        );

    };

    return obj;
});
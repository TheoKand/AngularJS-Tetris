'use strict';

//Query the WebAPI action to get the list of highscores
app.factory('highscoreService', ['$http', function ($http) {

    var factory = {};

    //Query the WebAPI action method to get the list of highscores
    factory.get = function (successCallback, errorCallback) {

        $http.get("/api/highscores").then(
            (response) =>successCallback(response.data),
            (response) => errorCallback("Error while reading the highscores: " + response.data.Message)
        );
    };


    //post the new highscore to the WebAPI action method
    factory.put = function (highscoreObj, successCallback, errorCallback) {

        $http.post("/api/highscores", highscoreObj).then(
            () => successCallback(),
            (response) => error("Error while saving the highscores: " + response.data.Message)
        );

    };

    return factory;
}]);
'use strict';

app.factory('soundEffectsService', function ($http) {

    var factory = {};
    var isMobile = app.isMobile();

    factory.play = function (soundEffect) {

        if (isMobile) return;

        var audio = new Audio('/content/media/' + soundEffect);
        audio.play();
    };

    return factory;
});
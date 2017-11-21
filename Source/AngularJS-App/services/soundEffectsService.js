'use strict';

app.factory('soundEffectsService', ['$http', function ($http) {

    var factory = {};
    var isMobile = app.isMobile();
    var themeAudio;

    factory.playTheme = function () {
        if (isMobile) return;
        themeAudio = new Audio('assets/media/' + app.SoundEffectEnum.Theme);
        themeAudio.volume = 0.05;
        themeAudio.loop = true;
        themeAudio.play();
    };
    factory.stopTheme = function () {
        if (!themeAudio) return;
        themeAudio.pause();
        themeAudio.currentTime = 0;
    };

    factory.play = function (soundEffect,volume,loop) {

        if (isMobile) return;

        var audio = new Audio('assets/media/' + soundEffect);
        if (volume) audio.volume = volume;
        if (loop) audio.loop = loop;

        audio.play();
    };

    return factory;
}]);
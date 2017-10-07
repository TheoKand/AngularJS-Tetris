'use strict';

app.factory('soundEffectsService', function ($http) {

    var factory = {};
    var isMobile = app.isMobile();

    factory.SoundEffectEnum = { Drop: "Drop.mp3", GameOver: "GameOver.mp3", NextLevel: "NextLevel.mp3", Rotate: "Rotate.mp3", CantGoThere: "CantGoThere.mp3", LineComplete: "LineComplete_{0}.mp3" };
    
    factory.play = function (soundEffect) {

        if (isMobile) return;

        var audio = new Audio('/content/media/' + soundEffect);
        audio.play();
    };

    return factory;
});
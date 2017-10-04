'use strict';

app.factory('soundEffectsService', function ($http) {

    var factory = {};

    factory.SoundEffectEnum = { Drop: "Drop.mp3", GameOver: "GameOver.mp3", NextLevel: "NextLevel.mp3", Rotate: "Rotate.mp3", CantGoThere: "CantGoThere.mp3", LineComplete: "LineComplete_{0}.mp3" };
    
    factory.play = function (soundEffect) {
        var audio = new Audio('media/' + soundEffect);
        audio.play();
    };

    return factory;
});
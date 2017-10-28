'use strict';

var app = angular.module('myApp', []);

//set a cookie
app.setCookie = function (cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + JSON.stringify(cvalue) + ";" + expires + ";path=/";
};

//get a cookie
app.getCookie = function (cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    let result = "";
    ca.forEach(function (c) {
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            result = JSON.parse(c.substring(name.length, c.length));
        }
    });
    return result;
};

//check if it's mobile device
app.isMobile = function () {
    if (new RegExp('Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile', 'i').test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
};

//define audio files
app.SoundEffectEnum = { Theme: "Theme.mp3", Drop: "Drop.mp3", GameOver: "GameOver.mp3", NextLevel: "NextLevel.mp3", Rotate: "Rotate.mp3", CantGoThere: "CantGoThere.mp3", LineComplete1: "LineComplete_1.mp3", LineComplete2: "LineComplete_2.mp3", LineComplete3: "LineComplete_3.mp3", LineComplete4: "LineComplete_4.mp3" };

//preload the audio files, only for non-mobile devices
window.addEventListener('load', function () {
    
    let totalAudioFiles = Object.keys(app.SoundEffectEnum).length;

    function preloadAudio(url) {
        let audio = new Audio();
        // once this file loads, it will call loadedAudio() the file will be kept by the browser as cache
        audio.addEventListener('canplaythrough', loadedAudio, false);
        audio.src = 'assets/media/' + url;
    };

    function loadedAudio() {
        // this will be called every time an audio file is loaded we keep track of the loaded files vs the requested files
        totalAudioFiles--;
        if (totalAudioFiles == 0) {
            // all have loaded
            finishedPreloading();
        }
    };

    function finishedPreloading() {
        document.getElementsByClassName("preloading")[0].style.display = 'none';
        document.getElementsByClassName("container")[0].style.display = 'flex';
    };

  
    if (app.isMobile()) {
        finishedPreloading();
    } else {
        // we start preloading all the audio files
        for (let sound in app.SoundEffectEnum) {
            preloadAudio(app.SoundEffectEnum[sound] );
        }
    }


}, false);

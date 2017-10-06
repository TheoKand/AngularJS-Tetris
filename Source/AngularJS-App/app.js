'use strict';

var app = angular.module('myApp', [])

//set a cookie
app.setCookie = function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + JSON.stringify(cvalue) + ";" + expires + ";path=/";
};

//get a cookie
app.getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return JSON.parse(c.substring(name.length, c.length));
        }
    }
    return "";
};

var audioFiles = [
    "/content/media/Drop.mp3",
    "/content/media/GameOver.mp3",
    "/content/media/NextLevel.mp3",
    "/content/media/Rotate.mp3",
    "/content/media/CantGoThere.mp3",
    "/content/media/LineComplete_1.mp3",
    "/content/media/LineComplete_2.mp3",
    "/content/media/LineComplete_3.mp3",
    "/content/media/LineComplete_4.mp3",
];

function preloadAudio(url) {
    var audio = new Audio();
    // once this file loads, it will call loadedAudio()
    // the file will be kept by the browser as cache
    audio.addEventListener('canplaythrough', loadedAudio, false);
    audio.src = url;
}

var loaded = 0;
function loadedAudio() {
    // this will be called every time an audio file is loaded
    // we keep track of the loaded files vs the requested files
    loaded++;
    if (loaded == audioFiles.length) {
        // all have loaded
        init();
    }
}

function init() {
    document.getElementsByClassName("preloading")[0].style.display = 'none';
}

// we start preloading all the audio files
for (var i in audioFiles) {
    preloadAudio(audioFiles[i]);
}
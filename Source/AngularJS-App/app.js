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

//check if it's mobile device
app.isMobile = function () {
    if (new RegExp('Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile', 'i').test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
};

//preload the audio files, only for non-mobile devices
window.addEventListener('load', function () {
    
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
    var loaded = 0;

    function preloadAudio(url) {
        var audio = new Audio();
        // once this file loads, it will call loadedAudio() the file will be kept by the browser as cache
        audio.addEventListener('canplaythrough', loadedAudio, false);
        audio.src = url;
    };

    function loadedAudio() {
        // this will be called every time an audio file is loaded we keep track of the loaded files vs the requested files
        loaded++;
        if (loaded == audioFiles.length) {
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
        for (var i in audioFiles) {
            preloadAudio(audioFiles[i]);
        }
    }


}, false);

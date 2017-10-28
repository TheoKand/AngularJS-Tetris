'use strict';

app.controller('gameController', function ($scope, $timeout, highscoreService, soundEffectsService) {

    let gameInterval = null;
    let backgroundAnimationInfo = {};

    (function () {

        if (!(app.getCookie("AngularTetris_Music")===false)) soundEffectsService.playTheme();
        GetHighscores();
        AnimateBodyBackgroundColor();

        $scope.GameState = new Game.gameState();

        //show the information modal, only the first time
        let infoHasBeenDisplayed = app.getCookie("AngularTetris_InfoWasDisplayed");
        if (infoHasBeenDisplayed == "") {
            app.setCookie("AngularTetris_InfoWasDisplayed", true, 30);
            $("#InfoModal").modal('show');
        }

    })();

    //start or stop the theme music
    $scope.SetMusic = function (on) {
        if (on) {
            app.setCookie("AngularTetris_Music", true, 30);
            soundEffectsService.playTheme();
        } else {
            app.setCookie("AngularTetris_Music", false, 30);
            soundEffectsService.stopTheme();
        }
    };

    //is the music on?
    $scope.GetMusic = function () {
        return !(app.getCookie("AngularTetris_Music") === false);
    };

    //are the soundfx on?
    $scope.GetSoundFX = function () {
        return !( app.getCookie("AngularTetris_SoundFX")  === false);
    };

    //start or stop the sound fx
    $scope.SetSoundFX = function (on) {
        if (on) {
            app.setCookie("AngularTetris_SoundFX", true, 30);
        } else {
            app.setCookie("AngularTetris_SoundFX", false, 30);
        }
    };

    //Save the game state in a cookie
    $scope.SaveGame = function () {

        app.setCookie("AngularTetris_GameState", $scope.GameState, 365);

        ShowMessage("Game Saved", "Your current game was saved. You can return to this game any time by clicking More > Restore Game.");

    };

    //Restore the game state from a cookie
    $scope.RestoreGame = function () {
        let gameState = app.getCookie("AngularTetris_GameState");
        if (gameState != "") {

            $scope.startGame();
            $scope.GameState = gameState;

            ShowMessage("Game Restored", "The game was restored and your score is " + $scope.GameState.score + ". Close this window to resume your game.");

        } else {

            ShowMessage("", "You haven't saved a game previously!");

        }
    };

    //init a new game and start the game loop timer, or pause game
    $scope.startGame = function () {

        if (!$scope.GameState.running) {

            if (!$scope.GameState.paused) {
                //start new game
                InitializeGame();
            }

            $scope.GameState.paused = false;
            $scope.GameState.running = true;
            gameInterval = $timeout(GameLoop, 0);
            $scope.GameState.startButtonText = "Pause";

        } else {

            $scope.GameState.running = false;
            $scope.GameState.paused = true;

            $scope.GameState.startButtonText = "Continue";
            if (gameInterval) clearTimeout(gameInterval);

        }

    };

    //returns the color of a gameboard square (cell) depending on if it's empty, solidified or occupied by a falling tetromino
    $scope.getSquareColor = function (y, x) {

        let square = $scope.GameState.board[y][x];
        
        if (square < 0 ) {
            return Tetromino.Colors[Math.abs(square)];
        } else {
            return Tetromino.Colors[square];
        }

    };

    //returns the color of the game board depending on the level
    $scope.getGameColor = function () {
        
        return Game.Colors[($scope.GameState.level % Game.Colors.length)];

    };

    $scope.getTetrominoColor = function (y, x) {
        let square = $scope.GameState.nextTetrominoSquares[y][x];
        if (square == 0) {
            return $scope.getGameColor();
        } else {
            return Tetromino.Colors[square];
        }
    };

    $scope.getSquareCssClass = function (y, x) {
        let square = $scope.GameState.board[y][x];

        if (square == 0) {
            return "Square ";
        } else if (square <0 ) {
            return "Square SolidSquare";
        } else {
            return "Square TetrominoSquare";
        }
    };

    //save a new highscore
    $scope.saveHighscore = function () {

        let highscore = new Object();
        highscore.Name = $('#txtName').val();
        highscore.Score = $scope.GameState.score;

        if (highscore.Name.length == 0) {
            ShowMessage("", "Please enter your name!");
            return;
        }

        $scope.PleaseWait_SaveHighscores = true;

        //call the highscores service to save the new score
        highscoreService.put(highscore, function () {
            $scope.PleaseWait_SaveHighscores = false;
            $scope.GameState.IsHighscore = false;
            GetHighscores();
        }, function (errMsg) {
            $scope.PleaseWait_SaveHighscores = false;
            alert(errMsg);
        });

    };

    //handle keyboard event. The tetromino is moved or rotated
    $scope.OnKeyDown = (function (key) {

        if (!$scope.GameState.running) return;

        let tetrominoAfterMovement = JSON.parse(JSON.stringify($scope.GameState.fallingTetromino));

        switch (key) {
            case 37: // left

                tetrominoAfterMovement.x--;

                if (Game.checkIfTetrominoCanGoThere(tetrominoAfterMovement, $scope.GameState.board)) {

                    if ($scope.GetSoundFX()) soundEffectsService.play(app.SoundEffectEnum.Rotate);

                    //remove tetromino from current position
                    Game.modifyBoard($scope.GameState.fallingTetromino, $scope.GameState.board, "remove");
                    //move tetromino
                    $scope.GameState.fallingTetromino.x--;
                    //add to new position
                    Game.modifyBoard($scope.GameState.fallingTetromino, $scope.GameState.board, "add");

                } else {
                    if ($scope.GetSoundFX()) soundEffectsService.play(app.SoundEffectEnum.CantGoThere);
                }

                break;

            case 38: // up

                Tetromino.rotate(tetrominoAfterMovement);

                if (Game.checkIfTetrominoCanGoThere(tetrominoAfterMovement, $scope.GameState.board)) {

                    if ($scope.GetSoundFX()) soundEffectsService.play(app.SoundEffectEnum.Rotate);

                    //remove tetromino from current position
                    Game.modifyBoard($scope.GameState.fallingTetromino, $scope.GameState.board, "remove");
                    //rotate tetromino
                    Tetromino.rotate($scope.GameState.fallingTetromino);
                    //add to new position
                    Game.modifyBoard($scope.GameState.fallingTetromino, $scope.GameState.board, "add");

                } else {
                    if ($scope.GetSoundFX()) soundEffectsService.play(app.SoundEffectEnum.CantGoThere);
                }
                break;

            case 39: // right

                tetrominoAfterMovement.x++;

                if (Game.checkIfTetrominoCanGoThere(tetrominoAfterMovement, $scope.GameState.board)) {

                    if ($scope.GetSoundFX()) soundEffectsService.play(app.SoundEffectEnum.Rotate);

                    //remove tetromino from current position
                    Game.modifyBoard($scope.GameState.fallingTetromino, $scope.GameState.board, "remove");
                    //move tetromino
                    $scope.GameState.fallingTetromino.x++;
                    //add to new position
                    Game.modifyBoard($scope.GameState.fallingTetromino, $scope.GameState.board, "add");

                } else {
                    if ($scope.GetSoundFX()) soundEffectsService.play(app.SoundEffectEnum.CantGoThere);
                }


                break;

            case 40: // down

                tetrominoAfterMovement.y++;

                if (Game.checkIfTetrominoCanGoThere(tetrominoAfterMovement, $scope.GameState.board)) {
                    //remove tetromino from current position
                    Game.modifyBoard($scope.GameState.fallingTetromino, $scope.GameState.board, "remove");
                    //move tetromino
                    $scope.GameState.fallingTetromino.y++;
                    //add to new position
                    Game.modifyBoard($scope.GameState.fallingTetromino, $scope.GameState.board, "add");

                } else {
                    if ($scope.GetSoundFX()) soundEffectsService.play(app.SoundEffectEnum.CantGoThere);
                }


                break;

            default: return; // exit this handler for other keys
        }


    });

    //Returns the game delay depending on the level. The higher the level, the faster the tetrimino falls
    function GetDelay() {
        let delay = 1000;

        if ($scope.GameState.level < 5) {
            delay = delay - (120 * ($scope.GameState.level - 1));
        } else if ($scope.GameState.level < 15) {
            delay = delay - (58 * ($scope.GameState.level - 1));
        } else {
            delay = 220 - ($scope.GameState.level - 15) * 8;
        }

        return delay;

    }

    //Returns a random Tetromino. A bag of all 7 tetrominoes are randomly shuffled and put in the field of play. Every tetromino is guarenteed to appear 
    //once every 7 turns and you'll never see a run of 3 consecutive pieces of the same kind.
    function GetNextRandomTetromino() {

        //refill bag if empty
        let isEmpty = !$scope.GameState.tetrominoBag.some(function (a) { return a > 0; });
        let availableTetrominos = [];
        let randomTetrominoType;

        for (let i = 1; i <= 7; i++) {
            if ($scope.GameState.tetrominoBag[i] > 0) {
                availableTetrominos.push(i);
            }
        }

        if (isEmpty) {
            $scope.GameState.tetrominoBag = JSON.parse(JSON.stringify($scope.GameState.fullTetrominoBag));
            availableTetrominos = [Tetromino.TypeEnum.LINE, Tetromino.TypeEnum.BOX, Tetromino.TypeEnum.INVERTED_T, Tetromino.TypeEnum.S, Tetromino.TypeEnum.Z, Tetromino.TypeEnum.L, Tetromino.TypeEnum.INVERTED_L];
        }

        if (availableTetrominos.length == 1) {

            randomTetrominoType = availableTetrominos[0];

        } else if (availableTetrominos.length <= 3) {

            let randomNum = Math.floor((Math.random() * (availableTetrominos.length - 1)));
            randomTetrominoType = availableTetrominos[randomNum];

        } else {

            //don't allow the same tetromino two consecutive times
            let cantHaveThisTetromino = 0;
            if ($scope.GameState.tetrominoHistory.length > 0) {
                let ar = $scope.GameState.tetrominoHistory.split(",");
                cantHaveThisTetromino = parseInt($scope.GameState.tetrominoHistory[$scope.GameState.tetrominoHistory.length - 1]);
            }

            randomTetrominoType = Math.floor((Math.random() * 7) + 1);
            while ($scope.GameState.tetrominoBag[randomTetrominoType] == 0 || (randomTetrominoType == cantHaveThisTetromino)) {
                randomTetrominoType = Math.floor((Math.random() * 7) + 1);
            }

        }

        //keep a list of fallen tetrominos
        if ($scope.GameState.tetrominoHistory != "") $scope.GameState.tetrominoHistory = $scope.GameState.tetrominoHistory + ",";
        $scope.GameState.tetrominoHistory = $scope.GameState.tetrominoHistory + randomTetrominoType;

        //decrease available items for this tetromino (bag with 7 of each)
        $scope.GameState.tetrominoBag[randomTetrominoType]--;

        let newTetromino = new Tetromino.tetromino(randomTetrominoType);
        return newTetromino;
    }

    //Initialize everything to start a new tetris game
    function InitializeGame() {

        $scope.GameState.running = false;
        $scope.GameState.lines = 0;
        $scope.GameState.score = 0;
        $scope.GameState.level = 1;
        $scope.GameState.tetrominoBag = JSON.parse(JSON.stringify($scope.GameState.fullTetrominoBag));
        $scope.GameState.tetrominoHistory = "";
        $scope.GameState.IsHighscore = false;

        backgroundAnimationInfo = { Color: $scope.getGameColor(), AlternateColor: makeColorLighter($scope.getGameColor(), 50), Duration: 1500 - ($scope.level - 1) * 30 };

        //get next tetromino
        if ($scope.GetSoundFX()) soundEffectsService.play(app.SoundEffectEnum.Drop);
        if ($scope.GameState.nextTetromino) {
            $scope.GameState.fallingTetromino = $scope.GameState.nextTetromino;
        } else {
            $scope.GameState.fallingTetromino = GetNextRandomTetromino();
        }
        $scope.GameState.nextTetromino = GetNextRandomTetromino();
        $scope.GameState.nextTetrominoSquares = Tetromino.getSquares($scope.GameState.nextTetromino);

        //initialize game board
        $scope.GameState.board = new Array(Game.BoardSize.h);
        for (let y = 0; y < Game.BoardSize.h; y++) {
            $scope.GameState.board[y] = new Array(Game.BoardSize.w);
            for (let x = 0; x < Game.BoardSize.w; x++)
                $scope.GameState.board[y][x] = 0;
        }

        //show the first falling tetromino 
        Game.modifyBoard($scope.GameState.fallingTetromino, $scope.GameState.board, "add");

    }

    //Game is over. Check if there is a new highscore
    function GameOver() {

        if ($scope.GetSoundFX()) soundEffectsService.play(app.SoundEffectEnum.GameOver);

        $scope.GameState.running = false;
        $scope.GameState.startButtonText = "Start";

        if ($scope.GameState.score > 0 && $scope.highscores) {
            if ($scope.highscores.length < 10) {
                $scope.GameState.IsHighscore = true;
            } else {
                let minScore = $scope.highscores[$scope.highscores.length - 1].Score;
                $scope.GameState.IsHighscore = ($scope.GameState.score > minScore);
            }
        }

        $("#InfoGameover").modal("show");

    }

    // the game loop. If the tetris game is running...
    // 1. move the tetromino down if it can fall 
    // 2. solidify the tetromino if it can't go futher down
    // 3. clear completed lines
    // 4. check for game over and send the next tetromino
    function GameLoop() {

        if (!$scope.GameState.running) return;

        let tetrominoCanFall = Game.checkIfTetrominoCanMoveDown($scope.GameState.fallingTetromino, $scope.GameState.board);
        if (tetrominoCanFall) {

            Game.modifyBoard($scope.GameState.fallingTetromino, $scope.GameState.board, "remove");
            $scope.GameState.fallingTetromino.y++;
            Game.modifyBoard($scope.GameState.fallingTetromino, $scope.GameState.board, "add");

        } else {

            //tetromino is solidified. Check for game over and Send the next one.
            if ($scope.GameState.fallingTetromino.y == 0) {
                GameOver();
            } else {

                //solidify tetromino
                Game.modifyBoard($scope.GameState.fallingTetromino, $scope.GameState.board, "solidify");

                //clear completed lines
                let currentLevel = $scope.GameState.level;
                let howManyLinesCompleted = 0;
                while (Game.checkForTetris($scope.GameState)) {
                    howManyLinesCompleted++;
                }

                if (howManyLinesCompleted > 0) {

                    if (howManyLinesCompleted == 1)
                        $("#Game").effect("shake", { direction: "left", distance: "5", times: 3 }, 500);
                    else if (howManyLinesCompleted == 2)
                        $("#Game").effect("shake", { direction: "left", distance: "10", times: 4 }, 600);
                    else if (howManyLinesCompleted == 3)
                        $("#Game").effect("shake", { direction: "left", distance: "15", times: 5 }, 700);
                    else if (howManyLinesCompleted == 4) {
                        $("#Game").effect("shake", { direction: "left", distance: "30", times: 4 }, 500);
                        $("#Game").effect("shake", { direction: "up", distance: "30", times: 4 }, 500);
                    }

                    let scoreFontSize = 25 + (howManyLinesCompleted - 1) * 15;
                    $(".GameScoreValue").animate({ fontSize: scoreFontSize + "px" }, "fast");
                    $(".GameScoreValue").animate({ fontSize: "14px" }, "fast");

                    //give extra points for multiple lines
                    $scope.GameState.score = $scope.GameState.score + 50 * (howManyLinesCompleted - 1);
                    if (howManyLinesCompleted == 4) {
                        $scope.GameState.score = $scope.GameState.score + 500;
                    }

                    if ($scope.GetSoundFX()) {
                        if (howManyLinesCompleted == 1)
                            soundEffectsService.play(app.SoundEffectEnum.LineComplete1);
                        else if (howManyLinesCompleted == 2)
                            soundEffectsService.play(app.SoundEffectEnum.LineComplete2);
                        else if (howManyLinesCompleted == 3)
                            soundEffectsService.play(app.SoundEffectEnum.LineComplete3);
                        else if (howManyLinesCompleted == 4)
                            soundEffectsService.play(app.SoundEffectEnum.LineComplete4);

                        if ($scope.GameState.level > currentLevel) soundEffectsService.play(app.SoundEffectEnum.NextLevel);
                    }

                    backgroundAnimationInfo = { Color: $scope.getGameColor(), AlternateColor: makeColorLighter($scope.getGameColor(), 50), Duration: 1500 - ($scope.level - 1) * 30 };
                }

                //send next one
                if ($scope.GetSoundFX()) soundEffectsService.play(app.SoundEffectEnum.Drop);
                if ($scope.GameState.nextTetromino) {
                    $scope.GameState.fallingTetromino = $scope.GameState.nextTetromino;
                } else {
                    $scope.GameState.fallingTetromino = GetNextRandomTetromino();
                }
                $scope.GameState.nextTetromino = GetNextRandomTetromino();
                $scope.GameState.nextTetrominoSquares = Tetromino.getSquares($scope.GameState.nextTetromino);

                tetrominoCanFall = Game.checkIfTetrominoCanMoveDown($scope.GameState.fallingTetromino, $scope.GameState.board);
                if (!tetrominoCanFall) {
                    GameOver();
                } else {
                    Game.modifyBoard($scope.GameState.fallingTetromino, $scope.GameState.board, "add");
                }


            }

        }

        //set the game timer. The delay depends on the current level. The higher the level, the fastest the game moves (harder)
        gameInterval = $timeout(GameLoop, GetDelay());

    }

    //call the highscoreService to get the highscores and save result in the scope
    function GetHighscores() {

        $scope.PleaseWait_GetHighscores = true;

        highscoreService.get(function (highscores) {
            $scope.PleaseWait_GetHighscores = false;
            $scope.highscores = highscores;
        }, function (errMsg) {
            $scope.PleaseWait_GetHighscores = false;
            alert(errMsg);
        });
    }

    //Changes the provided color to be this percent lighter
    function makeColorLighter(color, percent) {
        let num = parseInt(color.slice(1), 16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    //show a modal message 
    function ShowMessage(title, text) {
        $scope.GenericModal = { Title: title, Text: text };
        $("#InfoGeneric").modal("show");
    }

    //animate the background color between two colors
    function AnimateBodyBackgroundColor() {

        if (!backgroundAnimationInfo.AlternateColor) {
            backgroundAnimationInfo = {
                Color: Game.Colors[1], AlternateColor: makeColorLighter(Game.Colors[1], 50), Duration: 1500 };
        }

        $("body").animate({
            backgroundColor: backgroundAnimationInfo.AlternateColor
        }, {
            duration: 1000,
            complete: function () {

                $("body").animate({
                    backgroundColor: backgroundAnimationInfo.Color
                }, {
                    duration: 1000,
                    complete: function () {
                        AnimateBodyBackgroundColor();
                    }
                });


            }
        });

    }




});
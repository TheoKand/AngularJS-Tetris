'use strict';

app.controller('gameController', function ($scope, highscoreService, gameBoardService,soundEffectsService, gameData) {

    var gameInterval = null;

    //The gameData service containing the score, current level etc must be accessed from the view (the html markup in Index.html), so it must be attached to the $scope
    $scope.gameData = gameData;

    GetHighscores();

    $("#btnInfo").click();

    //handle keyboard event. The tetromino is moved or rotated
    $(document).keydown(function (e) {

        if (!gameData.running) return;

        switch (e.which) {
            case 37: // left

                var tetrominoAfterMovement = { x: gameData.fallingTetromino.x - 1, y: gameData.fallingTetromino.y, type: gameData.fallingTetromino.type, rotation: gameData.fallingTetromino.rotation };
                if (gameBoardService.checkIfTetrominoCanGoThere(tetrominoAfterMovement, gameData.board)) {
                    //remove tetromino from current position
                    gameBoardService.modifyBoard(gameData.fallingTetromino, gameData.board, "remove");
                    //move tetromino
                    gameData.fallingTetromino.x--;
                    //add to new position
                    gameBoardService.modifyBoard(gameData.fallingTetromino, gameData.board, "add");

                    UpdateView();
                } else {
                    soundEffectsService.play(soundEffectsService.SoundEffectEnum.CantGoThere);
                }

                break;

            case 38: // up

                var tetrominoAfterRotation = { x: gameData.fallingTetromino.x, y: gameData.fallingTetromino.y, type: gameData.fallingTetromino.type, rotation: gameData.fallingTetromino.rotation };
                gameBoardService.rotateTetromino(tetrominoAfterRotation);
                if (gameBoardService.checkIfTetrominoCanGoThere(tetrominoAfterRotation, gameData.board)) {

                    soundEffectsService.play(soundEffectsService.SoundEffectEnum.Rotate);

                    //remove tetromino from current position
                    gameBoardService.modifyBoard(gameData.fallingTetromino, gameData.board, "remove");
                    //rotate tetromino
                    gameBoardService.rotateTetromino(gameData.fallingTetromino);
                    //add to new position
                    gameBoardService.modifyBoard(gameData.fallingTetromino, gameData.board, "add");

                    UpdateView();
                } else {
                    soundEffectsService.play(soundEffectsService.SoundEffectEnum.CantGoThere);
                }
                break;

            case 39: // right

                var tetrominoAfterMovement = { x: gameData.fallingTetromino.x + 1, y: gameData.fallingTetromino.y, type: gameData.fallingTetromino.type, rotation: gameData.fallingTetromino.rotation };
                if (gameBoardService.checkIfTetrominoCanGoThere(tetrominoAfterMovement, gameData.board)) {
                    //remove tetromino from current position
                    gameBoardService.modifyBoard(gameData.fallingTetromino, gameData.board, "remove");
                    //move tetromino
                    gameData.fallingTetromino.x++;
                    //add to new position
                    gameBoardService.modifyBoard(gameData.fallingTetromino, gameData.board, "add");

                    UpdateView();
                } else {
                    soundEffectsService.play(soundEffectsService.SoundEffectEnum.CantGoThere);
                }


                break;

            case 40: // down

                var tetrominoAfterMovement = { x: gameData.fallingTetromino.x, y: gameData.fallingTetromino.y + 1, type: gameData.fallingTetromino.type, rotation: gameData.fallingTetromino.rotation };
                if (gameBoardService.checkIfTetrominoCanGoThere(tetrominoAfterMovement, gameData.board)) {
                    //remove tetromino from current position
                    gameBoardService.modifyBoard(gameData.fallingTetromino, gameData.board, "remove");
                    //move tetromino
                    gameData.fallingTetromino.y++;
                    //add to new position
                    gameBoardService.modifyBoard(gameData.fallingTetromino, gameData.board, "add");

                    UpdateView();
                } else {
                    soundEffectsService.play(soundEffectsService.SoundEffectEnum.CantGoThere);
                }


                break;

            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)

    });

    //In small screen devices, a virtual keyboard is displayed 
    $scope.VirtualKeyboardEvent = function (key) {

        var e = $.Event('keydown');
        e.which = key;
        $(document).trigger(e);

    };

    //init a new game and start the game loop timer, or pause game
    $scope.startGame = function () {

        if (!gameData.running) {

            if (!gameData.paused) {
                //start new game
                InitializeGame();
            }

            gameData.paused = false;
            gameData.running = true;
            gameInterval = setTimeout(Animate, GetDelay());
            gameData.startButtonText = "Pause";

        } else {

            gameData.running = false;
            gameData.paused = true;

            gameData.startButtonText = "Continue";
            if (gameInterval) {
                clearTimeout(gameInterval);
            }
        }

    };

    //returns the color of a gameboard square (cell) depending on if it's empty, solidified or occupied by a falling tetromino
    $scope.getSquareColor = function (y, x) {

        var square = gameData.board[y][x];

        if (square == gameBoardService.GameBoardSquareTypeEnum.SOLID) {
            var color = shadeColor1($scope.getGameColor(), 20);
            return color;
        } else {
            return gameBoardService.TetrominoColors[square];
        }

    };

    //returns the color of the game board depending on the level
    $scope.getGameColor = function () {

        return gameBoardService.GameBoardColors[(gameData.level % gameBoardService.GameBoardColors.length)];

    };

    $scope.getTetrominoColor = function (y, x) {
        var square = gameData.nextTetrominoSquares[y][x];
        if (square == gameBoardService.GameBoardSquareTypeEnum.EMPTY) {
            return $scope.getGameColor();
        } else {
            return gameBoardService.TetrominoColors[square];
        }
    };

    $scope.getSquareCssClass = function (y, x) {
        var square = gameData.board[y][x];

        if (square == gameBoardService.GameBoardSquareTypeEnum.EMPTY) {
            return "Square ";
        } else if (square == gameBoardService.GameBoardSquareTypeEnum.SOLID) {
            return "Square SolidSquare";
        } else {
            return "Square TetrominoSquare";
        }
    };

    //save a new highscore
    $scope.saveHighscore = function () {

        var highscore = new Object();
        highscore.Name = $('#txtName').val();
        highscore.Score = gameData.score;

        if (highscore.Name.length == 0) {
            alert("Please enter your name!");
            return;
        }

        $scope.PleaseWait_SaveHighscores = true;

        //call the highscores service to save the new score
        highscoreService.put(highscore, function () {
            $scope.PleaseWait_SaveHighscores = false;
            gameData.IsHighscore = false;
            GetHighscores();
        }, function (errMsg) {
            $scope.PleaseWait_SaveHighscores = false;
            alert(errMsg);
        });

    };

    //Returns the game delay depending on the level. The higher the level, the faster the tetrimino falls
    function GetDelay() {
        var delay = 1000;

        if (gameData.level < 5) {
            delay = delay - (120 * (gameData.level - 1));
        } else if (gameData.level < 15) {
            delay = delay - (58 * (gameData.level - 1));
        } else {
            delay = 220 - (gameData.level - 15) * 8;
        }

        return delay;

    }

    //Returns a random Tetromino. A bag of all 7 tetrominoes are randomly shuffled and put in the field of play. Every tetromino is guarenteed to appear 
    //once every 7 turns and you'll never see a run of 3 consecutive pieces of the same kind.
    function GetNextRandomTetromino() {


        //refill bag if empty
        var isEmpty = true;
        for (var i = 2; i < 8; i++) {
            if (gameData.tetrominoBag[i] > 0) {
                isEmpty = false;
                break;
            }
        }
        if (isEmpty) {
            gameData.tetrominoBag = [0, 0, 7, 7, 7, 7, 7, 7, 7];
        }

        //rule about 3 consecutive pieces of the same kind. Can't have that.
        var cantHaveThisTetromino = 0;
        if (gameData.tetrominoHistory.length > 2) {
            var ar = gameData.tetrominoHistory.split(",");
            if (gameData.tetrominoHistory[0] == gameData.tetrominoHistory[1]) {
                cantHaveThisTetromino = parseInt(gameData.tetrominoHistory[0]);
            }
        }

        var randomTetrominoType = Math.floor((Math.random() * 7) + 2);
        while (gameData.tetrominoBag[randomTetrominoType] == 0 || randomTetrominoType == cantHaveThisTetromino) {
            randomTetrominoType = Math.floor((Math.random() * 7) + 2);
        }

        //keep a list of fallen tetrominos
        if (gameData.tetrominoHistory != "") gameData.tetrominoHistory = gameData.tetrominoHistory + ",";
        gameData.tetrominoHistory = gameData.tetrominoHistory + randomTetrominoType;

        //decrease available items for this tetromino (bag with 7 of each)
        gameData.tetrominoBag[randomTetrominoType]--;

        var tetromino = { x: 4, y: 0, type: randomTetrominoType, rotation: 0 };
        return tetromino;
    }

    //Initialize everything to start a new tetris game
    function InitializeGame() {

        gameData.running = false;
        gameData.lines = 0;
        gameData.score = 0;
        gameData.level = 1;
        gameData.tetrominoBag = [0, 0, 7, 7, 7, 7, 7, 7, 7];
        gameData.tetrominoHistory = "";
        gameData.IsHighscore = false;

        //get next tetromino
        soundEffectsService.play(soundEffectsService.SoundEffectEnum.Drop);
        if (gameData.nextTetromino) {
            gameData.fallingTetromino = gameData.nextTetromino;
        } else {
            gameData.fallingTetromino = GetNextRandomTetromino();
        }
        gameData.nextTetromino = GetNextRandomTetromino();
        gameData.nextTetrominoSquares = gameBoardService.getTetrominoSquares(gameData.nextTetromino);

        //initialize game board
        gameData.board = new Array(gameBoardService.boardSize.h);
        for (var y = 0; y < gameBoardService.boardSize.h; y++) {
            gameData.board[y] = new Array(gameBoardService.boardSize.w);
            for (var x = 0; x < gameBoardService.boardSize.w; x++)
                gameData.board[y][x] = 0;
        }

        //show the first falling tetromino 
        gameBoardService.modifyBoard(gameData.fallingTetromino, gameData.board, "add");

    }

    //Game is over. Check if there is a new highscore
    function GameOver() {

        soundEffectsService.play(soundEffectsService.SoundEffectEnum.GameOver);

        gameData.running = false;
        gameData.startButtonText = "Start";

        if (gameData.score > 0 && $scope.highscores) {
            if ($scope.highscores.length < 10) {
                gameData.IsHighscore = true;
            } else {
                var minScore = $scope.highscores[$scope.highscores.length - 1].Score;
                gameData.IsHighscore = (gameData.score > minScore);
            }
        }
        gameData.IsHighscore = true;

        $("#btnGameover").click();

    }

    // the game loop. If the tetris game is running...
    // 1. move the tetromino down if it can fall 
    // 2. solidify the tetromino if it can't go futher down
    // 3. clear completed lines
    // 4. check for game over and send the next tetromino
    function Animate() {

        if (!gameData.running) return;

        var tetrominoCanFall = gameBoardService.checkIfTetrominoCanMoveDown(gameData.fallingTetromino, gameData.board);
        if (tetrominoCanFall) {

            gameBoardService.modifyBoard(gameData.fallingTetromino, gameData.board, "remove");
            gameData.fallingTetromino.y++;
            gameBoardService.modifyBoard(gameData.fallingTetromino, gameData.board, "add");

        } else {

            //tetromino is solidified. Check for game over and Send the next one.
            if (gameData.fallingTetromino.y == 0) {
                GameOver();
            } else {

                //solidify tetromino
                gameBoardService.modifyBoard(gameData.fallingTetromino, gameData.board, "solidify");

                //clear completed lines
                var currentLevel = gameData.level;
                var howManyLinesCompleted = 0;
                while (gameBoardService.checkForTetris(gameData)) {
                    howManyLinesCompleted++;
                }
                if (howManyLinesCompleted > 0) {
                    //give extra points for multiple lines
                    gameData.score = gameData.score + 50 * (howManyLinesCompleted - 1);
                    if (howManyLinesCompleted == 4) {
                        gameData.score = gameData.score + 500;
                    }

                    soundEffectsService.play(soundEffectsService.SoundEffectEnum.LineComplete.replace("{0}", howManyLinesCompleted));
                    if (gameData.level > currentLevel) soundEffectsService.play(soundEffectsService.SoundEffectEnum.NextLevel);
                }

                //send next one
                soundEffectsService.play(soundEffectsService.SoundEffectEnum.Drop);
                if (gameData.nextTetromino) {
                    gameData.fallingTetromino = gameData.nextTetromino;
                } else {
                    gameData.fallingTetromino = GetNextRandomTetromino();
                }
                gameData.nextTetromino = GetNextRandomTetromino();
                gameData.nextTetrominoSquares = gameBoardService.getTetrominoSquares(gameData.nextTetromino);

                var tetrominoCanFall = gameBoardService.checkIfTetrominoCanMoveDown(gameData.fallingTetromino, gameData.board);
                if (!tetrominoCanFall) {
                    GameOver();
                } else {
                    gameBoardService.modifyBoard(gameData.fallingTetromino, gameData.board, "add");
                }


            }

        }

        UpdateView();

        //set the game timer. The delay depends on the current level. The higher the level, the fastest the game moves (harder)
        gameInterval = setTimeout(Animate, GetDelay());

    }

    //call the highscoreService to get the highscores and save result in the scope
    function GetHighscores() {

        $scope.PleaseWait_GetHighscores = true;

        highscoreService.get(function (highscores) {
            $scope.PleaseWait_GetHighscores = false;
            $scope.highscores = highscores;
            UpdateView();
        }, function (errMsg) {
            $scope.PleaseWait_GetHighscores = false;
            alert(errMsg);
        });
    }

    //Sync the scope with the view
    function UpdateView() {

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }

    }

    function shadeColor1(color, percent) {  // deprecated. See below.
        var num = parseInt(color.slice(1), 16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }


});
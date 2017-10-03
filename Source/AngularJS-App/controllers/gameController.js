'use strict';

app.controller('gameController', function ($scope, highscoreService, gameBoardService,gameData) {

    
    var gameInterval = null;

    //The gameData service containing the score, current level etc must be accessed from the view (the html markup in Index.html), so it must be attached to the $scope
    $scope.gameData = gameData;

    GetHighscores();

    //handle keyboard event. The tetromino is moved or rotated
    $(document).keydown(function (e) {

        if (!$scope.gameData.running) return;

        switch (e.which) {
            case 37: // left

                var tetrominoAfterMovement = { x: $scope.gameData.fallingTetromino.x - 1, y: $scope.gameData.fallingTetromino.y, type: $scope.gameData.fallingTetromino.type, rotation: $scope.gameData.fallingTetromino.rotation };
                if (gameBoardService.checkIfTetrominoCanGoThere(tetrominoAfterMovement, $scope.gameData.board)) {
                    //remove tetromino from current position
                    gameBoardService.modifyBoard($scope.gameData.fallingTetromino, $scope.gameData.board, "remove");
                    //move tetromino
                    $scope.gameData.fallingTetromino.x--;
                    //add to new position
                    gameBoardService.modifyBoard($scope.gameData.fallingTetromino, $scope.gameData.board, "add");

                    UpdateView();
                }

                break;

            case 38: // up

                var tetrominoAfterRotation = { x: $scope.gameData.fallingTetromino.x, y: $scope.gameData.fallingTetromino.y, type: $scope.gameData.fallingTetromino.type, rotation: $scope.gameData.fallingTetromino.rotation };
                gameBoardService.rotateTetromino(tetrominoAfterRotation);
                if (gameBoardService.checkIfTetrominoCanGoThere(tetrominoAfterRotation, $scope.gameData.board)) {
                    //remove tetromino from current position
                    gameBoardService.modifyBoard($scope.gameData.fallingTetromino, $scope.gameData.board, "remove");
                    //rotate tetromino
                    gameBoardService.rotateTetromino($scope.gameData.fallingTetromino);
                    //add to new position
                    gameBoardService.modifyBoard($scope.gameData.fallingTetromino, $scope.gameData.board, "add");

                    UpdateView();

                }
                break;

            case 39: // right

                var tetrominoAfterMovement = { x: $scope.gameData.fallingTetromino.x + 1, y: $scope.gameData.fallingTetromino.y, type: $scope.gameData.fallingTetromino.type, rotation: $scope.gameData.fallingTetromino.rotation };
                if (gameBoardService.checkIfTetrominoCanGoThere(tetrominoAfterMovement, $scope.gameData.board)) {
                    //remove tetromino from current position
                    gameBoardService.modifyBoard($scope.gameData.fallingTetromino, $scope.gameData.board, "remove");
                    //move tetromino
                    $scope.gameData.fallingTetromino.x++;
                    //add to new position
                    gameBoardService.modifyBoard($scope.gameData.fallingTetromino, $scope.gameData.board, "add");

                    UpdateView();

                }


                break;

            case 40: // down

                var tetrominoAfterMovement = { x: $scope.gameData.fallingTetromino.x, y: $scope.gameData.fallingTetromino.y + 1, type: $scope.gameData.fallingTetromino.type, rotation: $scope.gameData.fallingTetromino.rotation };
                if (gameBoardService.checkIfTetrominoCanGoThere(tetrominoAfterMovement, $scope.gameData.board)) {
                    //remove tetromino from current position
                    gameBoardService.modifyBoard($scope.gameData.fallingTetromino, $scope.gameData.board, "remove");
                    //move tetromino
                    $scope.gameData.fallingTetromino.y++;
                    //add to new position
                    gameBoardService.modifyBoard($scope.gameData.fallingTetromino, $scope.gameData.board, "add");

                    UpdateView();

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

    }

    //init a new game and start the game loop timer, or pause game
    $scope.startGame = function () {

        if (!$scope.gameData.running) {

            if (!$scope.gameData.paused) {
                //start new game
                InitializeGame();
            }

            $scope.gameData.paused = false;
            $scope.gameData.running = true;
            gameInterval = setTimeout(Animate, GetDelay());
            $scope.gameData.startButtonText = "Pause";

        } else {

            $scope.gameData.running = false;
            $scope.gameData.paused = true;

            $scope.gameData.startButtonText = "Continue";
            if (gameInterval) {
                clearTimeout(gameInterval);
            }
        }

    };

    //returns the color of a gameboard square (cell) depending on if it's empty, solidified or occupied by a falling tetromino
    $scope.getSquareColor = function (y, x) {

        var square = $scope.gameData.board[y][x];

        if (square==gameBoardService.GameBoardSquareTypeEnum.SOLID) {
            return $scope.getGameColor();
        } else {
            return gameBoardService.TetrominoColors[square];
        }
        

    };

    //returns the color of the game board depending on the level
    $scope.getGameColor = function () {

        return gameBoardService.GameBoardColors[(gameData.level % gameBoardService.GameBoardColors.length) ];

    };

    $scope.getTetrominoColor = function (y, x) {
        var square = $scope.gameData.nextTetrominoSquares[y][x];
        if (square == gameBoardService.GameBoardSquareTypeEnum.EMPTY) {
            return $scope.getGameColor();
        } else {
            return gameBoardService.TetrominoColors[square];
        }
    }

    $scope.getSquareCssClass = function (y, x) {
        var square = $scope.gameData.board[y][x];

        if (square == gameBoardService.GameBoardSquareTypeEnum.EMPTY) {
            return "Square ";
    } else if (square == gameBoardService.GameBoardSquareTypeEnum.SOLID) {
            return "Square SolidSquare";
        } else {
            return "Square TetrominoSquare";
        }
    }

    //save a new highscore
    $scope.saveHighscore = function () {

        var highscore = new Object();
        highscore.Name = $('#txtName').val();
        highscore.Score = gameData.score;

        if(highscore.Name.length == 0) {
            alert("Please enter your name!");
            return;
        }

        //call the highscores service to save the new score
        highscoreService.put(highscore, function () {
            $scope.gameData.IsHighscore = false;
            GetHighscores();
        }, function (errMsg) {
            alert(errMsg);
        });

    }


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
            if ($scope.gameData.tetrominoBag[i] > 0) {
                isEmpty = false;
                break;
            }
        }
        if (isEmpty) {
            $scope.gameData.tetrominoBag = [0, 0, 7, 7, 7, 7, 7, 7, 7];
        }

        //rule about 3 consecutive pieces of the same kind. Can't have that.
        var cantHaveThisTetromino = 0;
        if ($scope.gameData.tetrominoHistory.length > 2) {
            var ar = $scope.gameData.tetrominoHistory.split(",");
            if ($scope.gameData.tetrominoHistory[0] == $scope.gameData.tetrominoHistory[1]) {
                cantHaveThisTetromino = parseInt($scope.gameData.tetrominoHistory[0]);
            }
        }

        var randomTetrominoType = Math.floor((Math.random() * 7) + 2);
        while ($scope.gameData.tetrominoBag[randomTetrominoType] == 0 || randomTetrominoType == cantHaveThisTetromino) {
            randomTetrominoType = Math.floor((Math.random() * 7) + 2);
        }

        //keep a list of fallen tetrominos
        if ($scope.gameData.tetrominoHistory != "") $scope.gameData.tetrominoHistory = $scope.gameData.tetrominoHistory + ",";
        $scope.gameData.tetrominoHistory = $scope.gameData.tetrominoHistory + randomTetrominoType;

        //decrease available items for this tetromino (bag with 7 of each)
        $scope.gameData.tetrominoBag[randomTetrominoType]--;

        var tetromino = { x: 4, y: 0, type: randomTetrominoType, rotation: 0 };
        return tetromino;
    }

    //Initialize everything to start a new tetris game
    function InitializeGame() {

        $scope.gameData.running = false;
        $scope.gameData.lines = 0;
        $scope.gameData.score = 0;
        $scope.gameData.level = 11;
        $scope.gameData.tetrominoBag = [0, 0, 7, 7, 7, 7, 7, 7, 7];
        $scope.gameData.tetrominoHistory = "";
        $scope.gameData.IsHighscore = false;

        //get next tetromino
        if ($scope.gameData.nextTetromino) {
            $scope.gameData.fallingTetromino = $scope.gameData.nextTetromino;
        } else {
            $scope.gameData.fallingTetromino = GetNextRandomTetromino();
        }
        $scope.gameData.nextTetromino = GetNextRandomTetromino();
        $scope.gameData.nextTetrominoSquares = gameBoardService.getTetrominoSquares($scope.gameData.nextTetromino);

        //initialize game board
        $scope.gameData.board = new Array(gameBoardService.boardSize.h);
        for (var y = 0; y < gameBoardService.boardSize.h; y++) {
            $scope.gameData.board[y]= new Array(gameBoardService.boardSize.w);
            for (var x = 0; x < gameBoardService.boardSize.w; x++)
                $scope.gameData.board[y][x] = 0;
        }

        //show the first falling tetromino 
        gameBoardService.modifyBoard($scope.gameData.fallingTetromino, $scope.gameData.board,"add");

    };


    //Game is over. Check if there is a new highscore
    function GameOver() {

        $scope.gameData.running = false;
        $scope.gameData.startButtonText = "Start";

        if (gameData.score > 0 && $scope.highscores) {
            if ($scope.highscores.length < 10) {
                $scope.gameData.IsHighscore = true;
            } else {
                var minScore = $scope.highscores[$scope.highscores.length - 1].Score;
                $scope.gameData.IsHighscore = (gameData.score > minScore);
            }
        }

        $("#btnGameover").click();

    }

    // the game loop. If the tetris game is running...
    // 1. move the tetromino down if it can fall 
    // 2. solidify the tetromino if it can't go futher down
    // 3. clear completed lines
    // 4. check for game over and send the next tetromino
    function Animate() {

        if (!$scope.gameData.running) return;

        var tetrominoCanFall = gameBoardService.checkIfTetrominoCanMoveDown($scope.gameData.fallingTetromino, $scope.gameData.board);
        if (tetrominoCanFall) {

            gameBoardService.modifyBoard($scope.gameData.fallingTetromino, $scope.gameData.board, "remove");
            $scope.gameData.fallingTetromino.y++;
            gameBoardService.modifyBoard($scope.gameData.fallingTetromino, $scope.gameData.board,"add");

        } else {

            //tetromino is solidified. Check for game over and Send the next one.
            if ($scope.gameData.fallingTetromino.y == 0) {
                GameOver();
            } else {

                //solidify tetromino
                gameBoardService.modifyBoard($scope.gameData.fallingTetromino, $scope.gameData.board, "solidify");

                //clear completed lines
                var howManyLinesCompleted = 0;
                while (gameBoardService.checkForTetris($scope.gameData)) {
                    howManyLinesCompleted++;
                }
                if (howManyLinesCompleted > 0) {
                    //give extra points for multiple lines
                    gameData.score = gameData.score + 50 * (howManyLinesCompleted - 1);
                    if (howManyLinesCompleted == 4) {
                        gameData.score = gameData.score + 500;
                    }
                }

                //send next one
                if ($scope.gameData.nextTetromino) {
                    $scope.gameData.fallingTetromino = $scope.gameData.nextTetromino;
                } else {
                    $scope.gameData.fallingTetromino = GetNextRandomTetromino();
                }
                $scope.gameData.nextTetromino = GetNextRandomTetromino();
                $scope.gameData.nextTetrominoSquares = gameBoardService.getTetrominoSquares($scope.gameData.nextTetromino);

                var tetrominoCanFall = gameBoardService.checkIfTetrominoCanMoveDown($scope.gameData.fallingTetromino, $scope.gameData.board);
                if (!tetrominoCanFall) {
                    GameOver();
                } else {
                    gameBoardService.modifyBoard($scope.gameData.fallingTetromino, $scope.gameData.board,"add");
                }


            }

        }

        UpdateView();

        //set the game timer. The delay depends on the current level. The higher the level, the fastest the game moves (harder)
        gameInterval = setTimeout(Animate, GetDelay());

    }


    //call the highscoreService to get the highscores and save result in the scope
    function GetHighscores() {

        highscoreService.get(function (highscores) {
            $scope.highscores = highscores;
            UpdateView();
        }, function (errMsg) {
            alert(errMsg);
        });
    }


    //Sync the scope with the view
    function UpdateView() {

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }

    }


});
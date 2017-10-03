'use strict';

app.controller('gameController', function ($scope, highscoreService, gameData) {

    var boardSize = { w: 10, h: 20 };
    var gameInterval = null;
    var TetrominoType = { LINE: 2, BOX: 3, INVERTED_T: 4, S: 5, Z: 6, L: 7, INVERTED_L: 8 };
    var GameBoardSquareType = { EMPTY: 0, SOLID: 1 };
    var tetrominoColors = ["white", "#4A235A", "red", "green", "blue", "yellow", "orange", "magenta", "lightgray"];

    $scope.gameData = gameData;

    GetHighscores();

    //call the highscoreService to get the highscores and save result in the scope
    function GetHighscores() {

        highscoreService.get(function (highscores) {
            $scope.highscores = highscores;
            UpdateView();
        }, function (errMsg) {
            alert(errMsg);
        });
    }

    //save a new highscore
    $scope.saveHighscore = function () {

        var highscore = new Object();
        highscore.Name = $('#txtName').val();
        highscore.Score = gameData.score;

        if (highscore.Name.length == 0) {
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

    //handle keyboard event. The tetromino is moved or rotated
    $(document).keydown(function (e) {

        if (!$scope.gameData.running) return;

        switch (e.which) {
            case 37: // left

                var tetrominoAfterMovement = { x: $scope.gameData.fallingTetromino.x - 1, y: $scope.gameData.fallingTetromino.y, type: $scope.gameData.fallingTetromino.type, rotation: $scope.gameData.fallingTetromino.rotation };
                if (TetrominoCanGoThere(tetrominoAfterMovement, $scope.gameData.board)) {
                    //remove tetromino from current position
                    AddTetrominoThere($scope.gameData.fallingTetromino, $scope.gameData.board, true);
                    //move tetromino
                    $scope.gameData.fallingTetromino.x--;
                    //add to new position
                    AddTetrominoThere($scope.gameData.fallingTetromino, $scope.gameData.board, false);

                    UpdateView();
                }

                break;

            case 38: // up

                var tetrominoAfterRotation = { x: $scope.gameData.fallingTetromino.x, y: $scope.gameData.fallingTetromino.y, type: $scope.gameData.fallingTetromino.type, rotation: $scope.gameData.fallingTetromino.rotation };
                RotateTetromino(tetrominoAfterRotation);
                if (TetrominoCanGoThere(tetrominoAfterRotation, $scope.gameData.board)) {
                    //remove tetromino from current position
                    AddTetrominoThere($scope.gameData.fallingTetromino, $scope.gameData.board, true);
                    //rotate tetromino
                    RotateTetromino($scope.gameData.fallingTetromino);
                    //add to new position
                    AddTetrominoThere($scope.gameData.fallingTetromino, $scope.gameData.board, false);

                    UpdateView();

                }
                break;

            case 39: // right

                var tetrominoAfterMovement = { x: $scope.gameData.fallingTetromino.x + 1, y: $scope.gameData.fallingTetromino.y, type: $scope.gameData.fallingTetromino.type, rotation: $scope.gameData.fallingTetromino.rotation };
                if (TetrominoCanGoThere(tetrominoAfterMovement, $scope.gameData.board)) {
                    //remove tetromino from current position
                    AddTetrominoThere($scope.gameData.fallingTetromino, $scope.gameData.board, true);
                    //move tetromino
                    $scope.gameData.fallingTetromino.x++;
                    //add to new position
                    AddTetrominoThere($scope.gameData.fallingTetromino, $scope.gameData.board, false);

                    UpdateView();

                }


                break;

            case 40: // down

                var tetrominoAfterMovement = { x: $scope.gameData.fallingTetromino.x, y: $scope.gameData.fallingTetromino.y + 1, type: $scope.gameData.fallingTetromino.type, rotation: $scope.gameData.fallingTetromino.rotation };
                if (TetrominoCanGoThere(tetrominoAfterMovement, $scope.gameData.board)) {
                    //remove tetromino from current position
                    AddTetrominoThere($scope.gameData.fallingTetromino, $scope.gameData.board, true);
                    //move tetromino
                    $scope.gameData.fallingTetromino.y++;
                    //add to new position
                    AddTetrominoThere($scope.gameData.fallingTetromino, $scope.gameData.board, false);

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
        return tetrominoColors[square];

    };

    //returns the color of the game board depending on the level
    $scope.getGameColor = function () {

        var colors = ["#f5f5f5", "#FCF3CF", "#EBEDEF", "#CCD1D1", "#F5EEF8", "#D2B4DE", "#D4EFDF", "#58D68D", "#FEF9E7", "#EDBB99"];
        return colors[(gameData.level % 9) - 1];

    };

    $scope.getTetrominoColor = function (y, x) {
        var square = $scope.gameData.nextTetrominoSquares[y][x];
        if (square == GameBoardSquareType.EMPTY) {
            return $scope.getGameColor();
        } else {
            return tetrominoColors[square];
        }
    }

    $scope.getSquareCssClass = function (y, x) {
        var square = $scope.gameData.board[y][x];

        if (square == GameBoardSquareType.EMPTY) {
            return "Square ";
        } else if (square == GameBoardSquareType.SOLID) {
            return "Square SolidSquare";
        } else {
            return "Square TetrominoSquare";
        }
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

    //Check if this tetromino can move down on the board. It might be blocked by existing solid squares, or by the game board edges
    function TetrominoCanGoThere(tetromino, board, canMoveDown) {

        var tetrominoSquares = GetTetromimoSquares(tetromino);

        for (var y = 0; y < tetrominoSquares.length; y++) {
            for (var x = 0; x < tetrominoSquares[y].length; x++) {

                if (tetrominoSquares[y][x] != null) {

                    var boardY = tetromino.y + y;
                    var boardX = tetromino.x + x;

                    if (canMoveDown)
                        boardY++;

                    //tetromino is blocked by the game board edge
                    if ((boardY > boardSize.h - 1) || (boardY < 0) || (boardX < 0) || (boardX > boardSize.w - 1)) {
                        return false;
                    }

                    //tetromino is blocked by another solid square
                    if (board[boardY][boardX] == GameBoardSquareType.SOLID) {
                        return false;
                    }
                }



            }
        }

        return true;

    }

    //It adds/removes the tetromino to a specific place on the game board. Optionally the tetromino is "solidified", when it touches down on an existing solid square.
    function AddTetrominoThere(tetromino, board, remove, makeSolid) {

        var tetrominoSquares = GetTetromimoSquares(tetromino);
        for (var y = 0; y < tetrominoSquares.length; y++) {
            for (var x = 0; x < tetrominoSquares[y].length; x++) {

                if (tetrominoSquares[y][x] != null && tetrominoSquares[y][x] != GameBoardSquareType.EMPTY) {
                    var boardY = tetromino.y + y;
                    var boardX = tetromino.x + x;

                    if (makeSolid)
                        board[boardY][boardX] = GameBoardSquareType.SOLID;
                    else {

                        if (remove)
                            board[boardY][boardX] = GameBoardSquareType.EMPTY;
                        else
                            board[boardY][boardX] = tetromino.type;
                    }
                }

            }
        }

        return true;

    }

    // a tetromino has 2 or 4 different rotations
    function RotateTetromino(tetromino) {

        switch (tetromino.type) {

            case TetrominoType.LINE:
            case TetrominoType.S:
            case TetrominoType.Z:

                if (tetromino.rotation == 0)
                    tetromino.rotation = 1;
                else
                    tetromino.rotation = 0;

                break;

            case TetrominoType.L:
            case TetrominoType.INVERTED_L:
            case TetrominoType.INVERTED_T:

                if (tetromino.rotation < 3)
                    tetromino.rotation++;
                else
                    tetromino.rotation = 0;

                break;

        }

    }

    //The various tetromino types are defined here. Each one has a series of squares that this function returns
    //as a two dimensional array. Some tetrominos can also be rotated which changes the square structure
    function GetTetromimoSquares(tetromino) {

        var arr = [[], []];
        arr[0] = new Array(3);
        arr[1] = new Array(3);
        arr[2] = new Array(3);
        arr[3] = new Array(3);

        switch (tetromino.type) {

            case TetrominoType.LINE:

                if (tetromino.rotation == 1) {

                    // ----

                    arr[1][0] = TetrominoType.LINE;
                    arr[1][1] = TetrominoType.LINE;
                    arr[1][2] = TetrominoType.LINE;
                    arr[1][3] = TetrominoType.LINE;

                } else {

                    // |
                    // |
                    // |
                    // |

                    arr[0][1] = TetrominoType.LINE;
                    arr[1][1] = TetrominoType.LINE;
                    arr[2][1] = TetrominoType.LINE;
                    arr[3][1] = TetrominoType.LINE;
                }

                break;

            case TetrominoType.BOX:

                arr[0][0] = TetrominoType.BOX;
                arr[0][1] = TetrominoType.BOX;
                arr[1][0] = TetrominoType.BOX;
                arr[1][1] = TetrominoType.BOX;
                break;

            case TetrominoType.L:
                if (tetromino.rotation == 0) {

                    //   |
                    //   |
                    // - -

                    arr[0][2] = TetrominoType.L;
                    arr[1][2] = TetrominoType.L;
                    arr[2][2] = TetrominoType.L;
                    arr[2][1] = TetrominoType.L;


                } else if (tetromino.rotation == 1) {

                    // - - -
                    //     |

                    arr[1][0] = TetrominoType.L;
                    arr[1][1] = TetrominoType.L;
                    arr[1][2] = TetrominoType.L;
                    arr[2][2] = TetrominoType.L;

                } else if (tetromino.rotation == 2) {

                    // - -
                    // |
                    // |

                    arr[1][1] = TetrominoType.L;
                    arr[1][2] = TetrominoType.L;
                    arr[2][1] = TetrominoType.L;
                    arr[3][1] = TetrominoType.L;

                } else if (tetromino.rotation == 3) {

                    // |
                    // - - -

                    arr[1][1] = TetrominoType.L;
                    arr[2][1] = TetrominoType.L;
                    arr[2][2] = TetrominoType.L;
                    arr[2][3] = TetrominoType.L;

                }


                break;

            case TetrominoType.INVERTED_L:

                if (tetromino.rotation == 0) {

                    // |
                    // |
                    // - -

                    arr[0][1] = TetrominoType.INVERTED_L;
                    arr[1][1] = TetrominoType.INVERTED_L;
                    arr[2][1] = TetrominoType.INVERTED_L;
                    arr[2][2] = TetrominoType.INVERTED_L;

                } else if (tetromino.rotation == 1) {

                    //     |
                    // - - -

                    arr[1][2] = TetrominoType.INVERTED_L;
                    arr[2][0] = TetrominoType.INVERTED_L;
                    arr[2][1] = TetrominoType.INVERTED_L;
                    arr[2][2] = TetrominoType.INVERTED_L;

                } else if (tetromino.rotation == 2) {

                    // - -
                    //   |
                    //   |

                    arr[1][1] = TetrominoType.INVERTED_L;
                    arr[1][2] = TetrominoType.INVERTED_L;
                    arr[2][2] = TetrominoType.INVERTED_L;
                    arr[3][2] = TetrominoType.INVERTED_L;


                } else if (tetromino.rotation == 3) {

                    // - - -
                    // |    

                    arr[1][1] = TetrominoType.INVERTED_L;
                    arr[1][2] = TetrominoType.INVERTED_L;
                    arr[1][3] = TetrominoType.INVERTED_L;
                    arr[2][1] = TetrominoType.INVERTED_L;

                }


                break;

            case TetrominoType.INVERTED_T:

                if (tetromino.rotation == 0) {

                    //   |
                    // - - -

                    arr[0][1] = TetrominoType.INVERTED_T;
                    arr[1][0] = TetrominoType.INVERTED_T;
                    arr[1][1] = TetrominoType.INVERTED_T;
                    arr[1][2] = TetrominoType.INVERTED_T;

                } else if (tetromino.rotation == 1) {

                    //   |
                    // - |
                    //   |

                    arr[0] = new Array(2);
                    arr[1] = new Array(2);
                    arr[2] = new Array(2);

                    arr[0][1] = TetrominoType.INVERTED_T;
                    arr[1][1] = TetrominoType.INVERTED_T;
                    arr[2][1] = TetrominoType.INVERTED_T;
                    arr[1][0] = TetrominoType.INVERTED_T;


                } else if (tetromino.rotation == 2) {

                    // - - -
                    //   |  

                    arr[1][0] = TetrominoType.INVERTED_T;
                    arr[1][1] = TetrominoType.INVERTED_T;
                    arr[1][2] = TetrominoType.INVERTED_T;
                    arr[2][1] = TetrominoType.INVERTED_T;

                } else if (tetromino.rotation == 3) {

                    // | 
                    // | -
                    // |

                    arr[0][1] = TetrominoType.INVERTED_T;
                    arr[1][1] = TetrominoType.INVERTED_T;
                    arr[1][2] = TetrominoType.INVERTED_T;
                    arr[2][1] = TetrominoType.INVERTED_T;


                }


                break;

            case TetrominoType.S:

                if (tetromino.rotation == 0) {

                    //   |
                    //   - -
                    //     |

                    arr[0][0] = TetrominoType.S;
                    arr[1][0] = TetrominoType.S;
                    arr[1][1] = TetrominoType.S;
                    arr[2][1] = TetrominoType.S;

                } else if (tetromino.rotation == 1) {

                    //  --
                    // --
                    //   

                    arr[0][1] = TetrominoType.S;
                    arr[0][2] = TetrominoType.S;
                    arr[1][0] = TetrominoType.S;
                    arr[1][1] = TetrominoType.S;


                }


                break;

            case TetrominoType.Z:

                if (tetromino.rotation == 0) {

                    //     |
                    //   - -
                    //   |

                    arr[0][1] = TetrominoType.Z;
                    arr[1][0] = TetrominoType.Z;
                    arr[1][1] = TetrominoType.Z;
                    arr[2][0] = TetrominoType.Z;

                } else if (tetromino.rotation == 1) {

                    //  --
                    //   --
                    //   

                    arr[0][0] = TetrominoType.Z;
                    arr[0][1] = TetrominoType.Z;
                    arr[1][1] = TetrominoType.Z;
                    arr[1][2] = TetrominoType.Z;


                }



                break;

        }

        return arr;
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

        $scope.tetrads = $scope.tetrads + '\n' + randomTetrominoType;

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
        $scope.gameData.level = 1;
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
        $scope.gameData.nextTetrominoSquares = GetTetromimoSquares($scope.gameData.nextTetromino);

        //initialize game board
        $scope.gameData.board = new Array(boardSize.h);
        for (var y = 0; y < boardSize.h; y++) {
            $scope.gameData.board[y] = new Array(boardSize.w);
            for (var x = 0; x < boardSize.w; x++)
                $scope.gameData.board[y][x] = 0;
        }

        //show the first falling tetromino 
        AddTetrominoThere($scope.gameData.fallingTetromino, $scope.gameData.board);


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

        var tetrominoCanFall = TetrominoCanGoThere($scope.gameData.fallingTetromino, $scope.gameData.board, true);
        if (tetrominoCanFall) {

            AddTetrominoThere($scope.gameData.fallingTetromino, $scope.gameData.board, true);
            $scope.gameData.fallingTetromino.y++;
            AddTetrominoThere($scope.gameData.fallingTetromino, $scope.gameData.board, false);

        } else {

            //tetromino is solidified. Check for game over and Send the next one.
            if ($scope.gameData.fallingTetromino.y == 0) {
                GameOver();
            } else {

                //solidify tetromino
                AddTetrominoThere($scope.gameData.fallingTetromino, $scope.gameData.board, false, true);

                //clear completed lines
                var howManyLinesCompleted = 0;
                while (CheckForTetris()) {
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
                $scope.gameData.nextTetrominoSquares = GetTetromimoSquares($scope.gameData.nextTetromino);

                var tetrominoCanFall = TetrominoCanGoThere($scope.gameData.fallingTetromino, $scope.gameData.board, true);
                if (!tetrominoCanFall) {
                    GameOver();
                } else {
                    AddTetrominoThere($scope.gameData.fallingTetromino, $scope.gameData.board, false);
                }


            }

        }

        UpdateView();

        //set the game timer. The delay depends on the current level. The higher the level, the fastest the game moves (harder)
        gameInterval = setTimeout(Animate, GetDelay());

    }

    //check if any lines were completed
    function CheckForTetris() {

        for (var y = boardSize.h - 1; y > 0; y--) {

            var lineIsComplete = true;
            for (var x = 0; x < boardSize.w; x++) {
                if ($scope.gameData.board[y][x] != GameBoardSquareType.SOLID) {
                    lineIsComplete = false;
                    break;
                }
            }

            if (lineIsComplete) {
                $scope.gameData.lines++;
                gameData.score = gameData.score + 100 + (gameData.level - 1) * 50;

                //move everything downwards
                for (var fallingY = y; fallingY > 0; fallingY--) {
                    for (var x = 0; x < boardSize.w; x++) {
                        $scope.gameData.board[fallingY][x] = $scope.gameData.board[fallingY - 1][x];
                    }
                }


                //check if current level is completed
                if ($scope.gameData.lines % 5 == 0) {
                    gameData.level++;
                }

                return true;


            }

        }

        return false;

    }

    //Sync the scope with the view
    function UpdateView() {

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }

    }


});
'use strict';

app.controller('gameController', function ($scope) {

    var boardSize = { w: 10, h: 20 };
    var gameInterval = null;
    var TetrominoType = { LINE: 2, BOX: 3, INVERTED_T: 4, S: 5, Z: 6, L: 7, INVERTED_L: 8 };
    var GameBoardSquareType = { EMPTY: 0, SOLID: 1 };


    $(document).keydown(function (e) {

        if (!$scope.running) return;

        switch (e.which) {
            case 37: // left

                var tetrominoAfterMovement = { x: $scope.fallingTetromino.x - 1, y: $scope.fallingTetromino.y, type: $scope.fallingTetromino.type, rotation: $scope.fallingTetromino.rotation };
                if (TetrominoCanGoThere(tetrominoAfterMovement, $scope.board)) {
                    AddTetrominoThere($scope.fallingTetromino, $scope.board, true);
                    $scope.fallingTetromino.x--;
                }

                break;

            case 38: // up

                var tetrominoAfterRotation = { x: $scope.fallingTetromino.x, y: $scope.fallingTetromino.y, type: $scope.fallingTetromino.type, rotation: $scope.fallingTetromino.rotation };
                RotateTetromino(tetrominoAfterRotation);
                if (TetrominoCanGoThere(tetrominoAfterRotation, $scope.board)) {
                    AddTetrominoThere($scope.fallingTetromino, $scope.board, true);
                    RotateTetromino($scope.fallingTetromino);
                }
                break;

            case 39: // right

                var tetrominoAfterMovement = { x: $scope.fallingTetromino.x + 1, y: $scope.fallingTetromino.y, type: $scope.fallingTetromino.type, rotation: $scope.fallingTetromino.rotation };
                if (TetrominoCanGoThere(tetrominoAfterMovement, $scope.board)) {
                    AddTetrominoThere($scope.fallingTetromino, $scope.board, true);
                    $scope.fallingTetromino.x++;
                }


                break;

            case 40: // down

                var tetrominoAfterMovement = { x: $scope.fallingTetromino.x, y: $scope.fallingTetromino.y + 1, type: $scope.fallingTetromino.type, rotation: $scope.fallingTetromino.rotation };
                if (TetrominoCanGoThere(tetrominoAfterMovement, $scope.board)) {
                    AddTetrominoThere($scope.fallingTetromino, $scope.board, true);
                    $scope.fallingTetromino.y++;
                }


                break;

            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)

    });

    $scope.startGame = function () {

        InitializeGame();

        $scope.running = true;
        gameInterval = setTimeout(Animate, GetDelay());
    };

    $scope.getCellColor = function (y, x) {

        var colors = ["white", "black", "red", "green", "blue", "yellow", "orange", "magenta", "lightgray"];

        return colors[$scope.board[y][x]];

    };

    //Returns the game delay depending on the level. The higher the level, the faster the tetrimino falls
    function GetDelay() {
        return (1 - (($scope.level - 1) * 100)) * 1000;
    }

    //Check if this tetromino can move down on the board. It might be blocked by existing solid squares, or by the game board edges
    function TetrominoCanGoThere(tetromino, board, canMoveDown) {

        var tetrominoSquares = GetTetromimoSquares(tetromino);
        for (var y = 0; y < tetrominoSquares.length; y++) {
            for (var x = 0; x < tetrominoSquares[y].length; x++) {

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
        switch (tetromino.type) {

            case TetrominoType.LINE:

                if (tetromino.rotation == 0) {
                    // ----
                    arr[0][0] = TetrominoType.LINE;
                    arr[0][1] = TetrominoType.LINE;
                    arr[0][2] = TetrominoType.LINE;
                    arr[0][3] = TetrominoType.LINE;
                } else {
                    // |
                    // |
                    // |
                    // |

                    arr[0] = new Array(1);
                    arr[1] = new Array(1);
                    arr[2] = new Array(1);
                    arr[3] = new Array(1);

                    arr[0][0] = TetrominoType.LINE;
                    arr[1][0] = TetrominoType.LINE;
                    arr[2][0] = TetrominoType.LINE;
                    arr[3][0] = TetrominoType.LINE;
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

                    // |
                    // - - -

                    arr[0][0] = TetrominoType.L;
                    arr[1][0] = TetrominoType.L;
                    arr[1][1] = TetrominoType.L;
                    arr[1][2] = TetrominoType.L;

                } else if (tetromino.rotation == 1) {

                    //   |
                    //   |
                    // - -

                    arr[0] = new Array(2);
                    arr[1] = new Array(2);
                    arr[2] = new Array(2);

                    arr[0][1] = TetrominoType.L;
                    arr[1][1] = TetrominoType.L;
                    arr[2][1] = TetrominoType.L;
                    arr[2][0] = TetrominoType.L;


                } else if (tetromino.rotation == 2) {

                    // - - -
                    //     |

                    arr[0][0] = TetrominoType.L;
                    arr[0][1] = TetrominoType.L;
                    arr[0][2] = TetrominoType.L;
                    arr[1][2] = TetrominoType.L;

                } else if (tetromino.rotation == 3) {

                    // - -
                    // |
                    // |

                    arr[0] = new Array(2);
                    arr[1] = new Array(2);
                    arr[2] = new Array(2);

                    arr[0][0] = TetrominoType.L;
                    arr[0][1] = TetrominoType.L;
                    arr[1][0] = TetrominoType.L;
                    arr[2][0] = TetrominoType.L;

                } 


                break;

            case TetrominoType.INVERTED_L:

                arr[0][2] = TetrominoType.INVERTED_L;
                arr[1][0] = TetrominoType.INVERTED_L;
                arr[1][1] = TetrominoType.INVERTED_L;
                arr[1][2] = TetrominoType.INVERTED_L;
                break;

            case TetrominoType.INVERTED_T:

                arr[0][1] = TetrominoType.INVERTED_T;
                arr[1][0] = TetrominoType.INVERTED_T;
                arr[1][1] = TetrominoType.INVERTED_T;
                arr[1][2] = TetrominoType.INVERTED_T;
                break;

            case TetrominoType.S:

                arr[0][1] = TetrominoType.S;
                arr[0][2] = TetrominoType.S;
                arr[1][0] = TetrominoType.S;
                arr[1][1] = TetrominoType.S;
                break;

            case TetrominoType.Z:

                arr[0][0] = TetrominoType.Z;
                arr[0][1] = TetrominoType.Z;
                arr[1][1] = TetrominoType.Z;
                arr[1][2] = TetrominoType.Z;
                break;

        }

        return arr;
    }

    function GetNextRandomTetromino() {

        var randomTetrominoType = Math.floor((Math.random() * 7) + 2);

        $scope.tetrads = $scope.tetrads + '\n' + randomTetrominoType;

        var tetromino = { x: 4, y: 0, type: TetrominoType.L , rotation: 0 };
        return tetromino;
    }

    function InitializeGame() {
        $scope.running = false;

        $scope.lines = 0;
        $scope.score = 0;
        $scope.level = 1;
        $scope.board = new Array(boardSize.h);
        for (var y = 0; y < boardSize.h; y++) {
            $scope.board[y] = new Array(boardSize.w);
            for (var x = 0; x < boardSize.w; x++)
                $scope.board[y][x] = 0;
        }

        $scope.fallingTetromino = GetNextRandomTetromino();
        AddTetrominoThere($scope.fallingTetromino, $scope.board);


    };

    function Animate() {

        if (!$scope.running) return;

        var tetrominoCanFall = TetrominoCanGoThere($scope.fallingTetromino, $scope.board, true);
        if (tetrominoCanFall) {

            AddTetrominoThere($scope.fallingTetromino, $scope.board, true);
            $scope.fallingTetromino.y++;
            AddTetrominoThere($scope.fallingTetromino, $scope.board, false);

        } else {

            //tetromino is solidified. Check for game over and Send the next one.
            if ($scope.fallingTetromino.y == 0) {
                //game over!
                $scope.running = false;
                alert("Game Over!");
            } else {

                AddTetrominoThere($scope.fallingTetromino, $scope.board, false, true);
                $scope.fallingTetromino = GetNextRandomTetromino();
                AddTetrominoThere($scope.fallingTetromino, $scope.board, false);
            }



        }

        $scope.$apply();


        gameInterval = setTimeout(Animate, GetDelay());

    }




});
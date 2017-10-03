'use strict';

// this factory contains the definition of tetrominos and their rotations. It also contains functions that
// manipulate the game board array by moving tetrominos, solidifying, removing etc.

app.factory('gameBoardService', function () {

    var factory = {};

    //define various constants
    factory.boardSize = { w: 10, h: 20 };
    factory.TetrominoTypeEnum = { LINE: 2, BOX: 3, INVERTED_T: 4, S: 5, Z: 6, L: 7, INVERTED_L: 8 };
    factory.TetrominoColors = ["white", "darkviolet", "red", "green", "blue", "yellow", "orange", "magenta", "lightgray"];
    factory.GameBoardColors = ["#2200FF", "#0066FF", "#00C3FF", "#00FFDA", "#00FF6E", "#C0FF00", "#F3FF00", "#FFE100", "#FFAA00", "#FF7400", "#FF2B00", "#FF0000", "#000000"];
    factory.GameBoardSquareTypeEnum = { EMPTY: 0, SOLID: 1 };

    //The various tetromino types are defined here. Each one has a series of squares that this function returns
    //as a two dimensional array. Some tetrominos can also be rotated which changes the square structure
    factory.getTetrominoSquares = function (tetromino) {

        var arr = [[], []];
        arr[0] = new Array(3);
        arr[1] = new Array(3);
        arr[2] = new Array(3);
        arr[3] = new Array(3);

        switch (tetromino.type) {

            case factory.TetrominoTypeEnum.LINE:

                if (tetromino.rotation == 1) {

                    // ----

                    arr[1][0] = factory.TetrominoTypeEnum.LINE;
                    arr[1][1] = factory.TetrominoTypeEnum.LINE;
                    arr[1][2] = factory.TetrominoTypeEnum.LINE;
                    arr[1][3] = factory.TetrominoTypeEnum.LINE;

                } else {

                    // |
                    // |
                    // |
                    // |

                    arr[0][1] = factory.TetrominoTypeEnum.LINE;
                    arr[1][1] = factory.TetrominoTypeEnum.LINE;
                    arr[2][1] = factory.TetrominoTypeEnum.LINE;
                    arr[3][1] = factory.TetrominoTypeEnum.LINE;
                }

                break;

            case factory.TetrominoTypeEnum.BOX:

                arr[0][0] = factory.TetrominoTypeEnum.BOX;
                arr[0][1] = factory.TetrominoTypeEnum.BOX;
                arr[1][0] = factory.TetrominoTypeEnum.BOX;
                arr[1][1] = factory.TetrominoTypeEnum.BOX;
                break;

            case factory.TetrominoTypeEnum.L:
                if (tetromino.rotation == 0) {

                    //   |
                    //   |
                    // - -

                    arr[0][2] = factory.TetrominoTypeEnum.L;
                    arr[1][2] = factory.TetrominoTypeEnum.L;
                    arr[2][2] = factory.TetrominoTypeEnum.L;
                    arr[2][1] = factory.TetrominoTypeEnum.L;


                } else if (tetromino.rotation == 1) {

                    // - - -
                    //     |

                    arr[1][0] = factory.TetrominoTypeEnum.L;
                    arr[1][1] = factory.TetrominoTypeEnum.L;
                    arr[1][2] = factory.TetrominoTypeEnum.L;
                    arr[2][2] = factory.TetrominoTypeEnum.L;

                } else if (tetromino.rotation == 2) {

                    // - -
                    // |
                    // |

                    arr[1][1] = factory.TetrominoTypeEnum.L;
                    arr[1][2] = factory.TetrominoTypeEnum.L;
                    arr[2][1] = factory.TetrominoTypeEnum.L;
                    arr[3][1] = factory.TetrominoTypeEnum.L;

                } else if (tetromino.rotation == 3) {

                    // |
                    // - - -

                    arr[1][1] = factory.TetrominoTypeEnum.L;
                    arr[2][1] = factory.TetrominoTypeEnum.L;
                    arr[2][2] = factory.TetrominoTypeEnum.L;
                    arr[2][3] = factory.TetrominoTypeEnum.L;

                }


                break;

            case factory.TetrominoTypeEnum.INVERTED_L:

                if (tetromino.rotation == 0) {

                    // |
                    // |
                    // - -

                    arr[0][1] = factory.TetrominoTypeEnum.INVERTED_L;
                    arr[1][1] = factory.TetrominoTypeEnum.INVERTED_L;
                    arr[2][1] = factory.TetrominoTypeEnum.INVERTED_L;
                    arr[2][2] = factory.TetrominoTypeEnum.INVERTED_L;

                } else if (tetromino.rotation == 1) {

                    //     |
                    // - - -

                    arr[1][2] = factory.TetrominoTypeEnum.INVERTED_L;
                    arr[2][0] = factory.TetrominoTypeEnum.INVERTED_L;
                    arr[2][1] = factory.TetrominoTypeEnum.INVERTED_L;
                    arr[2][2] = factory.TetrominoTypeEnum.INVERTED_L;

                } else if (tetromino.rotation == 2) {

                    // - -
                    //   |
                    //   |

                    arr[1][1] = factory.TetrominoTypeEnum.INVERTED_L;
                    arr[1][2] = factory.TetrominoTypeEnum.INVERTED_L;
                    arr[2][2] = factory.TetrominoTypeEnum.INVERTED_L;
                    arr[3][2] = factory.TetrominoTypeEnum.INVERTED_L;


                } else if (tetromino.rotation == 3) {

                    // - - -
                    // |    

                    arr[1][1] = factory.TetrominoTypeEnum.INVERTED_L;
                    arr[1][2] = factory.TetrominoTypeEnum.INVERTED_L;
                    arr[1][3] = factory.TetrominoTypeEnum.INVERTED_L;
                    arr[2][1] = factory.TetrominoTypeEnum.INVERTED_L;

                }


                break;

            case factory.TetrominoTypeEnum.INVERTED_T:

                if (tetromino.rotation == 0) {

                    //   |
                    // - - -

                    arr[0][1] = factory.TetrominoTypeEnum.INVERTED_T;
                    arr[1][0] = factory.TetrominoTypeEnum.INVERTED_T;
                    arr[1][1] = factory.TetrominoTypeEnum.INVERTED_T;
                    arr[1][2] = factory.TetrominoTypeEnum.INVERTED_T;

                } else if (tetromino.rotation == 1) {

                    //   |
                    // - |
                    //   |

                    arr[0][1] = factory.TetrominoTypeEnum.INVERTED_T;
                    arr[1][1] = factory.TetrominoTypeEnum.INVERTED_T;
                    arr[2][1] = factory.TetrominoTypeEnum.INVERTED_T;
                    arr[1][0] = factory.TetrominoTypeEnum.INVERTED_T;


                } else if (tetromino.rotation == 2) {

                    // - - -
                    //   |  

                    arr[1][0] = factory.TetrominoTypeEnum.INVERTED_T;
                    arr[1][1] = factory.TetrominoTypeEnum.INVERTED_T;
                    arr[1][2] = factory.TetrominoTypeEnum.INVERTED_T;
                    arr[2][1] = factory.TetrominoTypeEnum.INVERTED_T;

                } else if (tetromino.rotation == 3) {

                    // | 
                    // | -
                    // |

                    arr[0][1] = factory.TetrominoTypeEnum.INVERTED_T;
                    arr[1][1] = factory.TetrominoTypeEnum.INVERTED_T;
                    arr[1][2] = factory.TetrominoTypeEnum.INVERTED_T;
                    arr[2][1] = factory.TetrominoTypeEnum.INVERTED_T;


                }


                break;

            case factory.TetrominoTypeEnum.S:

                if (tetromino.rotation == 0) {

                    //   |
                    //   - -
                    //     |

                    arr[0][0] = factory.TetrominoTypeEnum.S;
                    arr[1][0] = factory.TetrominoTypeEnum.S;
                    arr[1][1] = factory.TetrominoTypeEnum.S;
                    arr[2][1] = factory.TetrominoTypeEnum.S;

                } else if (tetromino.rotation == 1) {

                    //  --
                    // --
                    //   

                    arr[0][1] = factory.TetrominoTypeEnum.S;
                    arr[0][2] = factory.TetrominoTypeEnum.S;
                    arr[1][0] = factory.TetrominoTypeEnum.S;
                    arr[1][1] = factory.TetrominoTypeEnum.S;


                }


                break;

            case factory.TetrominoTypeEnum.Z:

                if (tetromino.rotation == 0) {

                    //     |
                    //   - -
                    //   |

                    arr[0][1] = factory.TetrominoTypeEnum.Z;
                    arr[1][0] = factory.TetrominoTypeEnum.Z;
                    arr[1][1] = factory.TetrominoTypeEnum.Z;
                    arr[2][0] = factory.TetrominoTypeEnum.Z;

                } else if (tetromino.rotation == 1) {

                    //  --
                    //   --
                    //   

                    arr[0][0] = factory.TetrominoTypeEnum.Z;
                    arr[0][1] = factory.TetrominoTypeEnum.Z;
                    arr[1][1] = factory.TetrominoTypeEnum.Z;
                    arr[1][2] = factory.TetrominoTypeEnum.Z;

                }

                break;

        }

        return arr;
    };

    // a tetromino has 2 or 4 different rotations
    factory.rotateTetromino = function (tetromino) {

        switch (tetromino.type) {

            case factory.TetrominoTypeEnum.LINE:
            case factory.TetrominoTypeEnum.S:
            case factory.TetrominoTypeEnum.Z:

                if (tetromino.rotation == 0)
                    tetromino.rotation = 1;
                else
                    tetromino.rotation = 0;

                break;

            case factory.TetrominoTypeEnum.L:
            case factory.TetrominoTypeEnum.INVERTED_L:
            case factory.TetrominoTypeEnum.INVERTED_T:

                if (tetromino.rotation < 3)
                    tetromino.rotation++;
                else
                    tetromino.rotation = 0;

                break;

        }

    }

    //Check if this tetromino can move in this coordinate. It might be blocked by existing solid squares, or by the game board edges
    factory.checkIfTetrominoCanGoThere = function (tetromino, board) {

        var tetrominoSquares = factory.getTetrominoSquares(tetromino);

        for (var y = 0; y < tetrominoSquares.length; y++) {
            for (var x = 0; x < tetrominoSquares[y].length; x++) {

                if (tetrominoSquares[y][x] != null) {

                    var boardY = tetromino.y + y;
                    var boardX = tetromino.x + x;

                    //tetromino is blocked by the game board edge
                    if ((boardY > factory.boardSize.h - 1) || (boardY < 0) || (boardX < 0) || (boardX > factory.boardSize.w - 1)) {
                        return false;
                    }

                    //tetromino is blocked by another solid square
                    if (board[boardY][boardX] == factory.GameBoardSquareTypeEnum.SOLID) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    //Check if this tetromino can move down on the board. It might be blocked by existing solid squares.
    factory.checkIfTetrominoCanMoveDown = function (tetromino, board) {

        //create a shallow copy of the tetromino so that we can change the Y coordinate 
        var newTetromino = JSON.parse(JSON.stringify(tetromino));
        newTetromino.y++;
        return factory.checkIfTetrominoCanGoThere(newTetromino, board);
    }

    //This method can be used for 3 different actions:
    //1. add a tetromino on the board (action="add")
    //2. remove a tetromino from the board (action="remove")
    //3. solidify a tetromino on the board (action="solidify")
    factory.modifyBoard = function (tetromino, board, action) {

        var tetrominoSquares = factory.getTetrominoSquares(tetromino);
        for (var y = 0; y < tetrominoSquares.length; y++) {
            for (var x = 0; x < tetrominoSquares[y].length; x++) {

                if (tetrominoSquares[y][x] != null && tetrominoSquares[y][x] != factory.GameBoardSquareTypeEnum.EMPTY) {
                    var boardY = tetromino.y + y;
                    var boardX = tetromino.x + x;

                    if (action == "solidify")
                        board[boardY][boardX] = factory.GameBoardSquareTypeEnum.SOLID;
                    else if (action == "remove")
                        board[boardY][boardX] = factory.GameBoardSquareTypeEnum.EMPTY;
                    else if (action == "add")
                        board[boardY][boardX] = tetromino.type;

                }

            }
        }


    }

    //check if any lines were completed
    factory.checkForTetris = function (gameData) {

        for (var y = factory.boardSize.h - 1; y > 0; y--) {

            var lineIsComplete = true;
            for (var x = 0; x < factory.boardSize.w; x++) {
                if (gameData.board[y][x] != factory.GameBoardSquareTypeEnum.SOLID) {
                    lineIsComplete = false;
                    break;
                }
            }

            if (lineIsComplete) {
                gameData.lines++;
                gameData.score = gameData.score + 100 + (gameData.level - 1) * 50;

                //move everything downwards
                for (var fallingY = y; fallingY > 0; fallingY--) {
                    for (var x = 0; x < factory.boardSize.w; x++) {
                        gameData.board[fallingY][x] = gameData.board[fallingY - 1][x];
                    }
                }

                //check if current level is completed
                if (gameData.lines % 5 == 0) {
                    gameData.level++;
                }

                return true;


            }

        }

        return false;

    }

    return factory;
});




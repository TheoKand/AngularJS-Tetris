'use strict';

var GameBoard = {

    BoardSize : { w: 10, h: 20 },
    Colors : ["#0066FF", "#FFE100", "#00C3FF", "#00FFDA", "#00FF6E", "#C0FF00", "#F3FF00", "#2200FF", "#FFAA00", "#FF7400", "#FF2B00", "#FF0000", "#000000"],

    //Check if this tetromino can move in this coordinate. It might be blocked by existing solid squares, or by the game board edges
    checkIfTetrominoCanGoThere: function (tetromino, board) {

        var tetrominoSquares = Tetromino.getSquares(tetromino);

        for (var y = 0; y < tetrominoSquares.length; y++) {
            for (var x = 0; x < tetrominoSquares[y].length; x++) {

                if (tetrominoSquares[y][x] != null) {

                    var boardY = tetromino.y + y;
                    var boardX = tetromino.x + x;

                    //tetromino is blocked by the game board edge
                    if ((boardY > GameBoard.BoardSize.h - 1) || (boardY < 0) || (boardX < 0) || (boardX > GameBoard.BoardSize.w - 1)) {
                        return false;
                    }

                    //tetromino is blocked by another solid square
                    if (board[boardY][boardX] < 0) {
                        return false;
                    }
                }
            }
        }

        return true;
    },

    //Check if this tetromino can move down on the board. It might be blocked by existing solid squares.
    checkIfTetrominoCanMoveDown: function (tetromino, board) {

        //create a shallow copy of the tetromino so that we can change the Y coordinate 
        var newTetromino = JSON.parse(JSON.stringify(tetromino));
        newTetromino.y++;
        return GameBoard.checkIfTetrominoCanGoThere(newTetromino, board);
    },

    //This method can be used for 3 different actions:
    //1. add a tetromino on the board (action="add")
    //2. remove a tetromino from the board (action="remove")
    //3. solidify a tetromino on the board (action="solidify")
    modifyBoard: function (tetromino, board, action) {

        var tetrominoSquares = Tetromino.getSquares(tetromino);
        for (var y = 0; y < tetrominoSquares.length; y++) {
            for (var x = 0; x < tetrominoSquares[y].length; x++) {

                if (tetrominoSquares[y][x] != null && tetrominoSquares[y][x] != 0) {
                    var boardY = tetromino.y + y;
                    var boardX = tetromino.x + x;

                    if (action == "solidify")
                        board[boardY][boardX] = -tetromino.type;
                    else if (action == "remove")
                        board[boardY][boardX] = 0;
                    else if (action == "add")
                        board[boardY][boardX] = tetromino.type;

                }

            }
        }

    },

    //check if any lines were completed
    checkForTetris: function (gameData) {

        for (var y = GameBoard.BoardSize.h - 1; y > 0; y--) {

            var lineIsComplete = true;
            for (var x = 0; x < GameBoard.BoardSize.w; x++) {
                if (gameData.board[y][x] >= 0) {
                    lineIsComplete = false;
                    break;
                }
            }

            if (lineIsComplete) {
                gameData.lines++;
                gameData.score = gameData.score + 100 + (gameData.level - 1) * 50;

                //move everything downwards
                for (var fallingY = y; fallingY > 0; fallingY--) {
                    for (var x = 0; x < GameBoard.BoardSize.w; x++) {
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

    },

};
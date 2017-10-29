'use strict';

const Game = {

    BoardSize: { w: 10, h: 20 },
    Colors: ["#0066FF", "#FFE100", "#00C3FF", "#00FFDA", "#00FF6E", "#C0FF00", "#F3FF00", "#2200FF", "#FFAA00", "#FF7400", "#FF2B00", "#FF0000", "#000000"],
    BoardActions: { ADD: 0, REMOVE: 1, SOLIDIFY: 2 },

    //Check if this tetromino can move in this coordinate. It might be blocked by existing solid squares, or by the game board edges
    checkIfTetrominoCanGoThere: function (tetromino, board) {

        let tetrominoSquares = Tetromino.getSquares(tetromino);

        for (let y = 0; y < tetrominoSquares.length; y++) {
            for (let x = 0; x < tetrominoSquares[y].length; x++) {

                if (tetrominoSquares[y][x] != null) {

                    let boardY = tetromino.y + y;
                    let boardX = tetromino.x + x;

                    //tetromino is blocked by the game board edge
                    if ((boardY > Game.BoardSize.h - 1) || (boardY < 0) || (boardX < 0) || (boardX > Game.BoardSize.w - 1)) {
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
        let newTetromino = JSON.parse(JSON.stringify(tetromino));
        newTetromino.y++;
        return Game.checkIfTetrominoCanGoThere(newTetromino, board);
    },

    //This method can be used for 3 different actions: add a tetromino on the board, remove and solidify 
    modifyBoard: function (tetromino, board, boardAction) {

        let tetrominoSquares = Tetromino.getSquares(tetromino);
        for (let y = 0; y < tetrominoSquares.length; y++) {
            for (let x = 0; x < tetrominoSquares[y].length; x++) {

                if (tetrominoSquares[y][x] != null && tetrominoSquares[y][x] != 0) {
                    let boardY = tetromino.y + y;
                    let boardX = tetromino.x + x;

                    if (boardAction == Game.BoardActions.SOLIDIFY)
                        board[boardY][boardX] = -tetromino.type;
                    else if (boardAction == Game.BoardActions.REMOVE)
                        board[boardY][boardX] = 0;
                    else if (boardAction == Game.BoardActions.ADD)
                        board[boardY][boardX] = tetromino.type;

                }

            }
        }

    },

    //check if any lines were completed
    checkForTetris: function (gameState) {

        for (let y = Game.BoardSize.h - 1; y > 0; y--) {

            let lineIsComplete = true;
            for (let x = 0; x < Game.BoardSize.w; x++) {
                if (gameState.board[y][x] >= 0) {
                    lineIsComplete = false;
                    break;
                }
            }

            if (lineIsComplete) {
                gameState.lines++;
                gameState.score = gameState.score + 100 + (gameState.level - 1) * 50;

                //move everything downwards
                for (let fallingY = y; fallingY > 0; fallingY--) {
                    for (let x = 0; x < Game.BoardSize.w; x++) {
                        gameState.board[fallingY][x] = gameState.board[fallingY - 1][x];
                    }
                }

                //check if current level is completed
                if (gameState.lines % 5 == 0) {
                    gameState.level++;
                }

                return true;


            }

        }

        return false;

    },

    //returns the color of the game board depending on the level
    getGameColor: function (gameState) {
        if (gameState)
            return Game.Colors[(gameState.level % Game.Colors.length)];
    },

    //returns the color of a gameboard square (cell) depending on if it's empty, solidified or occupied by a falling tetromino
    getSquareColor: function (gameState, y, x) {

        let square = gameState.board[y][x];

        //a negative value means the square is solidified
        if (square < 0) {
            return Tetromino.Colors[Math.abs(square)];
        } else {
            //zero means the square is empty, so white is returned from the array. A positive value means the square contains a falling tetromino.
            return Tetromino.Colors[square];
        }

    },

    //returns the css class of a gameboard square (cell) depending on if it's empty, solidified or occupied by a falling tetromino
    getSquareCssClass: function (gameState, y, x) {
        let square = gameState.board[y][x];

        //zero means the square is empty
        if (square == 0) {
            return "Square ";
        } else if (square < 0) {
            //a negative value means the square is solidified
            return "Square SolidSquare";
        } else {
            //A positive value means the square contains a falling tetromino.
            return "Square TetrominoSquare";
        }
    },

    //returns the color of the next tetromino. The next tetromino is displayed while the current tetromino is being played
    getNextTetrominoColor: function (gameState, y, x) {
        let square = gameState.nextTetrominoSquares[y][x];
        if (square == 0) {
            return $scope.getGameColor();
        } else {
            return Tetromino.Colors[square];
        }
    },

    //Returns the game delay depending on the level. The higher the level, the faster the tetrimino falls
    getDelay: function (gameState) {

        let delay = 1000;
        if (gameState.level < 5) {
            delay = delay - (120 * (gameState.level - 1));
        } else if (gameState.level < 15) {
            delay = delay - (58 * (gameState.level - 1));
        } else {
            delay = 220 - (gameState.level - 15) * 8;
        }
        return delay;

    },

    //this object holds all the information that makes up the game state
    gameState: function () {

        this.startButtonText = "Start";
        this.level = 1;
        this.score = 0;
        this.lines = 0;
        this.running = false;
        this.paused = false;
        this.fallingTetromino = null;
        this.nextTetromino = null;
        this.nextTetrominoSquares = null;
        this.board = null;
        this.tetrominoBag = [];
        this.fullTetrominoBag = [0, 5, 5, 5, 5, 5, 5, 5];
        this.tetrominoHistory = "";
        this.isHighscore = false;

    }

};
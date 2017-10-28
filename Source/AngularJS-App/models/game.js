'use strict';

const Game = {

    BoardSize : { w: 10, h: 20 },
    Colors : ["#0066FF", "#FFE100", "#00C3FF", "#00FFDA", "#00FF6E", "#C0FF00", "#F3FF00", "#2200FF", "#FFAA00", "#FF7400", "#FF2B00", "#FF0000", "#000000"],

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

    //This method can be used for 3 different actions:
    //1. add a tetromino on the board (action="add")
    //2. remove a tetromino from the board (action="remove")
    //3. solidify a tetromino on the board (action="solidify")
    modifyBoard: function (tetromino, board, action) {

        let tetrominoSquares = Tetromino.getSquares(tetromino);
        for (let y = 0; y < tetrominoSquares.length; y++) {
            for (let x = 0; x < tetrominoSquares[y].length; x++) {

                if (tetrominoSquares[y][x] != null && tetrominoSquares[y][x] != 0) {
                    let boardY = tetromino.y + y;
                    let boardX = tetromino.x + x;

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

    //this object holds all the information that makes up the game state
    gameState: function () {

        this.startButtonText= "Start";
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
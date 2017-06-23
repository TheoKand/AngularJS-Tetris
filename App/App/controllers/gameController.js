'use strict';

app.controller('gameController', function ($scope) {

    var boardSize = { w: 10, h: 20 };
    var gameInterval = null;
    var TetrominoType = { LINE:2, BOX: 3, INVERTED_T: 4, S: 5, Z: 6, L: 7, INVERTED_L: 8 };
    var GameBoardSquareType = { EMPTY:0 , SOLID:1};

    //start the colony
    $scope.startGame = function () {

        InitializeGame();

        $scope.running = true;
        gameInterval = setTimeout(Animate, GetDelay());
    };

    $scope.getCellColor = function (x, y) {

        var colors = ["white", "black", "red", "green", "blue", "yellow", "orange", "magenta", "lightgray"];

        return colors[$scope.board[x][y]];

    };

    function GetDelay() {
        return (1 - (($scope.level - 1) * 150)) * 1000;
    }

    function TetrominoCanGoThere(tetromino, board,canMoveDown) {

        var tetrominoSquares = GetTetromimoSquares(tetromino.type);
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

    function AddTetrominoThere(tetromino, board,remove,makeSolid) {

        var tetrominoSquares = GetTetromimoSquares(tetromino.type);
        for (var y = 0; y < tetrominoSquares.length; y++) {
            for (var x = 0; x < tetrominoSquares[y].length; x++) {

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

        return true;

    }



    function GetTetromimoSquares(type) {
        
        var arr = [[],[]];
        switch (type) {

            case TetrominoType.LINE:
                

                arr[0][0] = TetrominoType.LINE;
                arr[0][1] = TetrominoType.LINE;
                arr[0][2] = TetrominoType.LINE;
                arr[0][3] = TetrominoType.LINE;
                
                break;
            case TetrominoType.BOX:

                arr[0][0] = TetrominoType.BOX;
                arr[0][1] = TetrominoType.BOX;
                arr[1][0] = TetrominoType.BOX;
                arr[1][1] = TetrominoType.BOX;
                break;

        }

        return arr;
    }

    function InitializeGame() {
        $scope.running = false;
        
        $scope.lines = 0;
        $scope.score = 0;
        $scope.level = 1;
        $scope.board = new Array(boardSize.h);
        for (var x = 0; x < boardSize.h; x++) {
            $scope.board[x] = new Array(boardSize.w);
            for (var y = 0; y < boardSize.w; y++)
                $scope.board[x][y] = 0;
        }

        $scope.fallingTetromino = { x: 4, y: 0, type: TetrominoType.BOX };
        AddTetrominoThere($scope.fallingTetromino, $scope.board, false);


    };

    function Animate() {

        if (!$scope.running) return;

        var tetrominoCanFall = TetrominoCanGoThere($scope.fallingTetromino, $scope.board,true);
        if (tetrominoCanFall) {

            AddTetrominoThere($scope.fallingTetromino, $scope.board,true);
            $scope.fallingTetromino.y++;
            AddTetrominoThere($scope.fallingTetromino, $scope.board, false);
            
        } else {

            //tetromino is solidified. Send the next one.
            AddTetrominoThere($scope.fallingTetromino, $scope.board, false, true);
            $scope.fallingTetromino = { x: 4, y: 0, type: TetrominoType.LINE };
            AddTetrominoThere($scope.fallingTetromino, $scope.board, false);


        }

        $scope.$apply();


        gameInterval = setTimeout(Animate, GetDelay());

    }






});
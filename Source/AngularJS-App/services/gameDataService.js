'use strict';

// this Value object contains all the values that define the game state
app.value('gameData', {

    startButtonText: "Start",
    level: 1,
    score: 0,
    lines: 0,
    running: false,
    paused: false,
    fallingTetromino: null,
    nextTetromino: null,
    nextTetrominoSquares: null,
    board: null,
    tetrominoBag: [],
    fullTetrominoBag: [0, 5, 5, 5, 5, 5, 5, 5],
    tetrominoHistory: "",
    isHighscore: false
});


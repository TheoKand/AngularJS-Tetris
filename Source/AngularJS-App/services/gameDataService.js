'use strict';

app.value('gameData', {

    startButtonText: "Start",
    level: 1,
    score: 0,
    lines:0,
    running: false,
    paused: false,
    fallingTetromino: null,
    nextTetromino: null,
    nextTetrominoSquares: null,
    board: null,
    tetrominoBag: [0, 0, 7, 7, 7, 7, 7, 7, 7],
    tetrominoHistory: "",
    isHighscore: false
});


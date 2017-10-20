'use strict';

//this singleton contains a factory function for the tetromino object and related methods. I use this way of creating the object
//because if I attach methods to the prototype, they won't exist after the object is serialized/deserialized.
var Tetromino = {

    TypeEnum: { UNDEFINED: 0, LINE: 1, BOX: 2, INVERTED_T: 3, S: 4, Z: 5, L: 6, INVERTED_L: 7 },
    Colors: ["white", "#00F0F0", "#F0F000", "#A000F0", "#00F000", "#F00000", "#F0A000", "#6363FF"],

    // a tetromino has 2 or 4 different rotations
    rotate: function (tetromino) {

        switch (tetromino.type) {

            case Tetromino.TypeEnum.LINE:
            case Tetromino.TypeEnum.S:
            case Tetromino.TypeEnum.Z:

                if (tetromino.rotation == 0)
                    tetromino.rotation = 1;
                else
                    tetromino.rotation = 0;

                break;

            case Tetromino.TypeEnum.L:
            case Tetromino.TypeEnum.INVERTED_L:
            case Tetromino.TypeEnum.INVERTED_T:

                if (tetromino.rotation < 3)
                    tetromino.rotation++;
                else
                    tetromino.rotation = 0;

                break;

        }

    },

    //Each tetromino has 4 squares arranged in a different geometrical shape. This method returns the tetromino squares
    //as a two dimensional array. Some tetrominos can also be rotated which changes the square structure
    getSquares: function (tetromino) {

        var arr = [[], []];
        arr[0] = new Array(3);
        arr[1] = new Array(3);
        arr[2] = new Array(3);
        arr[3] = new Array(3);

        switch (tetromino.type) {

            case Tetromino.TypeEnum.LINE:

                if (tetromino.rotation == 1) {

                    // ----

                    arr[1][0] = Tetromino.TypeEnum.LINE;
                    arr[1][1] = Tetromino.TypeEnum.LINE;
                    arr[1][2] = Tetromino.TypeEnum.LINE;
                    arr[1][3] = Tetromino.TypeEnum.LINE;

                } else {

                    // |
                    // |
                    // |
                    // |

                    arr[0][1] = Tetromino.TypeEnum.LINE;
                    arr[1][1] = Tetromino.TypeEnum.LINE;
                    arr[2][1] = Tetromino.TypeEnum.LINE;
                    arr[3][1] = Tetromino.TypeEnum.LINE;
                }

                break;

            case Tetromino.TypeEnum.BOX:

                arr[0][0] = Tetromino.TypeEnum.BOX;
                arr[0][1] = Tetromino.TypeEnum.BOX;
                arr[1][0] = Tetromino.TypeEnum.BOX;
                arr[1][1] = Tetromino.TypeEnum.BOX;
                break;

            case Tetromino.TypeEnum.L:
                if (tetromino.rotation == 0) {

                    //   |
                    //   |
                    // - -

                    arr[0][2] = Tetromino.TypeEnum.L;
                    arr[1][2] = Tetromino.TypeEnum.L;
                    arr[2][2] = Tetromino.TypeEnum.L;
                    arr[2][1] = Tetromino.TypeEnum.L;


                } else if (tetromino.rotation == 1) {

                    // - - -
                    //     |

                    arr[1][0] = Tetromino.TypeEnum.L;
                    arr[1][1] = Tetromino.TypeEnum.L;
                    arr[1][2] = Tetromino.TypeEnum.L;
                    arr[2][2] = Tetromino.TypeEnum.L;

                } else if (tetromino.rotation == 2) {

                    // - -
                    // |
                    // |

                    arr[1][1] = Tetromino.TypeEnum.L;
                    arr[1][2] = Tetromino.TypeEnum.L;
                    arr[2][1] = Tetromino.TypeEnum.L;
                    arr[3][1] = Tetromino.TypeEnum.L;

                } else if (tetromino.rotation == 3) {

                    // |
                    // - - -

                    arr[1][1] = Tetromino.TypeEnum.L;
                    arr[2][1] = Tetromino.TypeEnum.L;
                    arr[2][2] = Tetromino.TypeEnum.L;
                    arr[2][3] = Tetromino.TypeEnum.L;

                }


                break;

            case Tetromino.TypeEnum.INVERTED_L:

                if (tetromino.rotation == 0) {

                    // |
                    // |
                    // - -

                    arr[0][1] = Tetromino.TypeEnum.INVERTED_L;
                    arr[1][1] = Tetromino.TypeEnum.INVERTED_L;
                    arr[2][1] = Tetromino.TypeEnum.INVERTED_L;
                    arr[2][2] = Tetromino.TypeEnum.INVERTED_L;

                } else if (tetromino.rotation == 1) {

                    //     |
                    // - - -

                    arr[1][2] = Tetromino.TypeEnum.INVERTED_L;
                    arr[2][0] = Tetromino.TypeEnum.INVERTED_L;
                    arr[2][1] = Tetromino.TypeEnum.INVERTED_L;
                    arr[2][2] = Tetromino.TypeEnum.INVERTED_L;

                } else if (tetromino.rotation == 2) {

                    // - -
                    //   |
                    //   |

                    arr[1][1] = Tetromino.TypeEnum.INVERTED_L;
                    arr[1][2] = Tetromino.TypeEnum.INVERTED_L;
                    arr[2][2] = Tetromino.TypeEnum.INVERTED_L;
                    arr[3][2] = Tetromino.TypeEnum.INVERTED_L;


                } else if (tetromino.rotation == 3) {

                    // - - -
                    // |

                    arr[1][1] = Tetromino.TypeEnum.INVERTED_L;
                    arr[1][2] = Tetromino.TypeEnum.INVERTED_L;
                    arr[1][3] = Tetromino.TypeEnum.INVERTED_L;
                    arr[2][1] = Tetromino.TypeEnum.INVERTED_L;

                }


                break;

            case Tetromino.TypeEnum.INVERTED_T:

                if (tetromino.rotation == 0) {

                    //   |
                    // - - -

                    arr[0][1] = Tetromino.TypeEnum.INVERTED_T;
                    arr[1][0] = Tetromino.TypeEnum.INVERTED_T;
                    arr[1][1] = Tetromino.TypeEnum.INVERTED_T;
                    arr[1][2] = Tetromino.TypeEnum.INVERTED_T;

                } else if (tetromino.rotation == 1) {

                    //   |
                    // - |
                    //   |

                    arr[0][1] = Tetromino.TypeEnum.INVERTED_T;
                    arr[1][1] = Tetromino.TypeEnum.INVERTED_T;
                    arr[2][1] = Tetromino.TypeEnum.INVERTED_T;
                    arr[1][0] = Tetromino.TypeEnum.INVERTED_T;


                } else if (tetromino.rotation == 2) {

                    // - - -
                    //   |

                    arr[1][0] = Tetromino.TypeEnum.INVERTED_T;
                    arr[1][1] = Tetromino.TypeEnum.INVERTED_T;
                    arr[1][2] = Tetromino.TypeEnum.INVERTED_T;
                    arr[2][1] = Tetromino.TypeEnum.INVERTED_T;

                } else if (tetromino.rotation == 3) {

                    // |
                    // | -
                    // |

                    arr[0][1] = Tetromino.TypeEnum.INVERTED_T;
                    arr[1][1] = Tetromino.TypeEnum.INVERTED_T;
                    arr[1][2] = Tetromino.TypeEnum.INVERTED_T;
                    arr[2][1] = Tetromino.TypeEnum.INVERTED_T;


                }


                break;

            case Tetromino.TypeEnum.S:

                if (tetromino.rotation == 0) {

                    //   |
                    //   - -
                    //     |

                    arr[0][0] = Tetromino.TypeEnum.S;
                    arr[1][0] = Tetromino.TypeEnum.S;
                    arr[1][1] = Tetromino.TypeEnum.S;
                    arr[2][1] = Tetromino.TypeEnum.S;

                } else if (tetromino.rotation == 1) {

                    //  --
                    // --
                    //

                    arr[0][1] = Tetromino.TypeEnum.S;
                    arr[0][2] = Tetromino.TypeEnum.S;
                    arr[1][0] = Tetromino.TypeEnum.S;
                    arr[1][1] = Tetromino.TypeEnum.S;


                }


                break;

            case Tetromino.TypeEnum.Z:

                if (tetromino.rotation == 0) {

                    //     |
                    //   - -
                    //   |

                    arr[0][1] = Tetromino.TypeEnum.Z;
                    arr[1][0] = Tetromino.TypeEnum.Z;
                    arr[1][1] = Tetromino.TypeEnum.Z;
                    arr[2][0] = Tetromino.TypeEnum.Z;

                } else if (tetromino.rotation == 1) {

                    //  --
                    //   --
                    //

                    arr[0][0] = Tetromino.TypeEnum.Z;
                    arr[0][1] = Tetromino.TypeEnum.Z;
                    arr[1][1] = Tetromino.TypeEnum.Z;
                    arr[1][2] = Tetromino.TypeEnum.Z;

                }

                break;

        }

        return arr;
    },

    //the tetromino object
    tetromino: function (type, x, y, rotation) {
        this.type = (type === undefined ? Tetromino.TypeEnum.UNDEFINED : type);
        this.x = (x === undefined ? 4 : x);
        this.y = (y === undefined ? 0 : y);
        this.rotation = (rotation === undefined ? 0 : y);
    }

};

////It's used like this:

//var obj = new Tetromino.tetromino(Tetromino.TypeEnum.LINE);
//console.log(Tetromino.getSquares(obj));
//Tetromino.rotate(obj);
//console.log(Tetromino.getSquares(obj));
//var json = JSON.stringify(obj);
//var newObj = JSON.parse(json);
//console.log(Tetromino.getSquares(newObj));
//Tetromino.rotate(newObj);
//console.log(Tetromino.getSquares(newObj));
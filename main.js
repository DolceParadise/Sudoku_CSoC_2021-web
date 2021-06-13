// var sudoku = {}; 

// sudoku.DIGITS = "123456789"; // Allowed sudoku.DIGITS
// var ROWS = "ABCDEFGHI"; // Row lables
// var COLS = sudoku.DIGITS; // Column lables
// var SQUARES = null; // Square IDs

// var UNITS = null; // All units (row, column, or box)
// var SQUARE_UNITS_MAP = null; // Squares -> units map
// var SQUARE_PEERS_MAP = null; // Squares -> peers map

// var MIN_GIVENS = 17; // Minimum number of givens
// var NR_SQUARES = 81; // Number of squares

// sudoku.BLANK_CHAR = ".";
// sudoku.BLANK_BOARD =

// function initialize() {

//   SQUARES = sudoku._cross(ROWS, COLS);
//   UNITS = sudoku._get_all_units(ROWS, COLS);
//   SQUARE_UNITS_MAP = sudoku._get_square_units_map(SQUARES, UNITS);
//   SQUARE_PEERS_MAP = sudoku._get_square_peers_map(SQUARES, SQUARE_UNITS_MAP);
// }
// sudoku.generate = function (no_of_squares, unique) {
//   no_of_squares = sudoku._force_range(
//     no_of_squares,
//     NR_SQUARES + 1,
//     MIN_GIVENS
//   );

//   var blank_board = "";
//   for (var i = 0; i < NR_SQUARES; ++i) {
//     blank_board += ".";
//   }
//   var candidates = sudoku._get_candidates_map(blank_board);

//   var shuffled_squares = sudoku._shuffle(SQUARES);
//   for (var si in shuffled_squares) {
//     var square = shuffled_squares[si];

//     var rand_candidate_idx = sudoku._rand_range(candidates[square].length);
//     var rand_candidate = candidates[square][rand_candidate_idx];
//     if (!sudoku._assign(candidates, square, rand_candidate)) {
//       break;
//     }

//     var single_candidates = [];
//     for (var si in SQUARES) {
//       var square = SQUARES[si];

//       if (candidates[square].length == 1) {
//         single_candidates.push(candidates[square]);
//       }
//     }

//     if (
//       single_candidates.length >= no_of_squares &&
//       sudoku._strip_dups(single_candidates).length >= 8
//     ) {
//       var board = "";
//       var givens_idxs = [];
//       for (var i in SQUARES) {
//         var square = SQUARES[i];
//         if (candidates[square].length == 1) {
//           board += candidates[square];
//           givens_idxs.push(i);
//         } else {
//           board += sudoku.BLANK_CHAR;
//         }
//       }

//       var nr_givens = givens_idxs.length;
//       if (nr_givens > no_of_squares) {
//         givens_idxs = sudoku._shuffle(givens_idxs);
//         for (var i = 0; i < nr_givens - no_of_squares; ++i) {
//           var target = parseInt(givens_idxs[i]);
//           board =
//             board.substr(0, target) +
//             sudoku.BLANK_CHAR +
//             board.substr(target + 1);
//         }
//       }
//       if (sudoku.solve(board)) {
//         return board;
//       }
//     }
//   }

//   return sudoku.generate(no_of_squares);
// };

// sudoku.solve = function (board, reverse) {
//   // Assure a valid board
//   var report = sudoku.validate_board(board);
//   if (report !== true) {
//     throw report;
//   }
//   var nr_givens = 0;
//   for (var i in board) {
//     if (board[i] !== sudoku.BLANK_CHAR && sudoku._in(board[i], sudoku.DIGITS)) {
//       ++nr_givens;
//     }
//   }
//   if (nr_givens < MIN_GIVENS) {
//     throw "Too few givens. Minimum givens is " + MIN_GIVENS;
//   }

//   reverse = reverse || false;

//   var candidates = sudoku._get_candidates_map(board);
//   var result = sudoku._search(candidates, reverse);

//   if (result) {
//     var solution = "";
//     for (var square in result) {
//       solution += result[square];
//     }
//     return solution;
//   }
//   return false;
// };

// sudoku.get_candidates = function (board) {
//   var report = sudoku.validate_board(board);
//   if (report !== true) {
//     throw report;
//   }

//   var candidates_map = sudoku._get_candidates_map(board);

//   if (!candidates_map) {
//     return false;
//   }

//   var rows = [];
//   var cur_row = [];
//   var i = 0;
//   for (var square in candidates_map) {
//     var candidates = candidates_map[square];
//     cur_row.push(candidates);
//     if (i % 9 == 8) {
//       rows.push(cur_row);
//       cur_row = [];
//     }
//     ++i;
//   }
//   return rows;
// };

// sudoku._get_candidates_map = function (board) {

//   var report = sudoku.validate_board(board);
//   if (report !== true) {
//     throw report;
//   }

//   var candidate_map = {};
//   var squares_values_map = sudoku._get_square_vals_map(board);
//   for (var si in SQUARES) {
//     candidate_map[SQUARES[si]] = sudoku.DIGITS;
//   }

//   for (var square in squares_values_map) {
//     var val = squares_values_map[square];

//     if (sudoku._in(val, sudoku.DIGITS)) {
//       var new_candidates = sudoku._assign(candidate_map, square, val);

//       if (!new_candidates) {
//         return false;
//       }
//     }
//   }

//   return candidate_map;
// };

// sudoku._search = function (candidates, reverse) {
//   if (!candidates) {
//     return false;
//   }

//   reverse = reverse || false;
//   var max_nr_candidates = 0;
//   var max_candidates_square = null;
//   for (var si in SQUARES) {
//     var square = SQUARES[si];

//     var nr_candidates = candidates[square].length;

//     if (nr_candidates > max_nr_candidates) {
//       max_nr_candidates = nr_candidates;
//       max_candidates_square = square;
//     }
//   }
//   if (max_nr_candidates === 1) {
//     return candidates;
//   }
//   var min_nr_candidates = 10;
//   var min_candidates_square = null;
//   for (si in SQUARES) {
//     var square = SQUARES[si];

//     var nr_candidates = candidates[square].length;

//     if (nr_candidates < min_nr_candidates && nr_candidates > 1) {
//       min_nr_candidates = nr_candidates;
//       min_candidates_square = square;
//     }
//   }
//   var min_candidates = candidates[min_candidates_square];
//   if (!reverse) {
//     for (var vi in min_candidates) {
//       var val = min_candidates[vi];
//       var candidates_copy = JSON.parse(JSON.stringify(candidates));
//       var candidates_next = sudoku._search(
//         sudoku._assign(candidates_copy, min_candidates_square, val)
//       );

//       if (candidates_next) {
//         return candidates_next;
//       }
//     }
//   } else {
//     for (var vi = min_candidates.length - 1; vi >= 0; --vi) {
//       var val = min_candidates[vi];
//       var candidates_copy = JSON.parse(JSON.stringify(candidates));
//       var candidates_next = sudoku._search(
//         sudoku._assign(candidates_copy, min_candidates_square, val),
//         reverse
//       );

//       if (candidates_next) {
//         return candidates_next;
//       }
//     }
//   }
//   return false;
// };

// sudoku._assign = function (candidates, square, val) {
//   var other_vals = candidates[square].replace(val, "");

//   for (var ovi in other_vals) {
//     var other_val = other_vals[ovi];

//     var candidates_next = sudoku._eliminate(candidates, square, other_val);

//     if (!candidates_next) {
//       return false;
//     }
//   }

//   return candidates;
// };

// sudoku._eliminate = function (candidates, square, val) {
//   if (!sudoku._in(val, candidates[square])) {
//     return candidates;
//   }
//   candidates[square] = candidates[square].replace(val, "");
//   var nr_candidates = candidates[square].length;
//   if (nr_candidates === 1) {
//     var target_val = candidates[square];

//     for (var pi in SQUARE_PEERS_MAP[square]) {
//       var peer = SQUARE_PEERS_MAP[square][pi];

//       var candidates_new = sudoku._eliminate(candidates, peer, target_val);

//       if (!candidates_new) {
//         return false;
//       }
//     }

//   }
//   if (nr_candidates === 0) {
//     return false;
//   }

//   for (var ui in SQUARE_UNITS_MAP[square]) {
//     var unit = SQUARE_UNITS_MAP[square][ui];

//     var val_places = [];
//     for (var si in unit) {
//       var unit_square = unit[si];
//       if (sudoku._in(val, candidates[unit_square])) {
//         val_places.push(unit_square);
//       }
//     }

//     if (val_places.length === 0) {
//       return false;

//     } else if (val_places.length === 1) {
//       var candidates_new = sudoku._assign(candidates, val_places[0], val);

//       if (!candidates_new) {
//         return false;
//       }
//     }
//   }

//   return candidates;
// };
// sudoku._get_square_vals_map = function (board) {
//   /* Return a map of squares -> values
//    */
//   var squares_vals_map = {};

//   // Make sure `board` is a string of length 81
//   if (board.length != SQUARES.length) {
//     throw "Board/squares length mismatch.";
//   } else {
//     for (var i in SQUARES) {
//       squares_vals_map[SQUARES[i]] = board[i];
//     }
//   }

//   return squares_vals_map;
// };

// sudoku._get_square_units_map = function (squares, units) {
//   var square_unit_map = {};

//   for (var si in squares) {
//     var cur_square = squares[si];

//     var cur_square_units = [];
//     for (var ui in units) {
//       var cur_unit = units[ui];

//       if (cur_unit.indexOf(cur_square) !== -1) {
//         cur_square_units.push(cur_unit);
//       }
//     }

//     // Save the current square and its units to the map
//     square_unit_map[cur_square] = cur_square_units;
//   }

//   return square_unit_map;
// };

// sudoku._get_square_peers_map = function (squares, units_map) {
//   var square_peers_map = {};

//   for (var si in squares) {
//     var cur_square = squares[si];
//     var cur_square_units = units_map[cur_square];

//     var cur_square_peers = [];

//     for (var sui in cur_square_units) {
//       var cur_unit = cur_square_units[sui];

//       for (var ui in cur_unit) {
//         var cur_unit_square = cur_unit[ui];

//         if (
//           cur_square_peers.indexOf(cur_unit_square) === -1 &&
//           cur_unit_square !== cur_square
//         ) {
//           cur_square_peers.push(cur_unit_square);
//         }
//       }
//     }
//     square_peers_map[cur_square] = cur_square_peers;
//   }

//   return square_peers_map;
// };

// sudoku._get_all_units = function (rows, cols) {
//   var units = [];

//   // Rows
//   for (var ri in rows) {
//     units.push(sudoku._cross(rows[ri], cols));
//   }

//   // Columns
//   for (var ci in cols) {
//     units.push(sudoku._cross(rows, cols[ci]));
//   }

//   // Boxes
//   var row_squares = ["ABC", "DEF", "GHI"];
//   var col_squares = ["123", "456", "789"];
//   for (var rsi in row_squares) {
//     for (var csi in col_squares) {
//       units.push(sudoku._cross(row_squares[rsi], col_squares[csi]));
//     }
//   }

//   return units;
// };
// sudoku.validate_board = function (board) {
//   if (!board) {
//     return "Empty board";
//   }

//   // Invalid board length
//   if (board.length !== NR_SQUARES) {
//     return (
//       "Invalid board size. Board must be exactly " + NR_SQUARES + " squares."
//     );
//   }

//   // Check for invalid characters
//   for (var i in board) {
//     if (
//       !sudoku._in(board[i], sudoku.DIGITS) &&
//       board[i] !== sudoku.BLANK_CHAR
//     ) {
//       return (
//         "Invalid board character encountered at index " + i + ": " + board[i]
//       );
//     }
//   }
//   return true;
// };

// sudoku._cross = function (a, b) {
//   var result = [];
//   for (var ai in a) {
//     for (var bi in b) {
//       result.push(a[ai] + b[bi]);
//     }
//   }
//   return result;
// };

// sudoku._in = function (v, seq) {
//   return seq.indexOf(v) !== -1;
// };

// sudoku._first_true = function (seq) {
//   for (var i in seq) {
//     if (seq[i]) {
//       return seq[i];
//     }
//   }
//   return false;
// };

// sudoku._shuffle = function (seq) {
//   var shuffled = [];
//   for (var i = 0; i < seq.length; ++i) {
//     shuffled.push(false);
//   }

//   for (var i in seq) {
//     var ti = sudoku._rand_range(seq.length);

//     while (shuffled[ti]) {
//       ti = ti + 1 > seq.length - 1 ? 0 : ti + 1;
//     }

//     shuffled[ti] = seq[i];
//   }

//   return shuffled;
// };

// sudoku._rand_range = function (max, min) {
//   min = min || 0;
//   if (max) {
//     return Math.floor(Math.random() * (max - min)) + min;
//   } else {
//     throw "Range undefined";
//   }
// };

// sudoku._strip_dups = function (seq) {
//   var seq_set = [];
//   var dup_map = {};
//   for (var i in seq) {
//     var e = seq[i];
//     if (!dup_map[e]) {
//       seq_set.push(e);
//       dup_map[e] = true;
//     }
//   }
//   return seq_set;
// };

// sudoku._force_range = function (nr, max, min) {
//   min = min || 0;
//   nr = nr || 0;
//   if (nr < min) {
//     return min;
//   }
//   if (nr > max) {
//     return max;
//   }
//   return nr;
// };

// // Initialize library after load
// initialize();
const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
var timer;
var timeremaining;
var lives;
var selectednum;
var selectedtile;
var disableselect;
// var unsolvedboard = sudoku.generate(40);
// var solvedboard = sudoku.solve(unsolvedboard);


window.onload = function () {
    id("start-btn").addEventListener("click", startGame);
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].addEventListener("click", function () {
            if (!disableselect) {
                if (this.classList.contains("selected")) {
                    this.classList.remove("selected");
                    selectednum = null;
                } else {
                    for (let i = 0; i < 9; i++) {
                        id("number-container").children[i].classList.remove("selected");
                    }
                    this.classList.add("selected");
                    selectednum = this;
                    updateMove();


                }
            }
        });

    }
}

function startGame() {
    let board;
    board = medium[0];
    lives = 3;
    disableselect = false;
    id("lives").textContent = "Lives Remaining: 3";
    generateBoard(board);
    startTimer();
    id("number-container").classList.remove("hidden");
}

function startTimer() {
    if (id("time-3").checked) timeremaining = 180;
    else if (id("time-5").checked) timeremaining = 300;
    else timeremaining = 600;
    id("timer").textContent = timeConversion(timeremaining);
    timer = setInterval(function () {
        timeremaining--;
        if (timeremaining === 0) endGame();
        id("timer").textContent = timeConversion(timeremaining);
    }, 1000)
}

function timeConversion(time) {
    let minutes = Math.floor(time / 60);
    if (minutes < 10) minutes = "0" + minutes;
    let seconds = time % 60;
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
}

function generateBoard(board) {
    clearPrevious();
    let idCount = 0;
    for (let i = 0; i < 81; i++) {
        let tile = document.createElement("p");
        if (board.charAt(i) != "-") {
            tile.textContent = board.charAt(i);
        } else {
            tile.addEventListener("click", function () {
                if (!disableselect) {
                    if (tile.classList.contains("selected")) {
                        tile.classList.remove("selected");
                        selectedtile = null;
                    } else {
                        for (let i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        tile.classList.add("selected");
                        selectedtile = tile;
                        updateMove();
                    }
                }
            });
        }
        tile.id = idCount;
        idCount++;
        tile.classList.add("tile");
        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 & tile.id < 54)) {
            tile.classList.add("bottomborder")
        }
        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add("rightborder");
        }
        id("board").appendChild(tile);
    }
}

function updateMove(){
    if(selectedtile && selectednum){
        selectedtile.textContent= selectednum.textContent; 
        if (checkCorrect(selectedtile)){
            selectedtile.classList.remove("selected");
            selectednum.classList.remove("selected");
            selectednum= null;
            selectedtile= null; 
            if (checkDone()){
                endGame; 
            }

        } else {
            disableselect = true; 
            selectedtile.classList.add("incorrect");
            setTimeout(function(){
                lives --; 
                if (lives===0){
                    endGame(); 
                } else {
                    id("lives").textContent = "Lives Remaining: " + lives; 
                    disableselect = false; 
                }
                selectedtile.classList.remove("incorrect");
                selectedtile.classList.remove("selected");
                selectednum.classList.remove("selected");
                selectedtile.textContent= "";
                selectedtile = null; 
                selectednum = null; 
            }, 1000); 
        }
    }
}
function checkDone(){
    let tiles = qsa(".tile");
    for (let i = 0; i < tiles.length; i++) {
        if (tiles.textContent === "") return false;
    }
    return true; 
}
function endGame(){
    disableselect = true; 
    clearTimeout(timer) ; 
    if (lives === 0 || timeremaining === 0 ){
        id("lives"). textContent = "You Lost!";
    } else {
        id("lives"). textContent = "You Won!";
    }
}
function checkCorrect(tile){
    let solution; 
    solution = medium[1]; 
    if ( solution.charAt(tile.id)===tile.textContent) return true; 
    else return false; 
}

function clearPrevious() {
    let tiles = qsa(".tile");
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }
    if (timer) clearTimeout(timer);
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }
    selectedtile = null;
    selectednum = null;
}

function id(id) {
    return document.getElementById(id);
}

function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}
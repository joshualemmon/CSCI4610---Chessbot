var game = new Chess();
var board;

var pieceWeight = {w: {p: 10, n: 30, b: 30, r: 50, q: 90, k: 900},
                   b: {p: -10, n: -30, b: -30, r: -50, q: -90, k: -900}};

var pieces = {w: {p: 8, n: 2, b: 2, r: 2, q: 1, k: 1},
              b: {p: 8, n: 2, b: 2, r: 2, q: 1, k: 1}};

//only allows white pieces to be picked up, only lets you pick up pieces if the game isn't over
var onDragStart = function(source, piece, position, orientation) {
  if (game.in_checkmate() === true || game.in_draw() === true || piece.search(/^b/) !== -1) {
    return false;
  }
};

var makeRandomMove = function() {
  var possibleMoves = game.moves();

  // game over
  if (possibleMoves.length === 0) return;

  var randomIndex = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIndex]);
  board.position(game.fen());
};

var evaluateBoard = function(game, min) {
  var boardState = game;
  var wPawns = 0;
  var wRooks = 0;
  var wKnights = 0;
  var wQueens = 0;
  var wKings = 0;
  var wBishops = 0;

  var bPawns = 0;
  var bRooks = 0;
  var bKnights = 0;
  var bQueens = 0;
  var bKings = 0;
  var bBishops = 0;

  // count each piece on the board
  for (var i = 0; i < boardState.length; i++) {
    switch (boardState[i]) {
      case 'p': wPawns++; break;
      case 'r': wRooks++; break;
      case 'n': wKnights++; break;
      case 'q': wQueens++; break;
      case 'k': wKings++; break;
      case 'b': wBishops++; break;
      case 'P': bPawns++; break;
      case 'R': bRooks++; break;
      case 'N': bKnights++; break;
      case 'Q': bQueens++; break;
      case 'K': bKings++; break;
      case 'B': bBishops++; break;
    }
  }

  // calculate value for both sides based on piece strength
  var wValue = wPawns * 10 + wKnights * 30 + wBishops * 30
                + wRooks * 50 + wQueens * 90 + wKings * 900;

  var bValue =  bPawns * 10 + bKnights * 30 + bBishops * 30
                + bRooks * 50 + bQueens * 90 + bKings * 900;

  // return the white value if minimizing
  if (min) return wValue;
  return bValue;
}

var makeMiniMaxMove = function() {
  var possibleMoves = game.moves();
  var bestMove = null;
  var currentHighestValue = -999;

  if (possibleMoves.length === 0) return;

  for (var i = 0; i < possibleMoves.length; i++) {
    game.move(possibleMoves[i]);
    var moveValue = evaluateBoard(game.fen(), true);
    game.undo();

    if (moveValue > currentHighestValue) {
      currentHighestValue = moveValue;
      bestMove = possibleMoves[i];
    }
  }
  game.move(bestMove);
  board.position(game.fen());
}

var handleMove = function(source, target) {
    var move = game.move({from: source, to: target});

    //undo move if illegal
    if (move == null) return 'snapback';
    removeGreySquares();
    //black makes random legal move
    //will update this as we develop more of the ai
    window.setTimeout(makeMiniMaxMove, 250);
}

var onSnapEnd = function() {
  board.position(game.fen());
};

var onMouseoverSquare = function(square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  });

  // exit if there are no moves available for this square
  if (moves.length === 0) return;

  // highlight the square they moused over
  greySquare(square);

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
};

var onMouseoutSquare = function(square, piece) {
  removeGreySquares();
};

var removeGreySquares = function() {
  $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
  var squareEl = $('#board .square-' + square);

  var background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
    background = '#696969';
  }

  squareEl.css('background', background);
};

//board configuration
var cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: handleMove,
        onSnapEnd: onSnapEnd,
        onMouseoverSquare: onMouseoverSquare,
        onMouseoutSquare: onMouseoutSquare
    };
console.log("Initializing chessboard");
board = new ChessBoard('board', cfg);


$(document).ready(function() {
  $("#restart").click(function() {
    location.reload();
  });
});

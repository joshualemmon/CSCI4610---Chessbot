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

// Evaluates the board state of a move for given colour
var evaluateBoard = function(game, colour) {
  // game.fen() was over counting white bishops if piece was moved to b column
  var boardState = game.ascii();
  boardState = boardState.slice(0, boardState.length-24)
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
  // Calculate board value for given colour
  var value = wValue * (colour == 'white' ? -1 : 1 ) + bValue * (colour == 'black' ? -1 : 1);

  return value
}

// Recursively searches move space to find optimal move for AI. Uses alpha-beta
// pruning to eliminate branches that are worse than an already searched move.
var makeMiniMaxMove = function(depth, game, colour, isMaximizing, alpha, beta) {
  if (depth === 0) {
    return [evaluateBoard(game, colour), null];
  }
  var bestVal = null;
  var bestMove = null;
  var possibleMoves = game.moves();
  // Sorting possible moves randomly so that in event of tie different moves
  // will be picked. Mainly for turn 1.
  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});
  if (possibleMoves.length === 0) return null;

  // Calculates maximal move if current iteration is maximizing
  if(isMaximizing) {
    bestVal = -999;
    for (var i = 0; i < possibleMoves.length; i++) {
      game.move(possibleMoves[i]);
      moveVal = makeMiniMaxMove(depth-1, game, colour, !isMaximizing, alpha, beta)[0];
      game.undo();
      if ( moveVal > bestVal) {
        bestVal = moveVal;
        bestMove = possibleMoves[i];
      }
      alpha = Math.max(alpha, moveVal);
      if (alpha >= beta) break;
    }
    return [bestVal, bestMove];
  }
  // Calculates minimal move if current iteration is minimizing
  else {
    bestVal = 999;
    for (var i = 0; i < possibleMoves.length; i++) {
      game.move(possibleMoves[i]);
      moveVal = makeMiniMaxMove(depth-1, game, colour, !isMaximizing, alpha, beta)[0];
      game.undo();
      if ( moveVal < bestVal) {
        bestVal = moveVal;
        bestMove = possibleMoves[i];
      }
      beta = Math.min(beta, moveVal);
      if (alpha >= beta) break;
    }
    return [bestVal, bestMove];
  }
}

// Calculates and makes the AI's move
var makeMove = function() {
  // Performs minimax search to depth of 3 turns
  var bestMove = makeMiniMaxMove(3, game, 'black', true, -999, 999)[1];
  game.move(bestMove)
  board.position(game.fen())
}

// Handles user move and calculates AI move
var handleMove = function(source, target) {
    var move = game.move({from: source, to: target});

    //undo move if illegal
    if (move == null) return 'snapback';
    removeGreySquares();

    //will update this as we develop more of the ai
    window.setTimeout(makeMove, 1);
}

// Updates game board when piece is dropped
var onSnapEnd = function() {
  board.position(game.fen());
};

// Triggers when mouse enters piece square
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

// Triggers when mouse leaves piece square
var onMouseoutSquare = function(square, piece) {
  removeGreySquares();
};

// Removes gray squares from board
var removeGreySquares = function() {
  $('#board .square-55d63').css('background', '');
};

// Sets given square to grey 
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
    board = new ChessBoard('board', cfg);
  });
});

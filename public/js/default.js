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

var handleMove = function(source, target) {
    var move = game.move({from: source, to: target});

    //undo move if illegal
    if (move == null) return 'snapback';

    //black makes random legal move
    //will update this as we develop more of the ai
    window.setTimeout(makeRandomMove, 250);
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

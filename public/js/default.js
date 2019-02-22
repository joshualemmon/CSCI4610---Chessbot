var game = new Chess();
var board;
//only allows white pieces to be picked up, only lets you pick uppieces if the game isn't over
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

//board configuration
var cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: handleMove,
        onSnapEnd: onSnapEnd
    };
console.log("Initializing chessboard");
board = new ChessBoard('board', cfg);

var board,
    game = new Chess();

/*The "AI" part starts here */

var calculateBestMove = function (game) {
    var newGameMoves = game.ugly_moves();
    var captureMoves = [];

    for (var i = 0; i < newGameMoves.length; i++) {
        if (newGameMoves[i].flags == 2) {
            captureMoves.push(newGameMoves[i]);
        }
    }


    // If there are capture moves, return a random one
    if (captureMoves.length > 0) {
        return captureMoves[Math.floor(Math.random() * captureMoves.length)];
    } else {
        // Otherwise, return a random move
        return newGameMoves[Math.floor(Math.random() * newGameMoves.length)];
    }
};
/* board visualization and games state handling starts here*/

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

var makeBestMove = function () {
    var bestMove = getBestMove(game);
    game.ugly_move(bestMove);
    board.position(game.fen());
    // renderMoveHistory(game.history());
    if (game.game_over()) {
        alert('Schachmatt!');
    }
};

var getBestMove = function (game) {
    if (game.game_over()) {
        alert('Schachmatt!');
    }
    var bestMove = calculateBestMove(game);
    return bestMove;
};



var onDrop = function (source, target) {

    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }

    window.setTimeout(makeBestMove, 250);
};

var onSnapEnd = function () {
    board.position(game.fen());
};

var onMouseoverSquare = function (square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;
    colorSquare(square, 'rgba(173, 216, 230, 0.7)');

    for (var i = 0; i < moves.length; i++) {
        if (moves[i].flags.includes("c"))
            colorSquare(moves[i].to, 'rgba(224, 77, 77, 0.9)');
        else
            colorSquare(moves[i].to, 'rgba(173, 216, 230, 0.7)');
    }
};

var onMouseoutSquare = function (square, piece) {
    removeGreySquares();
};

var removeGreySquares = function () {
    $('#board .square-55d63').css('background', '');
};

var colorSquare = function (square, color) {
    var squareEl = $('#board .square-' + square);

    var background = color;
    if (squareEl.hasClass('black-3c85d') === true) {
        background = color;
    }

    squareEl.css('background', background);
};

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);
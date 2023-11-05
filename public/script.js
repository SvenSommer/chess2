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
    if (game.game_over()) {
        endGameCheck();
    }
    var bestMove = getBestMove(game);
    game.ugly_move(bestMove);
    board.position(game.fen());
    // renderMoveHistory(game.history());

};

var getBestMove = function (game) {
    if (game.game_over()) {
        endGameCheck();
    }
    var bestMove = calculateBestMove(game);
    return bestMove;
};

var checkmate = function (message) {
    // Trigger confetti
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        disableForReducedMotion: true
    });

    // Create the victory message element
    var victoryMessage = document.createElement('div');
    victoryMessage.className = 'victory-message';
    victoryMessage.textContent = message;

    // Append the victory message to the body
    document.body.appendChild(victoryMessage);

    // Remove the victory message after the animation ends
    setTimeout(function () {
        document.body.removeChild(victoryMessage);
    }, 3000); // This should match the duration of the animation

}


var onDrop = function (source, target) {

    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    removeHighlightedSquares();
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
    removeHighlightedSquares();
};

var removeHighlightedSquares = function () {
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

var currentLevel = 1; // Starting level
var lives = 4; // Starting number of lives

function updateHealth(livesLeft) {
    // Get health-bar elements
    var bars = document.querySelector('.health-bars').getElementsByClassName('health-bar');
    // Mark all bars as inactive
    for (var i = 0; i < bars.length; i++) {
        bars[i].classList.add('health-bar-inactive');
    }
    // Mark active bars based on the 'livesLeft' value
    for (var i = 0; i < livesLeft; i++) {
        bars[i].classList.remove('health-bar-inactive');
    }
    // If no lives are left, it's game over
    if (livesLeft === 0) {
        gameOver();
    }
}


function updateLevel(newLevel) {
    currentLevel = newLevel;
    document.getElementById('levelNumber').textContent = currentLevel;
}

function gameOver() {
    // Display a game over message or handle game over state
    console.log("Game Over!");
    // You can also call your checkmate function here if you want the confetti effect
    checkmate('Game Over!');
}

// Adjust this function to call when the player wins
function playerWins() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        disableForReducedMotion: true
    });
    updateLevel(currentLevel + 1); // Increment the level
}

// Adjust this function to call when the player loses
function playerLoses() {
    lives--; // Decrement the lives
    updateHealth(lives); // Update the health display
}
// Call this function when the game is over to determine win or loss
function endGameCheck() {
    if (game.in_checkmate()) {
        // Assuming player is white, if white is in checkmate, player lost
        if (game.turn() === 'w') {
            playerLoses();
        } else {
            playerWins();
        }
        restartGame();
    } else if (game.in_draw() || game.in_stalemate() || game.in_threefold_repetition() || game.insufficient_material()) {
        // Handle draw conditions
        console.log("Draw!");
        restartGame()
    }
}
board = ChessBoard('board', cfg);

function restartGame() {
    game.load(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      );
    game.reset();
    game.undo();
}



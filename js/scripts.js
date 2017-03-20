//business logic
function Player(name, mark) {
	this.name = name;
	this.mark = mark;
}

function Board() {
	this[0] = [[],[],[]];
	this[1] = [[],[],[]];
	this[2] = [[],[],[]];
}

Board.prototype.findSpot = function(x, y) {
  return this[y][x];
}

Board.prototype.checkForWin = function(board) {
	var winningCombos = [[[0,0],[1,0],[2,0]],
											 [[0,1],[1,1],[2,1]],
											 [[0,2],[1,2],[2,2]],
											 [[0,0],[0,1],[0,2]],
											 [[1,0],[1,1],[1,2]],
											 [[2,0],[2,1],[2,2]],
											 [[0,0],[1,1],[2,2]],
											 [[2,0],[1,1],[0,2]]]

	winningCombos.forEach(function(winningCombo) {
		var marks = ['X', 'O'];

		marks.forEach(function(mark) {
			if ((board.findSpot((winningCombo[0][0]), (winningCombo[0][1])) == mark) && (board.findSpot((winningCombo[1][0]), (winningCombo[1][1])) == mark) &&
			(board.findSpot((winningCombo[2][0]), (winningCombo[2][1])) == mark)) {
				alert('winner');
			}
		});
	});
}

Board.prototype.checkForTie = function(turnCount) {
	if (turnCount === 9) {
		alert('tie');
	}
}

var turnPlayer = function(turnCount, player1, player2) {
	if (turnCount % 2 !== 0) {
		return player1;
	} else {
		return player2;
	}
}


//ui logic
$(function() {
	var player1Name = prompt('Player 1 enter your name:')
	var player2Name = prompt('Player 2 enter your name:')
	var gameBoard = new Board();
	var player1 = new Player(player1Name, 'X');
	var player2 = new Player(player2Name, 'O')
	var turnCount = 0;

	$('.col-xs-4').each(function() {
		$(this).click(function() {
			var boardCoordX = $(this).data('xcoord');
			var boardCoordY = $(this).data('ycoord');
			if (gameBoard.findSpot(boardCoordX, boardCoordY).length === 0) {
				turnCount += 1;
				gameBoard.checkForTie(turnCount);
				$(this).text(turnPlayer(turnCount, player1, player2).mark);
				gameBoard.findSpot(boardCoordX, boardCoordY).push(turnPlayer(turnCount, player1, player2).mark);
				// console.log(gameBoard.findSpot(boardCoordX, boardCoordY));
			}
			gameBoard.checkForWin(gameBoard);
		});
	});
});

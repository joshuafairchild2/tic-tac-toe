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

Board.prototype.checkForWin = function() {
	if (this.findSpot(0,0).length === 1 && this.findSpot(1,0).length === 1 && this.findSpot(2,0).length === 1) {
		alert('Winner!');
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
	console.log(player1, player2);
	console.log(gameBoard);

	$('.col-xs-4').each(function() {
		$(this).click(function() {
			var boardCoordX = $(this).data('xcoord');
			var boardCoordY = $(this).data('ycoord');
			if (gameBoard.findSpot(boardCoordX, boardCoordY).length === 0) {
				turnCount += 1;
				$(this).text(turnPlayer(turnCount, player1, player2).mark);
				gameBoard.findSpot(boardCoordX, boardCoordY).push(turnPlayer(turnCount, player1, player2).mark);
				console.log(gameBoard);
			}
			gameBoard.checkForWin();
		});
	});
});

//issues:
//game can't recognize a win
//game can't recognize a scratch

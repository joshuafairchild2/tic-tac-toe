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

var turnPlayer = function(turnCount, player1, player2) {
	if (turnCount % 2 !== 0) {
		return player1;
	} else {
		return player2;
	}
}


$(function() {
	var player1Name = prompt('Player 1 enter your name:')
	var player2Name = prompt('Player 2 enter your name:')
	var gameBoard = new Board();
	var player1 = new Player(player1Name, 'X');
	var player2 = new Player(player2Name, 'O')
	var turnCount = 0;
	console.log(player1, player2);

	$('.col-xs-4').each(function() {
		$(this).click(function() {
			turnCount += 1;
			$(this).text(turnPlayer(turnCount, player1, player2).mark);
			var gridCoordX = $(this).data('xcoord');
			var gridCoordY = $(this).data('ycoord');
			gameBoard.findSpot(gridCoordX, gridCoordY).push('X');
		});
	});
});

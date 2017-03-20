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
	var win = false;
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
				win = true;
			}
		});
	});
	return win;
}

Board.prototype.checkForTie = function(turnCount) {
	if (turnCount === 9) {
		return true;
	}
}

Board.prototype.reset = function() {
	this[0] = [[],[],[]];
	this[1] = [[],[],[]];
	this[2] = [[],[],[]];
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
	$('form#players').submit(function(event) {
		var player1Name = $('input#player1name').val();
		var player2Name = $('input#player2name').val();
		$(this).hide()
		$('#board').show();

		gameBoard = new Board();
	 	player1 = new Player(player1Name, 'X');
	 	player2 = new Player(player2Name, 'O')
		turnCount = 0;
		event.preventDefault();
	});


	$('.col-xs-4').each(function() {
		$(this).click(function() {
			var boardCoordX = $(this).data('xcoord');
			var boardCoordY = $(this).data('ycoord');

			if ((gameBoard.findSpot(boardCoordX, boardCoordY).length === 0) && !(gameBoard.checkForWin(gameBoard))) {
				turnCount += 1;
				gameBoard.checkForTie(turnCount);
				$(this).text(turnPlayer(turnCount, player1, player2).mark);
				gameBoard.findSpot(boardCoordX, boardCoordY).push(turnPlayer(turnCount, player1, player2).mark);
			}

			if (gameBoard.checkForWin(gameBoard)) {
				$('#victory').show();
				$('span#winner-name').text(turnPlayer(turnCount, player1, player2).name)
			}
		});
	});

	$('button#play-again').click(function() {
		$('.col-xs-4').empty();
		gameBoard.reset(gameBoard);
		$(this).parent().hide();
	})
});

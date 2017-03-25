//business logic
//constructor function for an object storing the data of a 'Player'
function Player(name, mark) {
	this.name = name;
	this.mark = mark;
}


//constructor function for an object that models a 3x3 "two dimensional" grid of empty arrays and stores data on squares that are marked (this is the logical counterpart to the user inferface grid that is the Tic Tac Toe board)
function Board() {
	this[0] = [[],[],[]];
	this[1] = [[],[],[]];
	this[2] = [[],[],[]];
}


//returns the value of the array that is at the Board coordinates specified in the parameter
Board.prototype.findSpot = function(x, y) {
  return this[y][x];
}


//returns true if a Player has a "winning combination" inside of the Board object (x-x-x/o-o-o)
Board.prototype.checkForWin = function(board) {

	//initialize 'win' variable
	var win = false;

	//array of the combinations that trigger a win (each 2-number array represents coordinates on the Board object)
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

		//check to see if one of the marks (X, O) currently populates a winning combination, if so set 'win' to true
		marks.forEach(function(mark) {
			if ((board.findSpot((winningCombo[0][0]), (winningCombo[0][1])) == mark) && (board.findSpot((winningCombo[1][0]), (winningCombo[1][1])) == mark) &&
			(board.findSpot((winningCombo[2][0]), (winningCombo[2][1])) == mark)) {
				win = true;
			}
		});
	});
	return win;
}


//returns true if every Board coordinate has a value and neither player has won
Board.prototype.checkForTie = function(turnCount) {
	if (turnCount === 9) {
		return true;
	}
}


//transforms the Board into to an empty Board object (reset the values while keeping the same instance of the object)
Board.prototype.reset = function() {
	this[0] = [[],[],[]];
	this[1] = [[],[],[]];
	this[2] = [[],[],[]];
}


//returns which Player's turn it currently is
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

		//store values of each player's name
		var player1Name = $('input#player1name').val();
		var player2Name = $('input#player2name').val();

		//if player1Name and player2Name have a value and are different: hide the form, show the UI gameboard, display player 1 name and mark as turn player
		if (((player1Name) && (player2Name)) && (player1Name !== player2Name)) {
			$(this).hide()
			$('#board').show();
			$('#turn-player').text(player1Name);
			$('#turn-player-mark').text('X');
			$('#turn-guide').show();

			//store within global variables: new Board object, 2 new Player objects, and an integer representing the current turn (initializes at 0)
			gameBoard = new Board();
		 	player1 = new Player(player1Name, 'X');
		 	player2 = new Player(player2Name, 'O')
			turnCount = 0;
		} else {

			//if the names weren't valid
			alert('Please enter a name for each player (names must be different)')
		}
		event.preventDefault();
	});

	//click event listener applied to each of the nine squares on the UI gameboard
	$('.board-square').each(function() {
		$(this).click(function() {

			//get the coordinates of the square that was clicked
			var boardCoordX = $(this).data('xcoord');
			var boardCoordY = $(this).data('ycoord');

			//if the square that was clicked is empty on the Board object and nobody has won the game yet:
			if ((gameBoard.findSpot(boardCoordX, boardCoordY).length === 0) && !(gameBoard.checkForWin(gameBoard))) {

				//display the info for the current turn player
				$('#turn-player').text(turnPlayer(turnCount, player1, player2).name);
				$('#turn-player-mark').text(turnPlayer(turnCount, player1, player2).mark);

				//increment turn count by 1, mark the clicked square with the mark of the turn Player (p1 = 'X', p2 = 'O') and push that mark to the proper coordinate on the Board object
				turnCount++;
				$(this).text(turnPlayer(turnCount, player1, player2).mark);
				gameBoard.findSpot(boardCoordX, boardCoordY).push(turnPlayer(turnCount, player1, player2).mark);

				//check for win/tie conditions and display/hide proper content accordingly
				if (gameBoard.checkForWin(gameBoard)) {
					$('#victory').show();
					$('span#winner-name').text(turnPlayer(turnCount, player1, player2).name);
					$('#turn-guide').hide();
				} else if (gameBoard.checkForTie(turnCount)) {
					$('#tie').show();
					$('#turn-guide').hide();
				}

			}
		});
	});

	//when a '.reset-button' is clicked
	$('button.reset-button').click(function() {

		//empty the UI board and Board object of all data
		$('.board-square').empty();
		gameBoard.reset(gameBoard);
		$(this).parent().hide();

		//if player1 won the game, reverse the players (player2 becomes player1, thus getting first turn)
		if ((turnPlayer(turnCount, player1, player2).name === player1.name)) {
			[player1, player2] = [player2, player1]
		}

		//reset the turn counter, display the info for turn player (player1)
		turnCount = 0;
		$('#turn-player').text(player1.name);
		$('#turn-player-mark').text(player1.mark);
		$('#turn-guide').show();

		//if the button that was clicked also has the class 'new-players', hide the board, clear the form and display the form
		if ($(this).hasClass('new-players')) {
			$('#board').hide();
			$('form#players').show().trigger('reset');
		}
	});
});

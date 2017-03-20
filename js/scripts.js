//business logic
//creates object representing a Player
function Player(name, mark) {
	this.name = name;
	this.mark = mark;
}

//creates an empty '3x3' Board object
function Board() {
	this[0] = [[],[],[]];
	this[1] = [[],[],[]];
	this[2] = [[],[],[]];
}

//Board method that return the value of the array that is at the Board coordinates specified in the parameter
Board.prototype.findSpot = function(x, y) {
  return this[y][x];
}

//returns true if a Player has a winning combination of spots inside of the Board
Board.prototype.checkForWin = function(board) {
	//initialize 'win' variable, store within another variable all of the combinations of identically marked Board coordinates that trigger a win
	var win;
	var winningCombos = [[[0,0],[1,0],[2,0]],
											 [[0,1],[1,1],[2,1]],
											 [[0,2],[1,2],[2,2]],
											 [[0,0],[0,1],[0,2]],
											 [[1,0],[1,1],[1,2]],
											 [[2,0],[2,1],[2,2]],
											 [[0,0],[1,1],[2,2]],
											 [[2,0],[1,1],[0,2]]]

	//return true if the Board contains a winning combination
	winningCombos.forEach(function(winningCombo) {
		var marks = ['X', 'O'];

		//determine which Player has the winning combination and set the 'win' variable to true
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

//removes all elements from each 'coordinate' array within the Board object
Board.prototype.reset = function() {
	this[0] = [[],[],[]];
	this[1] = [[],[],[]];
	this[2] = [[],[],[]];
}

//returns which Player's turn it currently is (X or O)
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

		//if player1Name and player2Name have a value: hide the form, show the UI gameboard, display player 1 as turn player
		if ((player1Name) && (player2Name)) {
			$(this).hide()
			$('#board').show();
			$('#turn-player').text(player1Name);

			//store within global variables: new Board object, 2 new Player objects, number representing the current turn (initializes at 0)
			gameBoard = new Board();
		 	player1 = new Player(player1Name, 'X');
		 	player2 = new Player(player2Name, 'O')
			turnCount = 0;
		} else {
			alert('Please enter a name for each player')
		}
		event.preventDefault();
	});

	//click event listener applied to each of the nine squares on the UI gameboard
	$('.col-xs-4').each(function() {
		$(this).click(function() {
			//get the coordinates of the square that was clicked, display on index.html the name of the turn Player
			var boardCoordX = $(this).data('xcoord');
			var boardCoordY = $(this).data('ycoord');
			$('#turn-player').text(turnPlayer(turnCount, player1, player2).name)

			//if the square that was clicked is empty on the Board object and nobody has won the game yet
			if ((gameBoard.findSpot(boardCoordX, boardCoordY).length === 0) && !(gameBoard.checkForWin(gameBoard))) {
				//increase the turn count by 1, mark the clicked square with the mark of the turn Player (p1 = 'X', p2 = 'O')
				turnCount += 1;
				$(this).text(turnPlayer(turnCount, player1, player2).mark);

				//if the square that was marked causes the game to be unwinnable, display 'tie' message and hide the 'turn player' message
				if (gameBoard.checkForTie(turnCount)) {
					$('#tie').show();
					$('#turn-guide').addClass('invisible');
				} else {
					//push the turn Player's mark to the Board coordinates of the clicked square
					gameBoard.findSpot(boardCoordX, boardCoordY).push(turnPlayer(turnCount, player1, player2).mark);

					//if a Player has a winning combination present within the arrays of the Board, show 'victory' message with the winning Player's name and hide the 'turn player' message
					if (gameBoard.checkForWin(gameBoard)) {
						$('#victory').show();
						$('span#winner-name').text(turnPlayer(turnCount, player1, player2).name);
						$('#turn-guide').addClass('invisible');
					}
				}
			}

		});
	});

	//when a '.reset-button' is clicked, empty the UI board of all marks, hide the currently displayed message, reset the turn counter, display player 1's name as turn Player and show the 'turn player' message
	$('button.reset-button').click(function() {
		$('.col-xs-4').empty();
		gameBoard.reset(gameBoard);
		$(this).parent().hide();
		turnCount = 0;
		$('#turn-player').text(player1.name);
		$('#turn-guide').removeClass('invisible');
		//if the button that was clicked also has the class 'new-players', hide the board, clear the form and display the form
		if ($(this).hasClass('new-players')) {
			$('#board').hide();
			$('form#players').show().trigger('reset');
		}
	});
});

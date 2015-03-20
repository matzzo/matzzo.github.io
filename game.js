/*
* Programmed by:
* Benjamin Snoha 
* With help + additional programming from:
* Nathan Saslavsky
*/

//Canvas
var c;

//Constants
var NUMBEROFTILES = 9;
var PADDING = 20;
var TOPPADDING = 100;
var GRIDSIZE = Math.sqrt(NUMBEROFTILES);

var NUMBEROFMOVES = 3;
var MAXATTEMPTS = 10;
var MAXGOAL = 1000;
var MINGOAL = 10;

//The size of the squares are primarily based off the height of the screen. 
var RECTWIDTH = ((window.innerHeight - TOPPADDING) / (GRIDSIZE + 1));
var RECTHEIGHT = ((window.innerHeight - TOPPADDING) / (GRIDSIZE + 1));

//This is based off the number of buttons (3)
var BUTTONWIDTH = 0;
var BUTTONHEIGHT = 0;

var OPERATORS = [
    {
        f: function(x, y) {
            return x + y;
        },
        s: "+"
    },
    {
        f: function(x, y) {
            return x - y;
        },
        s: "-"
    },
    {
        f: function(x, y) {
            return x * y;
        },
        s: "x"
    }
];

var OPER_SIZE = 2 * (GRIDSIZE - 1) * GRIDSIZE;

//Misc. Variables
var gameover = false;
var mouseX;
var mouseY; 
var squares = new Array();
var squaresBackup = new Array();
var buttons = new Array();
var opers = new Array();
var goalNumber = 0;

var squareSelected = false;
var squareSelectedIndex = 0; 

function init() {
	//Set up canvas
	c = document.getElementById('_c');
	c.width = (RECTWIDTH * GRIDSIZE) + (PADDING * (GRIDSIZE - 1));
	c.height = innerHeight;
	canvas = c.getContext('2d');

	//Add mouse click listener
	c.addEventListener("click", onClick, false);
	
	//Set up some vars
	//Yes this is hardcoded - who cares
	BUTTONWIDTH = (c.width - (PADDING * 2)) / 3;
	BUTTONHEIGHT = (innerHeight - ((GRIDSIZE * RECTHEIGHT) + ((GRIDSIZE - 1) * PADDING) + TOPPADDING));

	//Clear the screen.
    clear();

	//Make the array of squares
	for(var i = 0; i < NUMBEROFTILES; i++){
		squares[i] = new Array();
	}
	
	//Generate all the squares + operators
	generateSquares();
	generateOperators();
	generateButtons();
	
	//Display the goal number
	canvas.font = getFont(0.1);
	canvas.fillStyle="#FFFFFF";
	var fontSize = canvas.font.replace(/\D+$/g, "");
	
	//Repeated attempt to find a valid path. 
	var validGoalFound = false;
	var goalNum = null;
	var tries = 0;
	
	while(!validGoalFound){
		goalNum = generateGoalNumber();
		
		if(tries > MAXATTEMPTS) {
			tries = 0;
			generateOperators();
			continue;
		}
		
		if (goalNum < MAXGOAL && goalNum > MINGOAL){
			validGoalFound = true;
		}
		
		tries++;
	}
	goalNumber = goalNum;
	
	canvas.fillText("Goal Number: " + goalNumber, PADDING, fontSize * 1.5);
	
	//Set the interview for the loop.
    setInterval(loop, 15);
}

function loop() {
	for(var i = 0; i < NUMBEROFTILES; i++){
	
		//Check for win
		if(squares[i][2] == goalNumber && !gameover){
			squares[i][3] = "#26CD26";
			gameover = true;
			alert("Won!");
		}
	
		//Draw the actual squares
		canvas.fillStyle = squares[i][3];
		canvas.fillRect(squares[i][0], squares[i][1], RECTWIDTH, RECTHEIGHT);
		
		//Draw the number on the square. 
		canvas.font = getFont(RECTWIDTH * 0.0016);
		var fontSize = canvas.font.replace(/\D+$/g, "");
		
		canvas.lineWidth = 4;
		canvas.strokeStyle = '#000000';
		canvas.fillStyle="#FFFFFF";
		canvas.textAlign = 'center';
		canvas.strokeText("  " + squares[i][2], squares[i][0] + (RECTWIDTH / 2) - (fontSize / 3), squares[i][1] + (RECTHEIGHT / 2) + (fontSize / 3));
		canvas.fillText("  " + squares[i][2], squares[i][0] + (RECTWIDTH / 2) - (fontSize / 3), squares[i][1] + (RECTHEIGHT / 2) + (fontSize / 3));
	}
	
	//Draw the operators
	canvas.font = getFont(0.05);
	var fontSize = canvas.font.replace(/\D+$/g, "");
	
	canvas.fillStyle="#FFFFFF";
	canvas.textAlign = 'center';
	
	for (var i = 0; i < NUMBEROFTILES; i++){
		//Bottom
		canvas.fillText(getOperatorText(i, i + 1), squares[i][0] + (RECTWIDTH / 2), squares[i][1] + RECTHEIGHT + (fontSize * 2/3));
		//Right
		canvas.fillText(getOperatorText(i, i + GRIDSIZE), squares[i][0] + RECTWIDTH + (PADDING / 2), squares[i][1] + (RECTHEIGHT / 2) + (fontSize / 3));
	}
	
	//Draw the buttons below the grid
	for(var i = 0; i < buttons.length; i++){
		canvas.fillStyle = buttons[i][3];
		canvas.fillRect(buttons[i][0], buttons[i][1], BUTTONWIDTH, BUTTONHEIGHT);
		
		//Draw the text on the button. 
		canvas.font = getFont(BUTTONHEIGHT * 0.0010);
		var fontSize = canvas.font.replace(/\D+$/g, "");
		
		canvas.lineWidth = 4;
		canvas.strokeStyle = '#000000';
		canvas.fillStyle="#FFFFFF";
		canvas.textAlign = 'center';
		canvas.strokeText("  " + buttons[i][2], buttons[i][0] + (BUTTONWIDTH / 2) - (fontSize * 1/3), buttons[i][1] + (BUTTONHEIGHT/2) + fontSize * 1/3);
		canvas.fillText("  " + buttons[i][2], buttons[i][0] + (BUTTONWIDTH /2) - (fontSize * 1/3), buttons[i][1] + (BUTTONHEIGHT/2) + fontSize * 1/3);
	}
}

function generateButtons(){
	//Reset button
	buttons[0] = new Array();
	buttons[0][0] = 0;
	buttons[0][1] = c.height - (innerHeight - ((GRIDSIZE * RECTHEIGHT) + ((GRIDSIZE - 1) * PADDING) + TOPPADDING));
	buttons[0][2] = "Reset";
	buttons[0][3] = "#CC0000";
	
	//Undo button
	buttons[1] = new Array();
	buttons[1][0] = BUTTONWIDTH + PADDING;
	buttons[1][1] = c.height - (innerHeight - ((GRIDSIZE * RECTHEIGHT) + ((GRIDSIZE - 1) * PADDING) + TOPPADDING));
	buttons[1][2] = "Undo";
	buttons[1][3] = "#7A0000";
	
	//Hint button
	buttons[2] = new Array();
	buttons[2][0] = (BUTTONWIDTH * 2) + (PADDING * 2);
	buttons[2][1] = c.height - (innerHeight - ((GRIDSIZE * RECTHEIGHT) + ((GRIDSIZE - 1) * PADDING) + TOPPADDING));
	buttons[2][2] = "Hint";
	buttons[2][3] = "#CC0000";
}

function generateSquares(){
	var counter = 0;
	for(var x = 0; x < GRIDSIZE; x++){
		for(var y = 0; y < GRIDSIZE; y++){			
			squares[counter][0] = x * (RECTWIDTH + PADDING);					//X
			squares[counter][1] = (y * (RECTHEIGHT + PADDING)) + TOPPADDING;	//Y
			squares[counter][2] = generateTileNumber();							//Value
			squares[counter][3] = generateTileColor(squares[counter][2]);		//Color
			counter++;
		}
	}
}

function generateOperators(){
	for (var i = 0; i < OPER_SIZE; i++){
		opers[i] = (Math.floor((Math.random() * 3)));
	}
}

function generateTileColor(index){
	var color = "#FFFFFF";
	
	switch(index % 9){
		case 0: color = "#F0F0F0"; break;
		case 1: color = "#D8D8D8"; break;
		case 2: color = "#C0C0C0"; break;
		case 3: color = "#A8A8A8"; break;
		case 4: color = "#909090"; break;
		case 5: color = "#787878"; break;
		case 6: color = "#606060"; break;
		case 7: color = "#484848"; break;
		case 8: color = "#303030"; break;
	}
	
	return color;
}

function applyOperator(currentTileIndex, nextTileIndex){
	console.log("INFO: " + " CT: " + currentTileIndex + " NT: " + nextTileIndex);
	return getOperator(currentTileIndex, nextTileIndex).f(squares[currentTileIndex][2], squares[nextTileIndex][2]);
}

function getOperatorText(currentTileIndex, nextTileIndex){
	var o = getOperator(currentTileIndex, nextTileIndex);
	
	if (o == null){
		return "";
	}
	
	return o.s;
}

//takes a tile (by index), and the next tile and returns the corresponding operator
function getOperator(currentTileIndex, nextTileIndex){  
	var col = Math.floor(currentTileIndex / GRIDSIZE);
	var operator = null;
	
	//DOWN
	if(currentTileIndex == nextTileIndex - 1){
		operator = OPERATORS[opers[currentTileIndex + (0) + (GRIDSIZE - 1) * col]];
	}
	//UP
	else if(currentTileIndex == nextTileIndex + 1){
		operator = OPERATORS[opers[currentTileIndex + (-1) + (GRIDSIZE - 1) * col]];
	}
	//LEFT
	else if(currentTileIndex == nextTileIndex - GRIDSIZE){
		operator = OPERATORS[opers[currentTileIndex + (GRIDSIZE) + (GRIDSIZE - 1) * col - 1]];
	}
	//RIGHT
	else if(currentTileIndex == nextTileIndex + GRIDSIZE){
		operator = OPERATORS[opers[currentTileIndex + (-1 * GRIDSIZE) + (GRIDSIZE - 1) * col]];
	}
	
	return operator; 
}

function generateTileNumber(){
	//Currently only begin with numbers between 1 and 9
	return Math.floor((Math.random() * 9) + 1);
}

//This decides the value of a tile after it has been moved
function updateTileNumber(ogNum){
	return ogNum * 1;
}

function getFont(ratio){
	var size = c.width * ratio;
	return (size|0) + 'px Verdana';
}

function generateGoalNumber(){
	//All of this is based off a copy of the original grid, so we make a copy.
	var oldSquaresNumbers = new Array(); 
	
	for(var i = 0; i < squares.length; i++){
		oldSquaresNumbers[i] = squares[i][2];
	}

	//Choose starting tile index within correct range.
	var currentTile = Math.floor((Math.random() * NUMBEROFTILES));
	console.log("Starting Tile: " + currentTile);
	
	//Set initial total value to the initial tile's value.
	var totalNumber = squares[currentTile][2];
	var validMove = false; 
	var nextTile = null;
	numMoves = NUMBEROFMOVES;
	
	for(var i = 0; i < numMoves; i++){
		//Check all the possible routes (up, down, left, right)
		var num = Math.floor((Math.random() * 4));
		validMove = false; 
		
		switch(num){
			//UP
			case 0: {
				if(currentTile % GRIDSIZE != 0){
					nextTile = currentTile - 1;
					validMove = true; 
					console.log("Move: UP " + "| OPERATOR: " + getOperatorText(currentTile, nextTile));
				}
			}
			break; 
			//DOWN
			case 1: {
				if((currentTile - (GRIDSIZE - 1)) % GRIDSIZE != 0){
					nextTile = currentTile + 1;
					validMove = true; 
					console.log("Move: DOWN " + "| OPERATOR: " + getOperatorText(currentTile, nextTile));
				}
			}
			break; 	
			//LEFT
			case 2: {
				if(currentTile > GRIDSIZE - 1){
					nextTile = currentTile - GRIDSIZE;
					validMove = true;
					console.log("Move: LEFT " + "| OPERATOR: " + getOperatorText(currentTile, nextTile));
				}
			}
			break;	
			//RIGHT
			case 3:{
				if(currentTile < NUMBEROFTILES - GRIDSIZE){
					nextTile = currentTile + GRIDSIZE;
					validMove = true;
					console.log("Move: RIGHT " + "| OPERATOR: " + getOperatorText(currentTile, nextTile));
				}
			}
			break;	
		}
		
		if(validMove == true){
			//Add the number on the square of the next tile to the total.
			totalNumber = applyOperator(currentTile, nextTile);
			
			//Change the old number out.
			squares[nextTile][2] = totalNumber;
			squares[currentTile][2] = updateTileNumber(squares[currentTile][2]);
			
			//Set the currentTile to the new tile. 
			currentTile = nextTile;
		}
		else{
			numMoves++;
		}
	}
	
	//Reset the numbers on the grid now that the path has been generated. 
	for(var i = 0; i < squares.length; i++){
		squares[i][2] = oldSquaresNumbers[i];
	}
	
	squaresBackup = oldSquaresNumbers;
	
	return totalNumber;
}

//Clear the screen.
function clear() {
	//Set the background color
	canvas.rect(0, 0, c.width, c.height);
	canvas.fillStyle = "#000000";
	canvas.fill();
}

//When the user clicks. 
function onClick(e) {
	var rect = c.getBoundingClientRect();  // get element's abs. position
    var tempx = e.clientX - rect.left;     // get mouse x and adjust for el.
    var tempy = e.clientY - rect.top;      // get mouse y and adjust for el.
	
	//Check that the click is within a square. 
	for(var i = 0; i < NUMBEROFTILES; i++){
		if(tempx < squares[i][0] + RECTWIDTH && tempx > squares[i][0]){
			if(tempy < squares[i][1] + RECTHEIGHT && tempy > squares[i][1]){
				if(squareSelected == false){
					//Change the color of the square that was clicked
					squares[i][3] = "#CD2626";
					squareSelected = true; 
					squareSelectedIndex = i;
				}
				else{
					//Check if the move is a valid move.
					var validMove = false; 
		
					if(i == squareSelectedIndex - 1){
						if(squareSelectedIndex % GRIDSIZE != 0){
							validMove = true; 
						}
					}
					else if(i == squareSelectedIndex + 1){
						if((squareSelectedIndex - 2) % GRIDSIZE != 0){
							validMove = true; 

						}
					}
					else if(i == squareSelectedIndex - GRIDSIZE){
						if(squareSelectedIndex > GRIDSIZE - 1){
							validMove = true;
						}
					}
					else if(i == squareSelectedIndex + GRIDSIZE){
						if(squareSelectedIndex < NUMBEROFTILES - GRIDSIZE){
							validMove = true;
						}
					}
					else if(i == squareSelectedIndex){
						squares[i][3] = generateTileColor(squares[i][2]);
						squareSelected = false; 
						squareSelectedIndex = i;
					}
					else{
						alert("Invalid move!");
					}
					
					if(validMove == true){
						//Change the new number
						squares[i][2] = applyOperator(squareSelectedIndex, i);
						squares[i][3] = generateTileColor(squares[i][2]);
					
						//Change the old number
						squares[squareSelectedIndex][2] = updateTileNumber(squares[squareSelectedIndex][2]);
						squares[squareSelectedIndex][3] = generateTileColor(squares[squareSelectedIndex][2]);
						squareSelected = true;
						squareSelectedIndex = i; 
						squares[i][3] = "#CD2626";
					}
				}
			}
		}
	}
	
	//If it is not, then they clicks somehwhere else	
	
	//Clicked the reset button
	if(tempx < buttons[0][0] + RECTWIDTH && tempx > buttons[0][0]){
		if(tempy < buttons[0][1] + RECTHEIGHT && tempy > buttons[0][1]){
			//Reset buttons using backup? sqauresBackup
		}
	}
}

init();
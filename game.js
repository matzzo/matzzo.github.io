//Benjamin Snoha

var c;
var RECTWIDTH = 100;
var RECTHEIGHT = 100;
var PADDING = 10;
var NUMBEROFTILES = 9;
var GRIDSIZE = 3;

var mouseX;
var mouseY; 
var squares = new Array();

//Init variables
function init() {
	//Set up canvas
	c = document.getElementById('_c');
	c.width = (RECTWIDTH * (NUMBEROFTILES/GRIDSIZE)) + (PADDING * (NUMBEROFTILES/GRIDSIZE - 1));
	c.height = (RECTHEIGHT * (NUMBEROFTILES/GRIDSIZE)) + (PADDING * (NUMBEROFTILES/GRIDSIZE - 1));
	canvas = c.getContext('2d');
	
	//Add mouse click listener
    c.addEventListener("click", onClick, false);

	//Clear the screen.
    clear();

	//Make the array of squares
	for(var i = 0; i < NUMBEROFTILES; i++){
		squares[i] = new Array();
	}
	
	var counter = 0;
	for(var x = 0; x < NUMBEROFTILES/GRIDSIZE; x++){
		for(var y = 0; y < NUMBEROFTILES/GRIDSIZE; y++){
			squares[counter][0] = x * (RECTWIDTH + PADDING);
			squares[counter][1] = y * (RECTHEIGHT + PADDING);
			counter++;
		}
	}
	
	//Set the interview for the loop.
    setInterval(loop, 15);
}

//The game loop
function loop() {
    //clear();
	
	//Draw a rect.
	canvas.fillStyle="#aabbcc";
	
	for(var i = 0; i < NUMBEROFTILES; i++){
		canvas.fillRect(squares[i][0], squares[i][1], RECTWIDTH, RECTHEIGHT);
	}
}

//Clear the screen.
function clear() {
    canvas.fillStyle="#ffffff";
    canvas.fillRect(0, 0, c.width, c.height);
    canvas.fillStyle="#888888";
    canvas.strokeRect(0, 0, c.width, c.height);
}

//When the user clicks. 
function onClick(e) {
	var rect = c.getBoundingClientRect();  // get element's abs. position
    var tempx = e.clientX - rect.left;     // get mouse x and adjust for el.
    var tempy = e.clientY - rect.top;      // get mouse y and adjust for el.
	
	
	//Check that the click is within the square. 
	for(var i = 0; i < NUMBEROFTILES; i++){
		if(tempx < squares[i][0] + RECTWIDTH && tempx > squares[i][0]){
			if(tempy < squares[i][1] + RECTHEIGHT && tempy > squares[i][1])
			{
				alert("Clicked Square: " + i);
			}
		}
	}
}

init();
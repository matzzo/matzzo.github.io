//Benjamin Snoha

var c;
var x = 100;
var y = 100;
var RECTWIDTH = 100;
var RECTHEIGHT = 100;

//Init variables
function init() {
	//Set up canvas
	c = document.getElementById('_c');
	c.width = window.innerWidth;
	c.height = window.innerHeight;
    canvas = c.getContext('2d');
	
	//Add mouse click listener
    c.addEventListener("click", onClick, false);

	//Clear the screen.
    clear();
	
	//Set the interview for the loop.
    setInterval(loop, 15);
}

//The game loop
function loop() {
    //clear();
	
	//Draw a rect.
	canvas.fillStyle="#aabbcc";
    canvas.fillRect(x, y, RECTWIDTH, RECTHEIGHT);
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
    var element = canvas;
    var offsetX = 0
	var offsetY = 0

	if (element.offsetParent){
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }

	//The the x and y coordinates of the mouse click.
    var tempx = e.pageX - offsetX;
    var tempy = e.pageY - offsetY;
	
	//Check that the click is within the square. 
	if(tempx < x + RECTWIDTH && tempx > x){
		if(tempy < y + RECTHEIGHT && tempy > y)
		{
			alert("Clicked Square");
		}
	}
}

init();
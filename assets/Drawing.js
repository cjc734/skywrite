
var canvas;
var context;
var canvasWidth = 1000;
var canvasHeight = 500;
var padding = 25;
var lineWidth = 8;
var planeX = 100;
var planeY = 100;


var crayonTextureImage = new Image();
var planeImage = new Image();

var totalLoadResources = 8;
var curLoadResNum = 0;

function resourceLoaded()
{
	if(++curLoadResNum >= totalLoadResources){
		redraw();
	}
}

/**
* Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
*/
function prepareCanvas()
{
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	var canvasDiv = document.getElementById('canvasDiv');
	canvas = document.createElement('canvas');

	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	//canvas.position(200, 100);
	context = canvas.getContext("2d");


	context.fillStyle = "#00bfff";
	context.fillRect(0, 0, canvas.width, canvas.height);

	this.offsetTop -= 100;
	this.offsetLeft -= 200;

	crayonTextureImage.onload = function() { resourceLoaded();
	};
	crayonTextureImage.src = "images/crayon-texture-update3.png";

	planeImage.onload = function() { resourceLoaded();
	};
	planeImage.src = "images/skywrite-cursor1.png";

	// Add mouse events
	// ----------------
	$('#canvas').mousedown(function(e){
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;

  paint = true;
  addClick(e.pageX - this.offsetLeft - 200, e.pageY - this.offsetTop - 100);
  redraw();
});

	$('#canvas').mousemove(function(e){
		if(paint==true){
			addClick(e.pageX - this.offsetLeft - 200, e.pageY - this.offsetTop - 100, true);
		}
		planeX = e.pageX - this.offsetLeft - 200;
		planeY = e.pageY - this.offsetTop - 100;
		redraw();
	});

	$('#canvas').mouseup(function(e){
		paint = false;
	  	redraw();
	});

	$('#canvas').mouseleave(function(e){
		paint = false;
	});
}

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;
var prevX;
var prevY;
var currX;
var currY;
var angle;

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

/**
* Clears the canvas.
*/
function clearCanvas()
{
	context.clearRect(0, 0, canvasWidth, canvasHeight);
}

/**
* Redraws the canvas.
*/
function redraw(){
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	context.fillStyle = "#00bfff";
	context.fillRect(0, 0, canvas.width, canvas.height);


  context.strokeStyle = "#ffffff";
  context.lineJoin = "round";
  context.lineWidth = 5;

  for(var i=0; i < clickX.length; i++) {
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.stroke();
  }

	var len = clickX.length - 1;

	prevX = clickX[len-1];
	prevY = clickY[len-1];

	currY = clickY[len];
	currX = clickX[len];

	angle = Math.sin((prevY - currY ) / (prevX - currX));



	context.drawImage(crayonTextureImage, 0, 0, canvasWidth, canvasHeight);


	context.save();
	context.translate(planeX, planeY);

	context.rotate(angle);

	context.drawImage(planeImage,  -25, -25, 50, 50);

	context.restore();


}


/**/

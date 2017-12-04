
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

	crayonTextureImage.onload = function() { resourceLoaded();
	};
	crayonTextureImage.src = "assets/images/crayon-texture-update3.png";

	planeImage.onload = function() { resourceLoaded();
	};
	planeImage.src = "assets/images/skywrite-cursor1.png";

	// Add mouse events
	// ----------------
	console.log($('#canvas'));
	$('#canvas').on("touchstart", function(e){
		if(window.isPilot){
			console.log(e);
			var mouseX = e.originalEvent.touches[0].pageX - $('#canvas').get(0).offsetLeft;
			var mouseY = e.originalEvent.touches[0].pageY - $('#canvas').get(0).offsetTop;
			paint = true;
			
			addClick(e.originalEvent.touches[0].pageX - $('#canvas').get(0).offsetLeft, e.originalEvent.touches[0].pageY - $('#canvas').get(0).offsetTop, false);
		}
	});
	$('#canvas').on("mousedown", function(e){
  document.querySelector("#sfx1").play();
  if (window.isPilot) {	
	var mouseX = e.pageX - $('#canvas').get(0).offsetLeft;
	var mouseY = e.pageY - $('#canvas').get(0).offsetTop;
    paint = true;
  	addClick(e.pageX - $('#canvas').get(0).offsetLeft, e.pageY - $('#canvas').get(0).offsetTop, false);
  }
  $
  redraw();
});

	$('#canvas').on("touchmove",function(e){
		if (window.isPilot) {
			console.log(e);
			addClick(e.originalEvent.touches[0].pageX - $('#canvas').get(0).offsetLeft, e.originalEvent.touches[0].pageY - $('#canvas').get(0).offsetTop, paint);
			planeX = e.originalEvent.touches[0].pageX - $('#canvas').get(0).offsetLeft;
			planeY = e.originalEvent.touches[0].pageY - $('#canvas').get(0).offsetTop;
			
			redraw();
		}
	});

	$('#canvas').on("mousemove",function(e){
		if (window.isPilot) {
			addClick(e.pageX - $('#canvas').get(0).offsetLeft, e.pageY - $('#canvas').get(0).offsetTop, paint);
			planeX = e.pageX - $('#canvas').get(0).offsetLeft;
			planeY = e.pageY - $('#canvas').get(0).offsetTop;
			redraw();
		}
	});

	$('#canvas').on("mouseup touchend",function(e){
		if (window.isPilot) {
			paint = false;
		    redraw();
		}
	});

	$('#canvas').on("mouseleave touchleave",function(e){
		if (window.isPilot) {
			paint = false;
		}
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
  if (window.isPilot) {
  	socket.emit('pilotDraw', JSON.stringify([x, y, dragging]));
  }
}

function addNonPilotClick(x, y, dragging) {
	addClick(x, y, dragging);
	planeX = x;
	planeY = y;
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
	  if(clickDrag[i]) {
    context.beginPath();
    if(i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
	 context.stroke();
	}
  }

	var len = clickX.length - 1;

	function smoothPrev(arr) {
		var smoothI = arr.length - 2;
		var sum = 0;
		var num = 0;
		while(smoothI > 0 && smoothI > arr.length - 10) {
			sum += arr[smoothI--];
			num++;
		}
		if (num > 0) {
			return sum / num;
		} else {
			return arr[smoothI + 1];
		}
	}

	prevX = smoothPrev(clickX);
	prevY = smoothPrev(clickY);

	currY = clickY[len];
	currX = clickX[len];

	angle = Math.atan2(currY - prevY, currX - prevX);

	context.drawImage(crayonTextureImage, 0, 0, canvasWidth, canvasHeight);

	context.save();
	context.translate(planeX, planeY);

	context.rotate(angle);

	context.drawImage(planeImage,  -38, -21, 76, 43);

	context.restore();


}
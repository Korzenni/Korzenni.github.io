$(document).ready(function() {

	var quickerCanvas = document.getElementById("quickerCanvas");
	var quickerContext = quickerCanvas.getContext("2d");
	
	var numberOfRows = 4;
	var numberOfColumns = 5;
	
	var cellWidth = $("#quickerCanvas").width() / numberOfColumns;
	var cellHeight = $("#quickerCanvas").height() / numberOfRows;
	
	var isDragged = false;
	var chosenY = 0;

	var startCellX = 0;
	var endCellX = 0;
	var cellRow = 0;

	var actualTask = new Array();
	var occupiedCells = new Array();

	function Cell() {
		this.coordinates = new Coordinates;
	}

	function Coordinates() {
	    this.x = 0;
	    this.y = 0;
	}

	function Task() {
	    this.startX = 0;
	    this.endX = 0;
	    this.row = 0;
	}

	function drawCanvas () {
		var x = 0.5;
		while (x <= $("#quickerCanvas").width() + 0.5) {
 			quickerContext.moveTo(x, 0);
			quickerContext.lineTo(x, $("#quickerCanvas").height());
			x += cellWidth;
		}
			
		var y = 0.5;
		while (y <= $("#quickerCanvas").height()) {
			quickerContext.moveTo(0, y);
			quickerContext.lineTo($("#quickerCanvas").width(), y);
			y += cellHeight;
		}

		quickerContext.strokeStyle = "#eee";
		quickerContext.stroke();			
	}

	function canvasCellCoordinate(event) {
		console.log(event);

		var x = event.pageX;
		var y = event.pageY;

		x = x - quickerCanvas.offsetLeft;
		y = y - quickerCanvas.offsetTop;

		x = Math.floor(x / cellWidth);
		y = Math.floor(y / cellHeight);

		var coordinates = new Coordinates;
		coordinates.x = x;
		coordinates.y = y;

		return coordinates;
	}

	function fillCell(x, y) {
		var fillX = x * cellWidth;
		var fillY = y * cellHeight;

		var coordinates = new Coordinates;
		coordinates.x = x;
		coordinates.y = y;
		actualTask.push(coordinates);

		quickerContext.fillStyle = "#000";
		quickerContext.fillRect(Math.floor(fillX) + 1, Math.floor(fillY) + 1, cellWidth - 1, cellHeight - 1);
	}

	function unfillCell(x, y) {
		var fillX = x * cellWidth;
		var fillY = y * cellHeight;

		quickerContext.fillStyle = "#FFF";
		quickerContext.fillRect(Math.floor(fillX) + 1, Math.floor(fillY) + 1, cellWidth - 1, cellHeight - 1);
	}

	function taskCreated(task) {
		alert("Task created with start x: " + task.startX + " end x: " + task.endX + " and row: " + task.row + ".");
	}

	function taskEdited(task) {
		alert("Task edited with start x: " + task.startX + " end x: " + task.endX + " and row: " + task.row + ".");
	}

	drawCanvas();

	$("#quickerCanvas").click(function(event) {
  		
	});

	$("#quickerCanvas").mousedown(function(event) {
  		var coordinates = canvasCellCoordinate(event);
  		actualTask = [];
  		chosenY = coordinates.y;
  		startCellX = coordinates.x;
  		endCellX = startCellX;
  		cellRow = chosenY;
  		isDragged = true;
  		fillCell(coordinates.x, chosenY);
	});

	$("#quickerCanvas").mousemove(function(event) {
		if (isDragged) {
			var coordinates = canvasCellCoordinate(event);
			endCellX = coordinates.x;
	  		fillCell(coordinates.x, chosenY);
		}
	});

	$("#quickerCanvas").mouseup(function(event) {
  		var coordinates = canvasCellCoordinate(event);
  		isDragged = false;
  		fillCell(coordinates.x, chosenY);
  		var task = new Task;
  		if (startCellX > endCellX) {
  			task.startX = endCellX;
  			task.endX = startCellX;
  		}
  		else {
			task.startX = startCellX;
  			task.endX = endCellX;
  		}
  		task.row = cellRow;
  		taskCreated(task);
	});

	$("#quickerCanvas").mouseout(function(event) {
  		if (isDragged) {
  			for (var i = 0; i < actualTask.length; i++) {
  				unfillCell(actualTask[i].x, actualTask[i].y);
  			}
  		}
  		isDragged = false;
	});
});
$(document).ready(function() {

	// ---------------- Variables ---------------- 
	var quickerCanvas = document.getElementById("quickerCanvas");
	var quickerContext = quickerCanvas.getContext("2d");
	
	var numberOfRows = 10;
	var numberOfColumns = 10;
	
	var cellWidth = $("#quickerCanvas").width() / numberOfColumns;
	var cellHeight = $("#quickerCanvas").height() / numberOfRows;
	
	var isDragged = false;
	var chosenY = 0;

	var actualTask = new Task;
	var createdTasks = [];

	// ---------------- Task class ---------------- 
	// This class is representation of one task. It holds information about occupied cells of this task and implements helper methods.
	function Task() {
		this.occupiedCells = [];
	};

	// Returns last cell of task.
	Task.prototype.endCell = function() {
		var minimumX = 0;
		var endCell;
		for (var i = 0; i < this.occupiedCells.length; i++) {
			if (this.occupiedCells[i].x > minimumX) {
				endCell = this.occupiedCells[i];
				minimumX = this.occupiedCells[i].x;
			};
		};
		return endCell;
	};

	// Returns first cell of task.
	Task.prototype.firstCell = function() {
		var maximumX = numberOfRows;
		var firstCell;
		for (var i = 0; i < this.occupiedCells.length; i++) {
			if (this.occupiedCells[i].x < maximumX) {
				firstCell = this.occupiedCells[i];
				maximumX = this.occupiedCells[i].x
			};
		};
		return firstCell;
	};

	// ---------------- Cell class ----------------  
	// Holds position information about cell in canvas.
	function Cell(x, y) {
		this.x = x;
	    this.y = y;
	};

	// ---------------- Other functions ----------------  
	// Draws canvas.
	function drawCanvas () {
		var x = 0.5;
		while (x <= $("#quickerCanvas").width() + 0.5) {
 			quickerContext.moveTo(x, 0);
			quickerContext.lineTo(x, $("#quickerCanvas").height());
			x += cellWidth;
		};
			
		var y = 0.5;
		while (y <= $("#quickerCanvas").height()) {
			quickerContext.moveTo(0, y);
			quickerContext.lineTo($("#quickerCanvas").width(), y);
			y += cellHeight;
		};

		quickerContext.strokeStyle = "#eee";
		quickerContext.stroke();			
	};

	// Detects from mouse event which cell was selected.
	function canvasCellForMouseEvent(event) {

		var x = event.pageX;
		var y = event.pageY;

		x = x - quickerCanvas.offsetLeft;
		y = y - quickerCanvas.offsetTop;

		x = Math.floor(x / cellWidth);
		y = Math.floor(y / cellHeight);

		return new Cell(x, y);
	};

	// Fills selected cell with black color.
	function fillAndCreateCell(x, y) {
		var fillX = x * cellWidth;
		var fillY = y * cellHeight;

		actualTask.occupiedCells.push(new Cell(x, y));

		quickerContext.fillStyle = "#000";
		quickerContext.fillRect(Math.floor(fillX) + 1, Math.floor(fillY) + 1, cellWidth - 1, cellHeight - 1);
	};

	// Fills selected cell with white color.
	function unfillCell(x, y) {
		var fillX = x * cellWidth;
		var fillY = y * cellHeight;

		quickerContext.fillStyle = "#FFF";
		quickerContext.fillRect(Math.floor(fillX) + 1, Math.floor(fillY) + 1, cellWidth - 1, cellHeight - 1);
	};

	// Checks if any task occupies selected cell
	function isCellOccupiedByTask(cell) {
		for (var i = 0; i < createdTasks.length; i++) {
			for (var a = 0; a < createdTasks[i].occupiedCells.length; a++) { 
				if (createdTasks[i].occupiedCells[a].x == cell.x && createdTasks[i].occupiedCells[a].y == cell.y) {
					return true;
				};
			};
		};
		return false;
	};

	// Checks if current cell (that mouse hover) is in actual crated task to avoid duplicates
	function isCellAlreadyInActualCreatedTask(cell) {
		for (var i = 0; i < actualTask.occupiedCells.length; i++) {
			if (actualTask.occupiedCells[i].x == cell.x && actualTask.occupiedCells[i].y == cell.y) {
				return true;
			};
		};
		return false;
	}

	// Returns task for given cell
	function taskForCell(cell) {
		for (var i = 0; i < createdTasks.length; i++) {
			for (var a = 0; a < createdTasks[i].occupiedCells.length; a++) {
				if (createdTasks[i].occupiedCells[a].x == cell.x && createdTasks[i].occupiedCells[a].y == cell.y) {
					return createdTasks[i];
				};
			};
		};
		return false;
	};

	// Function that is called when new task needs to be created.
	function taskWasCreated(task) {
		var firstCell = task.firstCell();
		var endCell = task.endCell();
		alert("Task created. First cell x: " + firstCell.x + ", end cell x: " + endCell.x + ", and y: " + firstCell.y);
	};

	// Function that is called when existing task needs to be edited.
	function taskWasEdited(task) {
		var firstCell = task.firstCell();
		var endCell = task.endCell();
		alert("Task edited. First cell x: " + firstCell.x + ", end cell x: " + endCell.x + ", and y: " + firstCell.y);
	};

	drawCanvas();

	$("#quickerCanvas").mousedown(function(event) {
  		var cell = canvasCellForMouseEvent(event);
  		if (isCellOccupiedByTask(cell)) {
  			var task = taskForCell(cell);
  			taskWasEdited(task);
  		}
  		else {
  			chosenY = cell.y;
	  		isDragged = true;
	  		fillAndCreateCell(cell.x, chosenY);
  		};
	});

	$("#quickerCanvas").mousemove(function(event) {
		if (isDragged) {
			var cell = canvasCellForMouseEvent(event);
			if (isCellOccupiedByTask(cell)) {
				isDragged = false;
				createdTasks.push(actualTask);
	  			taskWasCreated(actualTask);
	  			actualTask = new Task;
			}
			else {
				if (!isCellAlreadyInActualCreatedTask(cell)) {
					fillAndCreateCell(cell.x, chosenY);
				};
			};
		};
	});

	$("#quickerCanvas").mouseup(function(event) {
		if (isDragged) {
			var cell = canvasCellForMouseEvent(event);
	  		isDragged = false;
	  		if (!isCellAlreadyInActualCreatedTask(cell)) {
	  			fillAndCreateCell(cell.x, chosenY);
	  		};
	  		createdTasks.push(actualTask);
	  		taskWasCreated(actualTask);
	  		actualTask = new Task;
		};
	});

	$("#quickerCanvas").mouseout(function(event) {
  		if (isDragged) {
  			for (var i = 0; i < actualTask.occupiedCells.length; i++) {
  				unfillCell(actualTask.occupiedCells[i].x, actualTask.occupiedCells[i].y);
  			}
  			actualTask = new Task;
  		}
  		isDragged = false;
	});
});
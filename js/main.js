var GRID_SIZE = [5, 5];
var CELL_SIZE = [20, 20];
var GRID_OFFSET = [20, 20];
var NUMBER_OF_FOXES = 3;

var GRID_COLOR = "#5e5e5e";
var GRID_FONT_COLOR = "black";
var FOX_COLOR = '#f16529';
var FONT_COLOR = 'black';

var gCanvas;
var gContext;
var gHiddenFoxes;
var gFoundFoxes;
var gClickedCells;
var gStepsTaken;


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCanvas() {
    return document.getElementById('canvas');
}

function getContext() {
    return getCanvas().getContext("2d");
}

function drawGrid(gridLeftTop, gridSize, cellSize, gridColor) {
    var context = gContext;

    var initX = gridLeftTop[0] + 0.5;
    var initY = gridLeftTop[1] + 0.5;
    var maxX = gridSize[0] * cellSize[0] + initX;
    var maxY = gridSize[1] * cellSize[1] + initY;

    // рисуем вертикальные линии
    for (var x = initX; x <= maxX; x += cellSize[0]) {
      context.moveTo(x, initY);
      context.lineTo(x, maxY);
    }

    // рисуем горизонтальные линии
    for (var y = initY; y <= maxY; y += cellSize[1]) {
      context.moveTo(initX, y);
      context.lineTo(maxX, y);
    }

    context.strokeStyle = gridColor;
    context.stroke();
}

function drawNames(gridLeftTop, cellSize, color) {
    //var columnNames = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К'];
    //var rowNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    var columnNames = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var rowNames = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    var context = gContext;
    var initX, initY;

    context.font = "12px sans-serif";
    context.fillStyle = color;

    // рисуем названия столбцов
    context.textAlign = "center";
    context.textBaseline = "bottom";
    initX = gridLeftTop[0] + cellSize[0]/2;
    initY = gridLeftTop[1] - 3;
    for (var i = 0; i < Math.min(columnNames.length, GRID_SIZE[0]); i++) {
        context.fillText(columnNames[i], initX + (cellSize[0] * i), initY);
    }

    // рисуем названия рядов
    context.textAlign = "right";
    context.textBaseline = "middle";
    initX = gridLeftTop[0] - 5;
    initY = gridLeftTop[1] + cellSize[1]/2;
    for (var i = 0; i < Math.min(rowNames.length, GRID_SIZE[1]); i++) {
        context.fillText(rowNames[i], initX, initY + (cellSize[1] * i));
    }
}

function drawFox(cell, color) {
    var context = gContext;
    var x = GRID_OFFSET[0] + (cell[0] * CELL_SIZE[0]) + 1;
    var y = GRID_OFFSET[1] + (cell[1] * CELL_SIZE[1]) + 1;

    context.fillStyle = color;
    context.fillRect(x, y, CELL_SIZE[0] - 1, CELL_SIZE[1] - 1);
}

function drawNumber(number, cell, color) {
    var context = gContext;
    var x = GRID_OFFSET[0] + (cell[0] * CELL_SIZE[0]) + (CELL_SIZE[0] / 2);
    var y = GRID_OFFSET[1] + (cell[1] * CELL_SIZE[1]) + (CELL_SIZE[1] / 2);

    context.font = "bold 12px sans-serif";
    context.fillStyle = color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(number, x, y);
}

function drawFoundFoxes() {
    gFoundFoxes.forEach(function (fox) {drawFox(fox, FOX_COLOR)});
}

function drawHiddenFoxes() {
    gHiddenFoxes.forEach(function (fox) {drawFox(fox, 'gray')});
}

function drawClickedCells() {
    gClickedCells.forEach(function (cell) {
        drawNumber(countDetectableFoxes(cell, gHiddenFoxes),
                   cell,
                   FONT_COLOR);
    });
}

function redrawBoard() {
    gCanvas.width = gCanvas.width;

    drawGrid(GRID_OFFSET, GRID_SIZE, CELL_SIZE, GRID_COLOR);
    drawNames(GRID_OFFSET, CELL_SIZE, GRID_FONT_COLOR);

    drawFoundFoxes();
    //drawHiddenFoxes();
    drawClickedCells();
}

function getClickedCell(e) {
    var x;
    var y;
    var canvas = gCanvas;

    if (e.pageX != undefined && e.pageY != undefined) {
	x = e.pageX;
	y = e.pageY;
    }
    else {
	x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    x -= canvas.offsetLeft + GRID_OFFSET[0];
    y -= canvas.offsetTop + GRID_OFFSET[1];
    var cell = [Math.floor(x / CELL_SIZE[0]),
                Math.floor(y / CELL_SIZE[1])];

    if ((cell[0] >= 0 && cell[0] < GRID_SIZE[0]) &&
        (cell[1] >= 0 && cell[1] < GRID_SIZE[1]))
        return cell;
    else
        return [];
}

function placeFoxes() {
    var foxes = [];
    for (var i = 0; i < NUMBER_OF_FOXES; i++) {
        foxes.push([getRandomInt(0, GRID_SIZE[0] - 1), getRandomInt(0, GRID_SIZE[1] - 1)]);
    }
    return foxes;
}

function countDetectableFoxes(cell, foxes) {
    var count = 0;
    var fox;
    var df1 = getDetectFunc1(cell);
    var df2 = getDetectFunc2(cell);

    for (var i = 0; i < foxes.length; i++) {
        fox = foxes[i];
        if (fox[0] == cell[0] || fox[1] == cell[1] || df1(fox) || df2(fox))
            count++;
    }

    return count;
}

function getDetectFunc1(cell) {
    return function canDetect(fox) {
        if (fox[0] + fox[1] - (cell[0] + cell[1]) === 0)
            return true;
        else
            return false;
    }
}

function getDetectFunc2(cell) {
    return function canDetect(fox) {
        if (fox[0] - fox[1] + (cell[1] - cell[0]) === 0)
            return true;
        else
            return false;
    }
}

function isHiddenFox(cell) {
    var fox;
    for (var i = 0; i < gHiddenFoxes.length; i++) {
        fox = gHiddenFoxes[i];
        if (fox[0] === cell[0] && fox[1] === cell[1])
            return true;
    };
    return false;
}

function markFoxAsFound(cell) {
    function isThisCell(fox) {
        return fox[0] === cell[0] && fox[1] === cell[1]
    }

    // поместим всех лис в данной ячейке в список найденных
    gHiddenFoxes.filter(isThisCell).forEach(function (fox) {gFoundFoxes.push(fox)});
    // уберем их из списка спрятавшихся
    gHiddenFoxes = gHiddenFoxes.filter(function (fox) {return !isThisCell(fox)});
}

function setCanvasSize() {
    gCanvas.width = GRID_SIZE[0] * CELL_SIZE[0] + GRID_OFFSET[0] + 1;
    gCanvas.height = GRID_SIZE[1] * CELL_SIZE[1] + GRID_OFFSET[1] + 1;
}

function updateStats() {
    document.getElementById('hiddenFoxesCounter').textContent = gHiddenFoxes.length;
    document.getElementById('stepsCounter').textContent = gStepsTaken;
}

function initGame() {
    gCanvas = getCanvas();
    gContext = getContext();
    gCanvas.addEventListener("click", onCanvasClick, false);
    setCanvasSize();

    gHiddenFoxes = placeFoxes();
    gFoundFoxes = [];
    gClickedCells = [];
    gStepsTaken = 0;

    redrawBoard();
    updateStats();
}

function onCanvasClick(e) {
    var cell = getClickedCell(e);
    if (cell.length == 2) {
        if (isHiddenFox(cell)) {
            //drawFox(cell, 'black');
            markFoxAsFound(cell);
            redrawBoard();
        }
        else {
            drawNumber(countDetectableFoxes(cell, gHiddenFoxes), cell, FONT_COLOR);
            gClickedCells.push(cell);
        };
        gStepsTaken++;
        updateStats();
    }
}

initGame();

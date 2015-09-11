var FHO = {
    grid: {
        size: {cols: 5, rows: 5},
        cellSize: {width: 20, height: 20},
        color: "#5e5e5e",
        font: "12px sans-serif",
        fontColor: "black",
        offset: {x: 20, y: 20},
    },
    numberOfFoxes: 3,
    foxColor: "#f16529",
    fontColor: "black"
};

var FHG = {
    canvas: null,
    context: null,
    hiddenFoxes: [],
    foundFoxes: [],
    clickedCells: [],
    stepsTaken: 0
};


function Cell(col, row) {
    return {col: col, row: row};
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCanvas() {
    return document.getElementById('canvas');
}

function getContext() {
    return getCanvas().getContext("2d");
}


function drawGrid(offset, size, cellSize, color) {
    var context = FHG.context;

    var initX = offset.x + 0.5;
    var initY = offset.y + 0.5;
    var maxX = cellSize.width * size.cols + initX;
    var maxY = cellSize.height * size.rows + initY;

    // рисуем вертикальные линии
    for (var x = initX; x <= maxX; x += cellSize.width) {
      context.moveTo(x, initY);
      context.lineTo(x, maxY);
    };

    // рисуем горизонтальные линии
    for (var y = initY; y <= maxY; y += cellSize.height) {
      context.moveTo(initX, y);
      context.lineTo(maxX, y);
    };

    context.strokeStyle = color;
    context.stroke();
};

function drawNames(offset, gridSize, cellSize, font, color) {
    //var columnNames = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К'];
    //var rowNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    var columnNames = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var rowNames = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    var context = FHG.context;
    var initX, initY;

    context.font = font;
    context.fillStyle = color;

    // рисуем названия столбцов
    context.textAlign = "center";
    context.textBaseline = "bottom";
    initX = offset.x + cellSize.width/2;
    initY = offset.y - 3;
    for (var i = 0; i < Math.min(columnNames.length, gridSize.cols); i++) {
        context.fillText(columnNames[i], initX + cellSize.width * i, initY);
    };

    // рисуем названия рядов
    context.textAlign = "right";
    context.textBaseline = "middle";
    initX = offset.x - 5;
    initY = offset.y + cellSize.height/2;
    for (var i = 0; i < Math.min(rowNames.length, gridSize.rows); i++) {
        context.fillText(rowNames[i], initX, initY + cellSize.height * i);
    };
};

function drawFox(cell, color) {
    var context = FHG.context;
    var x = FHO.grid.offset.x + (cell.col * FHO.grid.cellSize.width) + 1;
    var y = FHO.grid.offset.y + (cell.row * FHO.grid.cellSize.height) + 1;

    context.fillStyle = color;
    context.fillRect(x, y, FHO.grid.cellSize.width - 1, FHO.grid.cellSize.height - 1);
}

function drawNumber(number, cell, color) {
    var context = FHG.context;
    var x = FHO.grid.offset.x + (cell.col * FHO.grid.cellSize.width) + (FHO.grid.cellSize.width / 2);
    var y = FHO.grid.offset.y + (cell.row * FHO.grid.cellSize.height) + (FHO.grid.cellSize.height / 2);

    context.font = "bold 12px sans-serif";
    context.fillStyle = color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(number, x, y);
}

function drawFoundFoxes() {
    FHG.foundFoxes.forEach(function (fox) {drawFox(fox, FHO.foxColor)});
}

function drawHiddenFoxes() {
    FHG.hiddenFoxes.forEach(function (fox) {drawFox(fox, 'gray')});
}

function drawClickedCells() {
    FHG.clickedCells.forEach(function (cell) {
        drawNumber(countDetectableFoxes(cell, FHG.hiddenFoxes),
                   cell,
                   FHO.fontColor);
    });
}

function redrawBoard() {
    // erase canvas' content and reset it's properties
    FHG.canvas.width = FHG.canvas.width;

    drawGrid(FHO.grid.offset, FHO.grid.size, FHO.grid.cellSize, FHO.grid.color);
    drawNames(FHO.grid.offset,
              FHO.grid.size,
              FHO.grid.cellSize,
              FHO.grid.font,
              FHO.grid.fontColor);

    drawFoundFoxes();
    drawHiddenFoxes();
    drawClickedCells();

    //drawDots();
}


function countDetectableFoxes(cell, foxes) {
    var count = 0;
    var fox;
    var df1 = getDetectFunc1(cell);
    var df2 = getDetectFunc2(cell);

    for (var i = 0; i < foxes.length; i++) {
        fox = foxes[i];
        if (fox.col == cell.col || fox.row == cell.row || df1(fox) || df2(fox))
            count++;
    }

    return count;
}

function getDetectFunc1(cell) {
    return function canDetect(fox) {
        if (fox.col + fox.row - (cell.col + cell.row) === 0)
            return true;
        else
            return false;
    }
}

function getDetectFunc2(cell) {
    return function canDetect(fox) {
        if (fox.col - fox.row + (cell.row - cell.col) === 0)
            return true;
        else
            return false;
    }
}

function isHiddenFox(cell) {
    var fox;
    for (var i = 0; i < FHG.hiddenFoxes.length; i++) {
        fox = FHG.hiddenFoxes[i];
        if (fox.col === cell.col && fox.row === cell.row)
            return true;
    };
    return false;
}

function markFoxAsFound(cell) {
    function isThisCell(fox) {
        return fox.col === cell.col && fox.row === cell.row
    }

    // поместим всех лис в данной ячейке в список найденных
    FHG.hiddenFoxes.filter(isThisCell).forEach(function (fox) {FHG.foundFoxes.push(fox)});
    // уберем их из списка спрятавшихся
    FHG.hiddenFoxes = FHG.hiddenFoxes.filter(function (fox) {return !isThisCell(fox)});
}

function updateStats() {
    document.getElementById('hiddenFoxesCounter').textContent = FHG.hiddenFoxes.length;
    document.getElementById('stepsCounter').textContent = FHG.stepsTaken;
}

function getClickedCell(e) {
    var x;
    var y;
    var canvas = FHG.canvas;

    if (e.pageX != undefined && e.pageY != undefined) {
	x = e.pageX;
	y = e.pageY;
    }
    else {
	x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    x -= canvas.offsetLeft + FHO.grid.offset.x;
    y -= canvas.offsetTop + FHO.grid.offset.y;
    var cell = Cell(Math.floor(x / FHO.grid.cellSize.width),
                    Math.floor(y / FHO.grid.cellSize.height));

    if ((cell.col >= 0 && cell.col < FHO.grid.size.cols) &&
        (cell.row >= 0 && cell.row < FHO.grid.size.rows))
        return cell;
    else
        return null;
}

function onCanvasClick(e) {
    var cell = getClickedCell(e);
    if (cell) {
        if (isHiddenFox(cell)) {
            markFoxAsFound(cell);
            redrawBoard();
        }
        else {
            drawNumber(countDetectableFoxes(cell, FHG.hiddenFoxes), cell, FHO.fontColor);
            FHG.clickedCells.push(cell);
        };
        FHG.stepsTaken++;
        updateStats();
    }
}


function setCanvasSize() {
    FHG.canvas.width = FHO.grid.size.cols * FHO.grid.cellSize.width + FHO.grid.offset.x + 1;
    FHG.canvas.height = FHO.grid.size.rows * FHO.grid.cellSize.height + FHO.grid.offset.y + 1;
}

function placeFoxes() {
    var foxes = [];
    for (var i = 0; i < FHO.numberOfFoxes; i++) {
        foxes.push(Cell(getRandomInt(0, FHO.grid.size.cols - 1),
                        getRandomInt(0, FHO.grid.size.rows - 1)));
    }
    return foxes;
}

function initGame() {
    FHG.canvas = getCanvas();
    FHG.context = getContext();
    FHG.canvas.addEventListener("click", onCanvasClick, false);
    setCanvasSize();

    FHG.hiddenFoxes = placeFoxes();
    FHG.foundFoxes = [];
    FHG.clickedCells = [];
    FHG.stepsTaken = 0;

    redrawBoard();
    updateStats();
}

initGame();


function drawDots() {
    var context = FHG.context;
    var o = FHO.grid;

    //context.fillStyle = 'red';
    //context.fillRect(o.offset.x, o.offset.y, 1, 1);

    context.beginPath();

    var initX = o.offset.x + 0.5;

    context.moveTo(initX, o.offset.y - 1);
    context.lineTo(initX, o.offset.y + 1);

    context.moveTo(initX + o.cellSize.width, o.offset.y - 1);
    context.lineTo(initX + o.cellSize.width, o.offset.y + 1);

    context.strokeStyle = "red";
    context.stroke();
}

function getCellPos(cell) {
    var offset = FHO.grid.offset;
    var cellSize = FHO.grid.cellSize;

    var pos = {
        left: offset.x + (cellSize.width * cell.col) + 1,
        top: offset.y + (cellSize.height * cell.row) + 1,
    };
    pos.right = pos.left + cellSize.width - 1;
    pos.bottom = pos.top + cellSize.height - 1;

    pos.border = {};
    pos.border.left = pos.left - 0.5;
    pos.border.right = pos.right + 0.5;
    pos.border.top = pos.top - 0.5;
    pos.border.bottom = pos.bottom + 0.5;

    return pos;
}

const xhttp = new XMLHttpRequest();
const xhttp2 = new XMLHttpRequest();

// Data on canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Data on grid
const gridSize = 30;

// Dimensions of the grid
let tilesOnRow = 0;
let tilesOnColumn = 0;


// The grid to find
let gameGrid;

// The clue numbers displayed on lines and columns
let cluesOnColumns;
let cluesOnRows;

// The current grid for the player
let currentGrid;

const colors = [
    "white", // 0 : blank
    "black", // 1 : full
    "red",   // 2 : cross
    "lightblue" // 3 : mouseover
]

let currentFill = 1;

function drawGrid(){
    for(let i=0; i<=tilesOnRow; i++){
        ctx.moveTo(i*gridSize, 0);
        ctx.lineTo(i*gridSize, tilesOnColumn*gridSize);
    }
    for(let j=0; j<=tilesOnColumn; j++){
        ctx.moveTo(0, j*gridSize);
        ctx.lineTo(tilesOnRow*gridSize, j*gridSize);
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();
}

function fillGrid() {
    for (let i=0 ; i<tilesOnRow ; i++){
        for (let j=0 ; j<tilesOnColumn ; j++){
            drawSquare(i, j, colors[currentGrid[j][i]]);
        }
    }
}

function drawSquare(x, y, color){
    ctx.strokeStyle = "black";
    ctx.fillStyle = color;
    ctx.fillRect(x*gridSize, y*gridSize, gridSize, gridSize);
    ctx.strokeRect(x*gridSize, y*gridSize, gridSize, gridSize);
}

let currentX = 0;
let currentY = 0;

canvas.addEventListener("mousemove", (p) => {
    const xCoord = Math.floor(p.offsetX / gridSize);
    const yCoord = Math.floor(p.offsetY / gridSize);

    if(xCoord != currentX || yCoord != currentY){
        //console.log(xCoord, yCoord);

        // Draw the new square
        drawSquare(xCoord, yCoord, "lightblue");
        // Restore the ancient square
        drawSquare(currentX, currentY, colors[currentGrid[currentY][currentX]]);
        
        // Update the new coordinates
        currentX = xCoord;
        currentY = yCoord;
    
    }   
    
})

canvas.addEventListener("click", (p) => {
    const xCoord = Math.floor(p.offsetX / gridSize);
    const yCoord = Math.floor(p.offsetY / gridSize);

    // The current color of the tile where you click
    const currentTileColor = currentGrid[yCoord][xCoord];

    // To fill a tile
    if(currentFill == 1){

        if(currentTileColor == 0) currentGrid[yCoord][xCoord] = 1;
        else if(currentTileColor == 1) currentGrid[yCoord][xCoord] = 0;
      
    // To cross a tile
    } else if(currentFill == 2) {

        if(currentTileColor == 0) currentGrid[yCoord][xCoord] = 2;
        else if (currentTileColor == 2) currentGrid[yCoord][xCoord] = 0;

    }
    
    console.log(currentGrid);
    
    // Refill the grid with the correct colors
    fillGrid();
})

// functions to charge the level
function getLevel(){
    console.log("I charge the level ...");

    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4){

            let data = JSON.parse(this.responseText);

            // Updating the dimensions
            tilesOnRow = data.width;
            tilesOnColumn = data.heigth;
            console.log("This level dimensions are", tilesOnRow, tilesOnColumn);

            // Redimensioning the canvas
            canvas.width = tilesOnRow * gridSize;
            canvas.height = tilesOnColumn * gridSize;

            // Redimensioning the spaces for the column and row clues
            const rowClues = document.getElementById("row-clues");
            const columnClues = document.getElementById("column-clues");
            rowClues.style.height = canvas.height;
            columnClues.style.width = canvas.width;

            console.log("Canvas width and height :", canvas.width, canvas.height);

            // Copying the game grid
            gameGrid = data.gameGrid;
            console.log(gameGrid);

            // Computing the clue numbers displayed on the rows and columns

            // Clues on rows
            cluesOnRows = new Array(tilesOnColumn);
            for(let j = 0; j<tilesOnColumn; j++){
                let currentBlock = 0;
                cluesOnRows[j] = new Array();
                for(let i = 0; i<tilesOnRow; i++){
                    if (gameGrid[j][i] == 1){
                        currentBlock++;
                        if (i == tilesOnRow-1){
                            cluesOnRows[j].push(currentBlock);
                            currentBlock = 0;
                        }
                    } else {
                        if (currentBlock > 0){
                            cluesOnRows[j].push(currentBlock);
                            currentBlock = 0;
                        }
                    }
                    
                }
            }

            // Clues on columns
            cluesOnColumns = new Array(tilesOnRow);
            for(let i = 0; i<tilesOnRow; i++){
                let currentBlock = 0;
                cluesOnColumns[i] = new Array();
                for(let j = 0; j<tilesOnColumn; j++){
                    if(gameGrid[j][i] == 1){
                        currentBlock++;
                        if(j == tilesOnColumn-1){
                            cluesOnColumns[i].push(currentBlock);
                            currentBlock = 0;
                        }
                    } else {
                        if (currentBlock > 0){
                            cluesOnColumns[i].push(currentBlock);
                            currentBlock = 0;
                        }
                    }
                }
            }
            
            console.log(cluesOnRows);
            console.log(cluesOnColumns);

            // IMPORTANT //
            ///////////////
            // The left of the grid (without clues) is aligned with center. 
            // Here we create an offset to align GRID AND CLUES with center
            const maxNbCluesOnColumns = Math.max(...cluesOnColumns.map(arr => arr.length));
            const maxNbCluesOnRows = Math.max(...cluesOnRows.map(arr => arr.length));

            const gameContainer = document.getElementById("game-container");
            gameContainer.style.left = Math.floor((maxNbCluesOnRows*gridSize - canvas.width)/2) + "px";
            gameContainer.style.top = Math.floor(maxNbCluesOnColumns*gridSize/2) + "px";

            ///////////////
            // IMPORTANT //

            // Creating the clues display
            // for columns (horizontally)
            for(let i=0 ; i<tilesOnRow ; i++){
                const clue = document.createElement("div");
                clue.className = "one-column-clues";

                clue.style.width = gridSize;
                // Nothing on height cause it is filled vertically
                
                cluesOnColumns[i].forEach((nb) => {
                    const part = document.createElement("div");
                    part.className = "part-of-clue";
                    part.style.width = gridSize;
                    part.style.height = gridSize;
                    part.textContent = nb.toString();
                    clue.appendChild(part);
                });

                columnClues.appendChild(clue);
            }
            // and for rows (vertically)
            for(let j=0 ; j<tilesOnColumn ; j++){
                const clue = document.createElement("div");
                clue.className = "one-row-clues";

                clue.style.height = gridSize;
                // Nothing on width cause it is filled horizontally
                
                cluesOnRows[j].forEach((nb) => {
                    const part = document.createElement("div");
                    part.className = "part-of-clue";
                    part.style.width = gridSize;
                    part.style.height = gridSize;
                    part.textContent = nb.toString();
                    clue.appendChild(part);
                });

                rowClues.appendChild(clue);
            }

            // Creating the blank current grid
            currentGrid = Array.from(Array(tilesOnColumn), () => new Array(tilesOnRow).fill(0));

            console.log(currentGrid);

            // Constructing the grid background
            drawGrid();
            fillGrid();
        }
    }

    xhttp.open("GET", "../getLevel");
    xhttp.send();
}

function getLevelNumber() {
    console.log("I search for the level number ...");
    xhttp2.onreadystatechange = function () {
        if(this.status == 200 && this.readyState == 4){
            console.log("I found the level number !");
            document.getElementById("levelNumber").textContent = this.responseText;
        }
    }
    xhttp2.open("GET", "../getLevelNumber");
    xhttp2.send();
}

// Implementing the button to return to the levels page
document.getElementById("returnToLevels").addEventListener("click", function() {
    window.location = "../levels";
});

getLevelNumber();
getLevel();
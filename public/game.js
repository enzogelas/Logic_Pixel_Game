const xhttp = new XMLHttpRequest();
const xhttp2 = new XMLHttpRequest();

// Data on canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Data on grid
const gridSize = 40;

// Dimensions of the grid
let tilesOnRow = 0;
let tilesOnColumn = 0;


// The grid to find
let gameGrid;

// The clue numbers displayed on lines and columns
let numbersOnColumns;
let numbersOnRows;

// The current grid for the player
let currentGrid;

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

let currentX = -1;
let currentY = -1;

canvas.addEventListener("mousemove", (p) => {
    const xCoord = Math.floor(p.offsetX / gridSize);
    const yCoord = Math.floor(p.offsetY / gridSize);
    // console.log(xCoord, yCoord);

    if(xCoord != currentX || yCoord != currentY){
        ctx.strokeStyle = "black";
        ctx.fillStyle = "white";
        ctx.fillRect(currentX*gridSize, currentY*gridSize, gridSize, gridSize)
        ctx.strokeRect(currentX*gridSize, currentY*gridSize, gridSize, gridSize)
        ctx.fillStyle = "blue";
        ctx.fillRect(xCoord*gridSize, yCoord*gridSize, gridSize, gridSize);
        ctx.strokeRect(xCoord*gridSize, yCoord*gridSize, gridSize, gridSize);
        currentX = xCoord;
        currentY = yCoord;
    }   
    
})

canvas.addEventListener("click", (p) => {
    // TEMPORARY //
    ///////////////
    const xCoord = Math.floor(p.offsetX / gridSize);
    const yCoord = Math.floor(p.offsetY / gridSize);
    ctx.fillStyle = "black";
    ctx.fillRect(xCoord*gridSize, yCoord*gridSize, gridSize, gridSize);
    ///////////////
    // TEMPORARY //
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

            console.log("Canvas width and height :", canvas.width, canvas.height);

            // Copying the game grid
            gameGrid = data.gameGrid;
            console.log(gameGrid);

            // Computing the clue numbers displayed on the rows and columns

            // Clues on rows
            numbersOnRows = new Array(tilesOnColumn);
            for(let j = 0; j<tilesOnColumn; j++){
                let currentBlock = 0;
                numbersOnRows[j] = new Array();
                for(let i = 0; i<tilesOnRow; i++){
                    if (gameGrid[j][i] == 1){
                        currentBlock++;
                        if (i == tilesOnRow-1){
                            numbersOnRows[j].push(currentBlock);
                            currentBlock = 0;
                        }
                    } else {
                        if (currentBlock > 0){
                            numbersOnRows[j].push(currentBlock);
                            currentBlock = 0;
                        }
                    }
                    
                }
            }

            // Clues on columns
            numbersOnColumns = new Array(tilesOnRow);
            for(let i = 0; i<tilesOnRow; i++){
                let currentBlock = 0;
                numbersOnColumns[i] = new Array();
                for(let j = 0; j<tilesOnColumn; j++){
                    if(gameGrid[j][i] == 1){
                        currentBlock++;
                        if(j == tilesOnColumn-1){
                            numbersOnColumns[i].push(currentBlock);
                            currentBlock = 0;
                        }
                    } else {
                        if (currentBlock > 0){
                            numbersOnColumns[i].push(currentBlock);
                            currentBlock = 0;
                        }
                    }
                }
            }
            
            console.log(numbersOnRows);
            console.log(numbersOnColumns);

            // Creating the blank current grid
            currentGrid = new Array(tilesOnRow);

            for (let i = 0; i < tilesOnRow; i++) {
                currentGrid[i] = new Array(tilesOnColumn);
                for (let j = 0; j < tilesOnColumn; j++) {
                    currentGrid[i][j] = 0;
                }
            }

            console.log(currentGrid);

            // Constructing the grid background
            drawGrid();
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
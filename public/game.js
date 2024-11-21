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

// For final display
let colorsForFinalGrid;
let coloredGrid;

// Load image of cross
const crossImage = new Image();
crossImage.src = "icons/cross.png";

const colors = [
    {"type": "color", data:"white"}, // 0 : blank
    {"type": "color", data:"black"}, // 1 : full
    {"type": "image", data:crossImage},   // 2 : cross
]

function drawRails(){
    ctx.lineWidth = 2;

    for(let i=0; i<=tilesOnRow; i++){
        
        ctx.beginPath();

        if (i % 5 == 0) {
            ctx.strokeStyle = "#222";
        } else {
            ctx.strokeStyle = "darkgray";
        }

        // Draw vertical lines
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, tilesOnColumn * gridSize);

        ctx.stroke();
    }
    for(let j=0; j<=tilesOnColumn; j++){

        ctx.beginPath();

        if (j % 5 == 0) {
            ctx.strokeStyle = "#222";
        } else {
            ctx.strokeStyle = "darkgray";
        }

        ctx.moveTo(0, j*gridSize);
        ctx.lineTo(tilesOnRow*gridSize, j*gridSize);

        ctx.stroke();
    }

}

function fillGrid() {
    for (let i=0 ; i<tilesOnRow ; i++){
        for (let j=0 ; j<tilesOnColumn ; j++){
            drawSquare(i, j, colors[currentGrid[j][i]]);
        }
    }
    drawRails();
}

function drawColoredSquare(nb){
    const x = Math.floor(nb / tilesOnRow);
    const y = nb % tilesOnRow; 
    ctx.fillStyle = colorsForFinalGrid[coloredGrid[y][x]];
    ctx.fillRect(x*gridSize, y*gridSize, gridSize, gridSize);
}

function fillGridWithColors() {
    // Wipe the board
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    document.getElementById("column-clues").style.display = "none";
    document.getElementById("row-clues").style.display = "none";

    let a = [...Array(tilesOnRow*tilesOnColumn).keys()];
    console.log(a);
    for (let i = a.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [a[i], a[j]] = [a[j], a[i]]; 
    } 
    let nb = 0;
    let intervalId = setInterval(() => {
        drawColoredSquare(a[nb]);
        nb++;
        if(nb == a.length) clearInterval(intervalId);
    }, 20)
}

function drawSquare(x, y, color){
    if(color.type == "color"){
        ctx.fillStyle = color.data;
        ctx.fillRect(x*gridSize, y*gridSize, gridSize, gridSize);
    } else if (color.type == "image"){
        ctx.fillStyle = "white";
        ctx.fillRect(x*gridSize, y*gridSize, gridSize, gridSize);
        ctx.drawImage(color.data, x*gridSize, y*gridSize, gridSize, gridSize)
    }
}

// Mouse events on the game grid
let currentX = 0;
let currentY = 0;

let mouseIn = false;
let mousePressed = false;

// Fill a tile with the new fill style
function changeTile(currentFill, currentTileFill, x, y){
    if(currentFill == 1){

        if(currentTileFill == 0) currentGrid[y][x] = 1;
        else if(currentTileFill == 1) currentGrid[y][x] = 0;
      
    // To cross a tile
    } else if(currentFill == 2) {

        if(currentTileFill == 0) currentGrid[y][x] = 2;
        else if (currentTileFill == 2) currentGrid[y][x] = 0;

    }
}

canvas.addEventListener("mousemove", (p) => {
    // console.log("Mouse moves !");
    
    const xCoord = Math.floor(p.offsetX / gridSize);
    const yCoord = Math.floor(p.offsetY / gridSize);

    if(xCoord != currentX || yCoord != currentY){
        currentX = xCoord;
        currentY = yCoord;
        if (mousePressed) {

            // The current color of the tile where you click
            const currentTileFill = currentGrid[yCoord][xCoord];
            // Fill the tile
            changeTile(currentFill, currentTileFill, xCoord, yCoord);
            // Refill the grid with the correct colors
            fillGrid();

            // Verifying if the grid is correct
            verifyGrid();
        }
    }   
    
});

window.addEventListener("mousedown", () => {
    mousePressed = true;
})

canvas.addEventListener("mousedown", (p) => {
    mousePressed = true;

    const xCoord = Math.floor(p.offsetX / gridSize);
    const yCoord = Math.floor(p.offsetY / gridSize);

    currentX = xCoord;
    currentY = yCoord;

    // The current color of the tile where you click
    const currentTileFill = currentGrid[yCoord][xCoord];
    // Fill the tile
    changeTile(currentFill, currentTileFill, xCoord, yCoord);
    // Refill the grid with the correct colors
    fillGrid();

    // Verifying if the grid is correct
    verifyGrid();
});

window.addEventListener("mouseup", () => {
    mousePressed = false;
})

canvas.addEventListener("mouseenter", () => {
    mouseIn = true;
});

canvas.addEventListener("mouseleave", () => {
    mouseIn = false;
});

// Handling cross and fill buttons
let currentFill = 0;

const fillButton = document.getElementById("fill");
const crossButton = document.getElementById("cross");

// To display correctly the chosen mode
function updateFillButtonsDisplay() {
    if (currentFill == 1){
        fillButton.style.border = "solid 4px yellow";
        crossButton.style.border = "0px";
    } else if(currentFill == 2) {
        fillButton.style.border = "0px";
        crossButton.style.border = "solid 4px yellow"; 
    }
}

fillButton.addEventListener("click", () => {
    if (currentFill != 1){
        currentFill = 1;
        updateFillButtonsDisplay();
    } 
});

crossButton.addEventListener("click", () => {
    if (currentFill != 2){
        currentFill = 2;
        updateFillButtonsDisplay()
    }
});

function verifyGrid(){
    console.log("I'm verifying the grid ...");
    for(let i=0 ; i<tilesOnRow ; i++){
        for(let j=0 ; j<tilesOnColumn ; j++){
            const tileToFind = gameGrid[j][i];
            const currentTile = currentGrid[j][i];
            if(tileToFind == 0 && currentTile == 1){
                return false;
            } 
            if(tileToFind == 1 && currentTile !=1){
                return false;
            } 
        }
    }
    document.getElementById("level").textContent = "WIN !!!"
    fillGridWithColors();
    return true;
}


// functions to charge the level
function getLevel(){
    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4){

            let data = JSON.parse(this.responseText);

            if (Object.keys(data).length == 0) alert("The level is not defined yet !");
            else {

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

            // Copying the game grid
            gameGrid = data.gameGrid;

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

            // IMPORTANT //
            ///////////////
            // The left of the grid (without clues) is aligned with center. 
            // Here we create an offset to align GRID AND CLUES with center

            const maxNbCluesOnColumns = Math.max(...cluesOnColumns.map(arr => arr.length));
            const maxNbCluesOnRows = Math.max(...cluesOnRows.map(arr => arr.length));

            const gameContainer = document.getElementById("game-container");
            gameContainer.style.left = Math.floor(( - canvas.width)/2) + "px";
            gameContainer.style.top = Math.floor(maxNbCluesOnColumns*gridSize) + "px";

            ///////////////

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

            // Saving information for final display
            colorsForFinalGrid = data.colorsForFinalGrid;
            coloredGrid = data.coloredGrid;

            // Creating the blank current grid
            currentGrid = Array.from(Array(tilesOnColumn), () => new Array(tilesOnRow).fill(0));

            // Constructing the grid background
            fillGrid();
            }
        }
    }

    xhttp.open("GET", "../getLevel");
    xhttp.send();
}

function getLevelNumber() {
    xhttp2.onreadystatechange = function () {
        if(this.status == 200 && this.readyState == 4){
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
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

let currentLevel = 1;

// To go to the welcome page
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

// To go the levels page
app.get("/levels", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'levels.html'));
});


// To go the game page
app.get("/game", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

app.get("/getLevelNumber", (req,res) => {
    res.end(currentLevel.toString());
})

app.get("/switchToLevel", (req,res) => {
    const level = req.query.level;
    currentLevel = level;
    console.log(currentLevel);
})

app.get("/getLevel", (req,res) => {
    console.log("You ask for the level :", currentLevel);
    const levelFile = "levels/" + currentLevel + ".json";
    fs.readFile(levelFile, 'utf8', (err, data) => {
        if(err) {
            console.log("Level",currentLevel,"is not defined yet !");
            res.end("");
        } else {
            res.end(data);
        }       
    })
})

app.listen(8000, () => {
    console.log("Application started on port 8000");
});
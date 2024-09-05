let nbOfLevels = 30;

const div = document.getElementById("buttonsDiv");

for(let i=1; i<=nbOfLevels; i++) {
    const button = document.createElement("button");
    button.id = i;
    button.textContent = i.toString();
    button.className = "levelButton";

    button.onclick = () => {
        askForLevel(i);
        window.location = "../game"
    }

    div.appendChild(button);
}

const xhttp = new XMLHttpRequest();

function askForLevel(levelId){
    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4){
            window.location = "../game";
        }
    }

    xhttp.open("GET", "../switchToLevel?level="+levelId);
    xhttp.send();
}